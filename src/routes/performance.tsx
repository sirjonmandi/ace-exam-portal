import { createFileRoute, redirect } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { progressTrend, subjectBreakdown, snapshot } from "@/lib/mock-data";
import { TrendingUp, Target, Flame, Award } from "lucide-react";

export const Route = createFileRoute("/performance")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStoredUser()) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Performance — Kaplan CFA Mock Portal" }] }),
  component: Performance,
});

function Performance() {
  const max = Math.max(...progressTrend.map((p) => p.score));
  return (
    <AppShell title="Performance">
      <h1 className="text-2xl font-semibold tracking-tight">Performance Analytics</h1>
      <p className="text-sm text-muted-foreground mt-1">Track your progress, accuracy, and weak topics across all mocks.</p>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Average Score", value: snapshot.averageScore, icon: Target },
          { label: "Best Score", value: "81%", icon: Award },
          { label: "Improvement", value: "+19%", icon: TrendingUp },
          { label: "Study Streak", value: snapshot.studyStreak, icon: Flame },
        ].map((s) => (
          <div key={s.label} className="card-elevated rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <s.icon className="h-3.5 w-3.5 text-primary" /> {s.label}
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-[1.3fr_1fr] gap-5">
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Mock-wise Progress</h2>
            <span className="text-xs text-muted-foreground">Last 6 mocks</span>
          </div>
          <div className="mt-6 h-64 flex items-end gap-4 px-2">
            {progressTrend.map((p) => (
              <div key={p.mock} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-[11px] text-muted-foreground tabular-nums">{p.score}%</div>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-primary/40 to-primary transition-all" style={{ height: `${(p.score / max) * 100}%` }} />
                <div className="text-[11px] text-muted-foreground">{p.mock}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated rounded-2xl p-6">
          <h2 className="text-base font-semibold">Topic Accuracy</h2>
          <div className="mt-5 space-y-3">
            {subjectBreakdown.slice(0, 6).map((s) => (
              <div key={s.subject}>
                <div className="flex items-center justify-between text-xs">
                  <span>{s.subject}</span>
                  <span className="text-muted-foreground tabular-nums">{s.score}%</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-surface-elevated overflow-hidden">
                  <div className={`h-full ${s.score >= 75 ? "bg-success" : s.score >= 65 ? "bg-primary" : "bg-warning"}`} style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 card-elevated rounded-2xl p-6">
        <h2 className="text-base font-semibold">Study Streak</h2>
        <p className="text-sm text-muted-foreground mt-1">Last 30 days of activity</p>
        <div className="mt-5 grid grid-cols-15 sm:grid-cols-30 gap-1.5" style={{ gridTemplateColumns: "repeat(30, minmax(0,1fr))" }}>
          {Array.from({ length: 30 }).map((_, i) => {
            const intensity = Math.random();
            const cls =
              intensity > 0.75 ? "bg-primary" :
              intensity > 0.5 ? "bg-primary/60" :
              intensity > 0.25 ? "bg-primary/30" :
              "bg-surface-elevated";
            return <div key={i} className={`aspect-square rounded ${cls}`} />;
          })}
        </div>
      </div>
    </AppShell>
  );
}
