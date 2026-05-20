import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { GeneratorPanel } from "@/components/GeneratorPanel";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      {
        name: "description",
        content:
          "Draft professional emails in any tone in seconds. Structured prompts, editable output, copy-ready.",
      },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <PageHeader
        eyebrow="Communicate"
        title="Smart Email Generator"
        description="Describe what you need to say. We'll draft a polished, professional email you can edit and send."
      />
      <GeneratorPanel
        kind="email"
        storageKey="email"
        title="Compose"
        description="Structured prompt — give us the gist, audience, and tone."
        icon={<Mail className="h-5 w-5" />}
        inputLabel="What is this email about?"
        inputPlaceholder="e.g. Tell my team the Q3 launch is moving to October 5th and what they need to prepare."
        ctaLabel="Generate email"
        fields={[
          { key: "recipient", label: "Recipient / audience", placeholder: "e.g. My engineering team" },
          {
            key: "tone",
            label: "Tone",
            placeholder: "Pick a tone",
            options: ["Professional", "Friendly", "Concise", "Persuasive", "Apologetic", "Enthusiastic"],
          },
          { key: "from", label: "From (your name / role)", placeholder: "e.g. Alex, Product Lead" },
          { key: "length", label: "Length", placeholder: "Pick length", options: ["Short", "Medium", "Detailed"] },
        ]}
      />
    </div>
  );
}
