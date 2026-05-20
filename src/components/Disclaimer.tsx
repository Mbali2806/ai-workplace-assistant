import { ShieldAlert } from "lucide-react";

export function Disclaimer({ className = "" }: { className?: string }) {
  return (
    <div
      className={
        "flex items-start gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground " +
        className
      }
    >
      <ShieldAlert className="h-4 w-4 mt-[1px] shrink-0 text-primary" />
      <p>
        AI outputs may be inaccurate, biased, or out of date. Always review and edit before sharing externally.
        Avoid pasting confidential or personal data you wouldn't share publicly.
      </p>
    </div>
  );
}
