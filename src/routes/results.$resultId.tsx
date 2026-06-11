import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
// import { subjectBreakdown } from "@/lib/mock-data";
import { Trophy, Clock, Target, XCircle, CheckCircle2, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/results/$resultId")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStoredUser()) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Results — Kaplan CFA Mock Portal" }] }),
  component: ResultPage,
});

function ResultPage() {
  const { resultId } = Route.useParams();
  const [correct, setCorrect] = useState<Number>(0);
  const [wrong, setWrong] = useState<Number>(0);
  const [total, setTotal] = useState<Number>(0);
  const [pct, setPct] = useState<Number>(0);
  const [passed, setPassed] = useState<Boolean>(false);
  const [timeSpend, setTimeSpend] = useState<string>('');
  const [subjectBreakdown, setSubjectBreakdown] = useState<[any]>([{}]);

  function secondsToHM(seconds) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);

      return hours > 0
          ? `${hours}h${String(minutes).padStart(2, '0')}m`
          : `${minutes}m`;
  }

  useEffect(()=>{
    getResult()
  },[]);
  const getResult = () =>{
    let result = localStorage.getItem(resultId);
    console.log('====================================');
    console.log(JSON.parse(result));
    console.log('====================================');
    let fresh = JSON.parse(result);
    setCorrect(fresh.summary.correctCount)
    setWrong(fresh.summary.wrongCount)
    setTotal(fresh.summary.totalQuestions)
    setPct(Math.round((fresh.summary.correctCount / fresh.summary.totalQuestions) * 100))
    setPassed(Math.round((fresh.summary.correctCount / fresh.summary.totalQuestions) * 100) >= 70)
    setTimeSpend(secondsToHM(fresh.summary.totalTimeSpent))
    setSubjectBreakdown(
    (fresh.subjectStats || []).map((s: any) => ({
      subject: s.subject,
      score: Math.round((s.score / s.total) * 100),
      total: s.total,
    }))
  );
  }
  // const correct = 68;
  // const wrong = 22;
  // const total = correct + wrong;
  // const pct = Math.round((correct / total) * 100);
  // const passed = pct >= 70;

  return (
    <AppShell title="Mock Result">
      <div className="rounded-2xl bg-hero-grad border border-border p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className={`h-20 w-20 rounded-2xl grid place-items-center ${passed ? "bg-success/15 text-success border border-success/30" : "bg-destructive/15 text-destructive border border-destructive/30"}`}>
          <Trophy className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <div className="text-xs text-muted-foreground uppercase tracking-wider">{resultId}</div>
          <h1 className="text-2xl font-semibold mt-1">{passed ? "You passed this mock" : "Keep going — almost there"}</h1>
          <p className="text-sm text-muted-foreground mt-1">CFA Level 1 — Morning Session · 90 questions · 2h 15m</p>
        </div>
        <div className={`px-4 py-3 rounded-xl border ${passed ? "bg-success/10 border-success/30 text-success" : "bg-destructive/10 border-destructive/30 text-destructive"}`}>
          <div className="text-xs uppercase tracking-wider">{passed ? "PASS" : "FAIL"}</div>
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
                  <span className="text-muted-foreground tabular-nums">{s.score}%</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-surface-elevated overflow-hidden">
                  <div
                    className={`h-full ${s.score >= 75 ? "bg-success" : s.score >= 65 ? "bg-primary" : "bg-warning"}`}
                    style={{ width: `${s.score}%` }}
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
              { subjectBreakdown.length > 0 && subjectBreakdown.filter((s) => s.score < 70).map((s) => (
                <li key={s.subject} className="flex items-center justify-between rounded-lg bg-surface border border-border px-3 py-2.5">
                  <span className="text-sm">{s.subject}</span>
                  <span className="text-xs text-warning">{s.score}%</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-elevated rounded-2xl p-6">
            <h2 className="text-base font-semibold">Next Steps</h2>
            <p className="text-sm text-muted-foreground mt-1">Review explanations, focus on weak topics, and retry.</p>
            <div className="mt-4 space-y-2">
              <button className="w-full text-sm py-2 rounded-lg bg-primary text-primary-foreground font-medium">Review Answers</button>
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
