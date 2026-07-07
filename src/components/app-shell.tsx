import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, BookOpenCheck, BarChart3, CalendarRange,
  Trophy, Bell, Search, LogOut, Menu, X,
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { ThemeToggle } from "@/lib/theme";
import { useAuth } from "@/lib/auth-context";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/mocks", label: "Mock Library", icon: BookOpenCheck },
  { to: "/performance", label: "Performance", icon: BarChart3 },
  { to: "/study-plan", label: "Study Plan", icon: CalendarRange },
  { to: "/results", label: "Results", icon: Trophy },
] as const;

function SidebarContent({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map((item) => {
          const active = path === item.to || path.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/60"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
              {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />}
            </Link>
          );
        })}
      </nav>
      <div className="m-3 p-4 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
        <div className="text-xs text-muted-foreground">Upgrade</div>
        <div className="text-sm font-semibold mt-1">Unlock all 6 mocks</div>
        <button className="mt-3 text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground font-medium hover:opacity-90">
          View plans
        </button>
      </div>
    </>
  );
}

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLogout() {
    await logout();
    navigate({ to: "/login" });
  }

  const initials = user?.name 
    ? user.name.split(" ").map((n: string) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-sidebar border-r border-sidebar-border">
        <Link to="/" className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-lg bg-primary/20 text-primary grid place-items-center font-bold text-sm tracking-tight">CFA</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">CFA Portal</div>
            <div className="text-[11px] text-muted-foreground">Mock Practice</div>
          </div>
        </Link>
        <SidebarContent path={path} />
      </aside>

      {/* Mobile drawer */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden"
            onClick={() => setDrawerOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-sidebar border-r border-sidebar-border md:hidden">
            <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border shrink-0">
              <Link to="/" onClick={() => setDrawerOpen(false)} className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-primary/20 text-primary grid place-items-center font-bold text-sm">CFA</div>
                <div className="leading-tight">
                  <div className="text-sm font-semibold">CFA Portal</div>
                  <div className="text-[11px] text-muted-foreground">Mock Practice</div>
                </div>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="h-8 w-8 grid place-items-center rounded-lg hover:bg-sidebar-accent"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <SidebarContent path={path} onNavigate={() => setDrawerOpen(false)} />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center gap-3 px-4 md:px-8 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-20">

          {/* Mobile: hamburger */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="md:hidden h-9 w-9 grid place-items-center rounded-lg bg-surface border border-border hover:bg-accent shrink-0"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Mobile: brand */}
          <Link to="/" className="md:hidden flex items-center gap-2 min-w-0">
            <div className="h-7 w-7 rounded-md bg-primary/20 text-primary grid place-items-center font-bold text-xs shrink-0">CFA</div>
            <span className="text-sm font-semibold truncate">CFA Portal</span>
          </Link>

          {/* Desktop: page title */}
          <div className="text-sm text-muted-foreground hidden md:block truncate">
            {title ?? "Chartered Financial Analyst Practice Platform"}
          </div>

          <div className="ml-auto flex items-center gap-2 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-lg bg-surface border border-border w-64 lg:w-72">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                placeholder="Search topics, mocks…"
                className="bg-transparent text-sm outline-none flex-1 min-w-0 placeholder:text-muted-foreground"
              />
            </div>
            <ThemeToggle />
            <button className="hidden sm:grid h-9 w-9 place-items-center rounded-lg bg-surface border border-border hover:bg-accent">
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-border">
              <div className="text-right leading-tight hidden lg:block">
                <div className="text-sm font-medium">{user?.name ?? "Guest"}</div>
                <div className="text-[11px] text-muted-foreground">{user?.role ?? "CFA Candidate"}</div>
              </div>
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary/40 grid place-items-center text-sm font-semibold shrink-0">
                {initials}
              </div>
              <button
                onClick={handleLogout}
                className="h-9 w-9 grid place-items-center rounded-lg bg-surface border border-border hover:bg-accent"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8 min-w-0">{children}</main>
      </div>
    </div>
  );
}
