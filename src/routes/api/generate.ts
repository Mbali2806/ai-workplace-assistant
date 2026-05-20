import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { streamText } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "@/lib/ai-gateway";

type GenKind = "email" | "summary" | "plan" | "research";

const SYSTEMS: Record<GenKind, string> = {
  email: `You are a professional workplace email writer. Generate clear, polite, well-structured emails.
Output format (markdown):
**Subject:** <subject line>

<email body with greeting, 2-4 short paragraphs, and a polite sign-off>

Match the requested tone exactly. Keep it concise.`,

  summary: `You are an expert meeting notes summarizer. From raw meeting notes or a transcript, produce:

## Summary
2-4 sentence overview.

## Key Decisions
- bullet list

## Action Items
- [ ] Owner — Task — Deadline (if mentioned)

## Open Questions
- bullet list

Be faithful to the source; do not invent details.`,

  plan: `You are an AI task planner. Convert the user's goal into a structured, realistic plan.

## Goal
<one-sentence restatement>

## Milestones
Numbered milestones with target timeframe.

## Task Breakdown
For each milestone, bulleted sub-tasks with rough effort (S/M/L).

## Risks & Mitigations
- bullet list

## Suggested Next Step
One concrete action to start today.`,

  research: `You are an AI research assistant. Produce a balanced briefing from your training knowledge.

## Topic
<restated topic>

## Executive Summary
3-5 sentences.

## Key Points
- bullet list with the most important facts

## Different Perspectives
Briefly cover contrasting viewpoints where relevant.

## Open Questions / Things to Verify
- bullet list

End with: *Verify time-sensitive facts against primary sources.*`,
};

type Body = { kind?: GenKind; prompt?: string };

export const Route = createFileRoute("/api/generate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { kind, prompt } = (await request.json()) as Body;
        if (!kind || !SYSTEMS[kind] || !prompt?.trim()) {
          return new Response("kind and prompt required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway(DEFAULT_MODEL),
            system: SYSTEMS[kind],
            prompt,
          });
          return result.toTextStreamResponse();
        } catch (err) {
          console.error("generate error", err);
          return new Response("AI gateway error", { status: 500 });
        }
      },
    },
  },
});
