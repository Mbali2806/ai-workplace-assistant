import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/Markdown";
import { Disclaimer } from "@/components/Disclaimer";
import { Copy, RotateCcw, Sparkles, Pencil, Eye } from "lucide-react";
import { toast } from "sonner";
import { useLocalStorage } from "@/lib/storage";

type Kind = "email" | "summary" | "plan" | "research";

interface Props {
  kind: Kind;
  title: string;
  description: string;
  icon: React.ReactNode;
  inputLabel: string;
  inputPlaceholder: string;
  ctaLabel?: string;
  storageKey: string;
  fields?: Array<{
    key: string;
    label: string;
    placeholder: string;
    options?: string[];
  }>;
}

export function GeneratorPanel(props: Props) {
  const [input, setInput] = useLocalStorage<string>(`${props.storageKey}:input`, "");
  const [meta, setMeta] = useLocalStorage<Record<string, string>>(
    `${props.storageKey}:meta`,
    {},
  );
  const [output, setOutput] = useLocalStorage<string>(`${props.storageKey}:output`, "");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function generate() {
    if (!input.trim()) {
      toast.error("Please enter some content first.");
      return;
    }
    setLoading(true);
    setOutput("");
    setEditing(false);

    const composed =
      (props.fields ?? [])
        .filter((f) => meta[f.key])
        .map((f) => `${f.label}: ${meta[f.key]}`)
        .join("\n") + (props.fields?.length ? `\n\n---\n${input}` : input);

    const ctrl = new AbortController();
    abortRef.current = ctrl;
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: props.kind, prompt: composed }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) {
        const txt = await res.text().catch(() => "");
        if (res.status === 429) toast.error("Rate limit reached. Try again shortly.");
        else if (res.status === 402)
          toast.error("AI credits exhausted. Add credits in Workspace settings.");
        else toast.error(txt || "Generation failed.");
        setLoading(false);
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setOutput(acc);
      }
    } catch (e) {
      if ((e as Error).name !== "AbortError") {
        toast.error("Something went wrong.");
        console.error(e);
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function copy() {
    if (!output) return;
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard");
  }

  function reset() {
    setInput("");
    setOutput("");
    setMeta({});
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="rounded-xl border bg-card p-5 shadow-sm flex flex-col">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {props.icon}
          </div>
          <div>
            <h2 className="text-base font-semibold">{props.title}</h2>
            <p className="text-sm text-muted-foreground">{props.description}</p>
          </div>
        </div>

        {props.fields && props.fields.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            {props.fields.map((f) => (
              <div key={f.key} className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  {f.label}
                </label>
                {f.options ? (
                  <select
                    value={meta[f.key] ?? ""}
                    onChange={(e) => setMeta({ ...meta, [f.key]: e.target.value })}
                    className="h-9 rounded-md border bg-background px-2 text-sm"
                  >
                    <option value="">{f.placeholder}</option>
                    {f.options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={meta[f.key] ?? ""}
                    onChange={(e) => setMeta({ ...meta, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="h-9 rounded-md border bg-background px-3 text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <label className="text-xs font-medium text-muted-foreground mb-1">
          {props.inputLabel}
        </label>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={props.inputPlaceholder}
          className="min-h-[220px] flex-1 resize-y"
        />

        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Button onClick={generate} disabled={loading} className="gap-2">
            <Sparkles className="h-4 w-4" />
            {loading ? "Generating…" : (props.ctaLabel ?? "Generate")}
          </Button>
          <Button type="button" variant="ghost" onClick={reset} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Reset
          </Button>
        </div>
      </section>

      <section className="rounded-xl border bg-card p-5 shadow-sm flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Output</h2>
          <div className="flex items-center gap-1">
            {output && (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setEditing((v) => !v)}
                  className="gap-1.5"
                >
                  {editing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  {editing ? "Preview" : "Edit"}
                </Button>
                <Button size="sm" variant="ghost" onClick={copy} className="gap-1.5">
                  <Copy className="h-4 w-4" /> Copy
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-[260px]">
          {!output && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-center text-sm text-muted-foreground border border-dashed rounded-lg p-6">
              <Sparkles className="h-6 w-6 text-primary mb-2" />
              <p>Your AI-generated draft will appear here.</p>
              <p className="text-xs mt-1">You can edit it before copying or sharing.</p>
            </div>
          )}
          {loading && !output && (
            <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
              <span className="animate-pulse">Thinking…</span>
            </div>
          )}
          {output &&
            (editing ? (
              <Textarea
                value={output}
                onChange={(e) => setOutput(e.target.value)}
                className="h-full min-h-[260px] font-mono text-sm resize-y"
              />
            ) : (
              <div className="rounded-lg border bg-background p-4 max-h-[600px] overflow-auto">
                <Markdown>{output}</Markdown>
              </div>
            ))}
        </div>

        <Disclaimer className="mt-4" />
      </section>
    </div>
  );
}
