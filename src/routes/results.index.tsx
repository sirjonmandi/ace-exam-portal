import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { mocks } from "@/lib/mock-data";

export const Route = createFileRoute("/results/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStoredUser()) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Results — Kaplan CFA Mock Portal" }] }),
  component: ResultsIndex,
});

function ResultsIndex() {
  const sessions = mocks.flatMap((m) => m.sessions.map((s) => ({ ...s, mock: m })));
  return (
    <AppShell title="Results">
      <h1 className="text-2xl font-semibold tracking-tight">Your Results</h1>
      <p className="text-sm text-muted-foreground mt-1">All completed and attempted sessions.</p>

      <div className="mt-6 card-elevated rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="bg-surface text-xs text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3 font-medium">Mock</th>
              <th className="text-left px-5 py-3 font-medium">Session</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium">Score</th>
              <th className="text-right px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="px-5 py-4">{s.mock.title}</td>
                <td className="px-5 py-4 text-muted-foreground">{s.name}</td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] px-2 py-0.5 rounded-md border ${
                    s.status === "completed" ? "bg-success/15 text-success border-success/30" :
                    s.status === "available" ? "bg-primary/15 text-primary border-primary/30" :
                    "bg-destructive/10 text-destructive border-destructive/30"}`}>{s.status}</span>
                </td>
                <td className="px-5 py-4 tabular-nums text-muted-foreground">{s.status === "completed" ? "76%" : "—"}</td>
                <td className="px-5 py-4 text-right">
                  {s.status === "completed" ? (
                    <Link to="/results/$resultId" params={{ resultId: s.id }} className="text-xs px-3 py-1.5 rounded-md bg-surface border border-border hover:bg-accent">View</Link>
                  ) : s.status === "available" ? (
                    <Link to="/exam/$mockId" params={{ mockId: s.id }} className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground">Start</Link>
                  ) : (
                    <span className="text-xs text-muted-foreground">Locked</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </AppShell>
  );
}
