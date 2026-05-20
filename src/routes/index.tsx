import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  Search,
  MessagesSquare,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Workplace AI" },
      {
        name: "description",
        content:
          "Your AI productivity dashboard: draft emails, summarize meetings, plan tasks, run research, and chat — all in one place.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  {
    title: "Smart Email Generator",
    description: "Draft polished emails in your tone in seconds.",
    href: "/email",
    icon: Mail,
    accent: "from-blue-500/15 to-indigo-500/10",
  },
  {
    title: "Meeting Notes Summarizer",
    description: "Turn raw notes into decisions and action items.",
    href: "/meetings",
    icon: FileText,
    accent: "from-emerald-500/15 to-teal-500/10",
  },
  {
    title: "AI Task Planner",
    description: "Break goals into milestones and concrete tasks.",
    href: "/planner",
    icon: ListChecks,
    accent: "from-amber-500/15 to-orange-500/10",
  },
  {
    title: "AI Research Assistant",
    description: "Get balanced briefings on any topic, fast.",
    href: "/research",
    icon: Search,
    accent: "from-violet-500/15 to-fuchsia-500/10",
  },
  {
    title: "AI Chatbot",
    description: "Ask anything — your always-on work copilot.",
    href: "/chat",
    icon: MessagesSquare,
    accent: "from-sky-500/15 to-cyan-500/10",
  },
];

function Dashboard() {
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <div className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6 md:p-8 shadow-sm mb-8">
        <div className="flex items-center gap-2 text-xs font-medium text-primary mb-2">
          <Sparkles className="h-3.5 w-3.5" /> Workplace AI
        </div>
        <h1 className="text-2xl md:text-4xl font-semibold tracking-tight max-w-2xl">
          Your AI productivity assistant for everyday work.
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Automate the busywork: drafting, summarizing, planning, and researching — so you can focus on
          the work that matters.
        </p>
        <div className="flex flex-wrap gap-3 mt-5">
          <Link
            to="/email"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition"
          >
            <Zap className="h-4 w-4" /> Try Email Generator
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2.5 text-sm font-medium hover:bg-accent transition"
          >
            <MessagesSquare className="h-4 w-4" /> Open Chat
          </Link>
        </div>
      </div>

      <PageHeader eyebrow="Tools" title="Pick a workflow" description="Five focused AI tools to streamline your day." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.href}
              to={t.href}
              className="group rounded-xl border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 transition overflow-hidden relative"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${t.accent} opacity-0 group-hover:opacity-100 transition`}
              />
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{t.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.description}</p>
                <div className="mt-4 inline-flex items-center text-sm font-medium text-primary">
                  Open
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Zap, title: "Fast drafts", body: "Stream responses in seconds with structured prompts." },
          { icon: ShieldCheck, title: "You stay in control", body: "Every output is editable before you share." },
          { icon: Sparkles, title: "Built-in best practices", body: "Each tool uses an expert system prompt." },
        ].map((f) => {
          const I = f.icon;
          return (
            <div key={f.title} className="rounded-xl border bg-card p-5">
              <I className="h-5 w-5 text-primary mb-2" />
              <p className="font-medium">{f.title}</p>
              <p className="text-sm text-muted-foreground mt-1">{f.body}</p>
            </div>
          );
        })}
      </div>

      <Disclaimer className="mt-8" />
    </div>
  );
}
