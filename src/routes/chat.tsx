import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@/lib/storage";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";
import { Markdown } from "@/components/Markdown";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputSubmit,
  PromptInputFooter,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { Plus, MessagesSquare } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chat — Workplace AI" },
      {
        name: "description",
        content:
          "Chat with your AI workplace assistant. Ask anything — drafts, ideas, summaries, decisions.",
      },
    ],
  }),
  component: ChatPage,
});

const STORAGE_KEY = "chat:messages";
const SESSION_KEY = "chat:sessionId";

function newSessionId() {
  return "s_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function ChatPage() {
  const [persisted, setPersisted] = useLocalStorage<UIMessage[]>(STORAGE_KEY, []);
  const [sessionId, setSessionId] = useLocalStorage<string>(SESSION_KEY, "");

  // Initialize a stable session id on first client render only.
  useEffect(() => {
    if (!sessionId) setSessionId(newSessionId());
  }, [sessionId, setSessionId]);

  if (!sessionId) {
    return null; // wait for client bootstrap
  }

  return (
    <ChatInner
      key={sessionId}
      sessionId={sessionId}
      initial={persisted}
      onPersist={setPersisted}
      onNewChat={() => {
        setPersisted([]);
        setSessionId(newSessionId());
      }}
    />
  );
}

function ChatInner({
  sessionId,
  initial,
  onPersist,
  onNewChat,
}: {
  sessionId: string;
  initial: UIMessage[];
  onPersist: (m: UIMessage[]) => void;
  onNewChat: () => void;
}) {
  const transportRef = useRef(new DefaultChatTransport({ api: "/api/chat" }));
  const { messages, sendMessage, status, error } = useChat({
    id: sessionId,
    messages: initial,
    transport: transportRef.current,
    onError(err) {
      console.error(err);
      toast.error("Chat error. Please try again.");
    },
  });

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  // Keep textarea focused on mount, after send, and after stream completion.
  useEffect(() => {
    inputRef.current?.focus();
  }, [sessionId, status]);

  // Persist messages whenever they change.
  useEffect(() => {
    onPersist(messages);
  }, [messages, onPersist]);

  const busy = status === "submitted" || status === "streaming";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto flex flex-col h-[calc(100vh-3.5rem)] md:h-screen">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="Chat"
          title="AI Chatbot"
          description="Your always-on copilot for quick answers, drafts, and brainstorming."
        />
        <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={onNewChat}>
          <Plus className="h-4 w-4" /> New chat
        </Button>
      </div>

      <div className="flex-1 min-h-0 flex flex-col rounded-xl border bg-card overflow-hidden">
        <Conversation className="flex-1 min-h-0">
          <ConversationContent className="px-4 md:px-6 py-6 max-w-3xl mx-auto w-full">
            {messages.length === 0 && (
              <div className="flex flex-col items-center text-center py-16 text-muted-foreground">
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
                  <MessagesSquare className="h-6 w-6" />
                </div>
                <p className="font-medium text-foreground">How can I help you today?</p>
                <p className="text-sm mt-1 max-w-sm">
                  Ask anything — draft a message, brainstorm, summarize, or plan your day.
                </p>
                <div className="grid sm:grid-cols-2 gap-2 mt-6 w-full max-w-lg">
                  {[
                    "Draft a Slack message for a late demo",
                    "Brainstorm names for an internal tool",
                    "Summarize the pros/cons of remote work",
                    "Plan a 1-hour onboarding for a new hire",
                  ].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setInput(p)}
                      className="text-left text-sm rounded-lg border bg-background px-3 py-2 hover:border-primary/40 hover:bg-accent transition"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const text = m.parts
                .map((p) => (p.type === "text" ? p.text : ""))
                .join("");
              if (m.role === "user") {
                return (
                  <Message key={m.id} from="user">
                    <MessageContent>
                      <p className="whitespace-pre-wrap">{text}</p>
                    </MessageContent>
                  </Message>
                );
              }
              return (
                <Message key={m.id} from="assistant">
                  <MessageContent className="bg-transparent !p-0">
                    {text ? <Markdown>{text}</Markdown> : <Shimmer>Thinking…</Shimmer>}
                  </MessageContent>
                </Message>
              );
            })}

            {status === "submitted" && (
              <Message from="assistant">
                <MessageContent className="bg-transparent !p-0">
                  <Shimmer>Thinking…</Shimmer>
                </MessageContent>
              </Message>
            )}

            {error && (
              <div className="text-sm text-destructive border border-destructive/30 rounded-md p-3">
                Something went wrong. Please try again.
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="border-t bg-background/60 p-3 md:p-4">
          <div className="max-w-3xl mx-auto w-full">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Workplace AI…"
              />
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} disabled={!input.trim() || busy} />
              </PromptInputFooter>
            </PromptInput>
            <Disclaimer className="mt-3" />
          </div>
        </div>
      </div>
    </div>
  );
}
