import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { Trophy, Clock, Target, XCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMockResult } from "@/store/slices/mock-slice";
import { RootState } from "@/store";

export const Route = createFileRoute("/results/$resultId")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStoredUser()) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Results — Kaplan CFA Mock Portal" }] }),
  component: ResultPage,
});

function secondsToHM(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return hours > 0
    ? `${hours}h${String(minutes).padStart(2, '0')}m`
    : `${minutes}m`;
}

function ResultPage() {
  const dispatch = useDispatch();
  const { resultId } = Route.useParams();

  useEffect(() => {
    dispatch(getMockResult(resultId) as any);
  }, [resultId]);

  const { mockResult } = useSelector((state: RootState) => state.mocks);

  if (!mockResult) return null;

  const { summary, subjectStats } = mockResult;
  const name = summary.mockName;
  const cfaLevel = summary.cfaLevel === 'one' ? '1' : summary.cfaLevel === 'two' ? '2' :summary.cfaLevel === 'three' ? '3' : 'N/A';
  const totalTime = secondsToHM(summary.totalTime * 60);
  const correct = summary.correctCount;
  const wrong = summary.wrongCount;
  const total = summary.totalQuestions;
  const pct = summary.percentage;
  const passed = summary.passed;
  const timeSpend = secondsToHM(summary.totalTimeSpent);
  const subjectBreakdown = subjectStats;

  return (
    <AppShell title="Mock Result">
      <div className="rounded-2xl bg-hero-grad border border-border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className={`h-20 w-20 rounded-2xl grid place-items-center ${passed === 'pass' ? "bg-success/15 text-success border border-success/30" : "bg-destructive/15 text-destructive border border-destructive/30"}`}>
          <Trophy className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{resultId}</div>
          <h1 className="text-2xl font-semibold mt-1">{passed === 'pass' ? "You passed this mock" : "Keep going — almost there"}</h1>
          <p className="text-sm text-muted-foreground mt-1">CFA Level {cfaLevel} — {name} · {total} questions · {totalTime}</p>
        </div>
        <div className={`px-4 py-3 rounded-xl border ${passed === 'pass' ? "bg-success/10 border-success/30 text-success" : "bg-destructive/10 border-destructive/30 text-destructive"}`}>
          <div className="text-xs uppercase tracking-wider">{passed ==='pass' ? "PASS" : passed === 'fail' ? "FAIL" : "IN PROGRESS"}</div>
          <div className="text-3xl font-semibold tabular-nums">{pct}%</div>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Score", value: `${correct}/${total}`, icon: Target },
          { label: "Correct", value: correct, icon: CheckCircle2, color: "text-success" },
          { label: "Incorrect", value: wrong, icon: XCircle, color: "text-destructive" },
          { label: "Time Spent", value: timeSpend, icon: Clock },
        ].map((s) => (
          <div key={s.label} className="card-elevated rounded-2xl p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <s.icon className={`h-3.5 w-3.5 ${s.color ?? "text-primary"}`} /> {s.label}
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid lg:grid-cols-[1.4fr_1fr] gap-5">
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Subject-wise Breakdown</h2>
            <span className="text-xs text-muted-foreground">10 topics</span>
          </div>
          <div className="mt-5 space-y-3.5">
            {subjectBreakdown.map((s) => (
              <div key={s.subject}>
                <div className="flex items-center justify-between text-xs">
                  <span>{s.subject}</span>
                  <span className="text-muted-foreground tabular-nums">{Math.round((s.score/s.total)*100)}%</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-surface-elevated overflow-hidden">
                  <div
                    className={`h-full ${(s.score/s.total)*100 <50 ? "bg-destructive" : (s.score/s.total)*100 <= 70 ? "bg-warning" : "bg-success"}`}
                    style={{ width: `${(s.score/s.total)*100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="card-elevated rounded-2xl p-6">
            <h2 className="text-base font-semibold">Weak Topics</h2>
            <ul className="mt-4 space-y-3">
              { subjectBreakdown.length > 0 && subjectBreakdown.filter((s) => (s.score/s.total)*100 < 70).map((s) => (
                <li key={s.subject} className="flex items-center justify-between rounded-lg bg-surface border border-border px-3 py-2.5">
                  <span className="text-sm">{s.subject}</span>
                  <span className="text-xs text-warning">{Math.round((s.score/s.total)*100)}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-elevated rounded-2xl p-6">
            <h2 className="text-base font-semibold">Next Steps</h2>
            <p className="text-sm text-muted-foreground mt-1">Review explanations, focus on weak topics, and retry.</p>
            <div className="mt-4 space-y-2">
              <Link
                to="/results/$resultId/review"
                params={{ resultId }}
                className="w-full inline-flex items-center justify-center text-sm py-2 rounded-lg bg-primary text-primary-foreground font-medium"
              >
                Review Answer & Insight
              </Link>
              <Link to="/mocks" className="w-full inline-flex items-center justify-center gap-1 text-sm py-2 rounded-lg bg-surface border border-border hover:bg-accent">
                Take Next Mock <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
