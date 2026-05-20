import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GeneratorPanel } from "@/components/GeneratorPanel";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      {
        name: "description",
        content: "Get a balanced briefing on any topic: summary, key points, perspectives, and what to verify.",
      },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Learn"
        title="AI Research Assistant"
        description="Ask about a topic, market, or concept. Get a structured briefing with perspectives and follow-up questions."
      />
      <GeneratorPanel
        kind="research"
        storageKey="research"
        title="Topic"
        description="Be specific — a sharp question yields a sharper briefing."
        icon={<Search className="h-5 w-5" />}
        inputLabel="What do you want to learn about?"
        inputPlaceholder="e.g. Pros and cons of adopting OKRs in a 30-person startup."
        ctaLabel="Run research"
        fields={[
          { key: "audience", label: "Briefing audience", placeholder: "e.g. Executive team" },
          {
            key: "depth",
            label: "Depth",
            placeholder: "Pick depth",
            options: ["Overview", "Standard", "Deep dive"],
          },
        ]}
      />
    </div>
  );
}
