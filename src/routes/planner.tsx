import { createFileRoute } from "@tanstack/react-router";
import { ListChecks } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GeneratorPanel } from "@/components/GeneratorPanel";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      {
        name: "description",
        content: "Turn any goal into a realistic plan with milestones, tasks, risks, and a clear next step.",
      },
    ],
  }),
  component: PlannerPage,
});

function PlannerPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Plan"
        title="AI Task Planner"
        description="Describe a goal or project. Get milestones, broken-down tasks, risks, and a concrete first step."
      />
      <GeneratorPanel
        kind="plan"
        storageKey="planner"
        title="Define the goal"
        description="The more context (constraints, deadline, team), the sharper the plan."
        icon={<ListChecks className="h-5 w-5" />}
        inputLabel="Goal or project"
        inputPlaceholder="e.g. Launch a customer onboarding email sequence in 4 weeks with a team of 2."
        ctaLabel="Build plan"
        fields={[
          { key: "deadline", label: "Deadline (optional)", placeholder: "e.g. End of June" },
          { key: "team", label: "Team / resources", placeholder: "e.g. Me + 1 designer" },
        ]}
      />
    </div>
  );
}
