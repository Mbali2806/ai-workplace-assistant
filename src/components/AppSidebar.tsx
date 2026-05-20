import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  ListChecks,
  Search,
  MessagesSquare,
  Sparkles,
} from "lucide-react";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Email Generator", url: "/email", icon: Mail },
  { title: "Meeting Summarizer", url: "/meetings", icon: FileText },
  { title: "Task Planner", url: "/planner", icon: ListChecks },
  { title: "Research Assistant", url: "/research", icon: Search },
  { title: "Chat", url: "/chat", icon: MessagesSquare },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="hidden md:flex md:w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 px-5 border-b">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold">Workplace AI</span>
          <span className="text-xs text-muted-foreground">Productivity Suite</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <div className="px-2 pt-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Workspace
        </div>
        {items.map((item) => {
          const active = pathname === item.url;
          const Icon = item.icon;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={[
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="m-3 mt-0 rounded-lg border bg-card p-3 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Responsible AI</p>
        <p>Outputs may be inaccurate. Review before sending or sharing.</p>
      </div>
    </aside>
  );
}

export function MobileTopBar() {
  return (
    <div className="md:hidden sticky top-0 z-30 flex items-center gap-2 border-b bg-background/95 backdrop-blur px-4 h-14">
      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </div>
      <span className="font-semibold text-sm">Workplace AI</span>
      <nav className="ml-auto flex gap-1 overflow-x-auto">
        {items.map((i) => (
          <Link
            key={i.url}
            to={i.url}
            className="px-2 py-1 text-xs rounded-md hover:bg-accent whitespace-nowrap"
            activeProps={{ className: "px-2 py-1 text-xs rounded-md bg-primary text-primary-foreground" }}
          >
            {i.title.replace(" Generator", "").replace(" Summarizer", "").replace(" Assistant", "").replace(" Planner", "")}
          </Link>
        ))}
      </nav>
    </div>
  );
}
