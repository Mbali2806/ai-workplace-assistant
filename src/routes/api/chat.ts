import "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider, DEFAULT_MODEL } from "@/lib/ai-gateway";

type ChatRequestBody = { messages?: unknown };

const SYSTEM = `You are the AI Workplace Productivity Assistant — a focused, professional helper for working professionals.
You assist with drafting communications, planning, summarizing, and researching.
Be concise, structured, and actionable. Use markdown (headings, bullets) when it helps clarity.
If a request needs sensitive judgment (legal, medical, financial, HR), remind the user to verify with a qualified expert.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway(DEFAULT_MODEL),
            system: SYSTEM,
            messages: await convertToModelMessages(messages as UIMessage[]),
          });
          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (err) {
          console.error("chat error", err);
          return new Response("AI gateway error", { status: 500 });
        }
      },
    },
  },
});
