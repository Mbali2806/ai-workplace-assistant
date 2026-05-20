import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GeneratorPanel } from "@/components/GeneratorPanel";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      {
        name: "description",
        content: "Turn raw meeting notes or transcripts into clear summaries, decisions, and action items.",
      },
    ],
  }),
  component: MeetingsPage,
});

function MeetingsPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Capture"
        title="Meeting Notes Summarizer"
        description="Paste raw notes or a transcript. Get a structured summary, decisions, and assigned action items."
      />
      <GeneratorPanel
        kind="summary"
        storageKey="meetings"
        title="Paste meeting notes"
        description="Works with rough notes, bullet points, or full transcripts."
        icon={<FileText className="h-5 w-5" />}
        inputLabel="Raw notes or transcript"
        inputPlaceholder="Paste your meeting notes or transcript here…"
        ctaLabel="Summarize meeting"
        fields={[
          { key: "title", label: "Meeting title (optional)", placeholder: "e.g. Q3 Planning Sync" },
          { key: "date", label: "Date (optional)", placeholder: "e.g. 2026-05-20" },
        ]}
      />
    </div>
  );
}
