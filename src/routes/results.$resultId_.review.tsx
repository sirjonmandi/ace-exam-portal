import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { useAuth } from "@/lib/auth-context";
import { AppShell } from "@/components/app-shell";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMockResult } from "@/store/slices/mock-slice";
import { RootState } from "@/store";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export const Route = createFileRoute("/results/$resultId_/review")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStoredUser()) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Exam Insights — Kaplan CFA Mock Portal" }] }),
  component: ReviewInsightsPage,
});

function scoreColor(score: number) {
  // return score >= 75 ? "var(--success)" : score >= 65 ? "var(--primary)" : "var(--warning)";
  return score >= 70 ? "var(--success)" : score >= 50 ? "var(--warning)" : "var(--destructive)";
}

function secondsToHM(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h${String(minutes).padStart(2, "0")}m` : `${minutes}m`;
}

function ReviewInsightsPage() {
  const dispatch = useDispatch();
  const { resultId } = Route.useParams();
  const { user } = useAuth();

  useEffect(() => {
    dispatch(getMockResult(resultId) as any);
  }, [resultId]);

  const { mockResult } = useSelector((state: RootState) => state.mocks);

  if (!mockResult) return null;

  const { summary, subjectStats } = mockResult;
  const cfaLevel =
    summary.cfaLevel === "one" ? "1" : summary.cfaLevel === "two" ? "2" : summary.cfaLevel === "three" ? "3" : "N/A";
  const passed = summary.passed;
  const score = summary.scaledScore;
  const mps = summary.mps;
  const maxScore = summary.maxScore;
  const margin = Math.abs(score - mps);

  const STEP = 100;
  const ticks = Array.from(
    { length: Math.floor(maxScore / STEP) + 1 },
    (_, i) => i * STEP
  );

  const scorePosition = (score / maxScore) * 100;
  const mpsPosition = (mps / maxScore) * 100;

  const strongest = subjectStats.length > 0
    ? subjectStats.reduce((a, b) => (b.score > a.score ? b : a))
    : null;
  const weakest = subjectStats.length > 0
    ? subjectStats.reduce((a, b) => (b.score < a.score ? b : a))
    : null;
  const strongSubjects = subjectStats.length > 0
    ? subjectStats.filter((s) => (s.score/s.total)*100 >= 70)
    : null;
  const weakSubjects = subjectStats.length > 0 
    ? subjectStats.filter((s) => (s.score/s.total)*100 < 70)
    : null;

  return (
    <AppShell title="Exam Insights">
      <Link
        to="/results/$resultId"
        params={{ resultId }}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to summary
      </Link>

      <div className="mt-4 card-elevated rounded-2xl p-6 md:p-8">
        <div className="text-xs text-muted-foreground uppercase tracking-wider">CFA Program Exam Results</div>
        <h1 className="text-2xl font-semibold mt-1">{summary.mockName || "Mock Exam"}</h1>

        <div className="mt-5 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="flex justify-between border-b border-border/60 py-1.5">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{user?.name ?? "—"}</span>
          </div>
          <div className="flex justify-between border-b border-border/60 py-1.5">
            <span className="text-muted-foreground">Candidate Email</span>
            <span className="font-medium">{user?.email ?? "—"}</span>
          </div>
          <div className="flex justify-between border-b border-border/60 py-1.5">
            <span className="text-muted-foreground">Exam</span>
            <span className="font-medium">CFA Level {cfaLevel}</span>
          </div>
          <div className="flex justify-between border-b border-border/60 py-1.5">
            <span className="text-muted-foreground">Result</span>
            <span className={`font-medium ${passed === "pass" ? "text-success" : "text-destructive"}`}>
              {passed === "pass" ? "Passed" : "Not Passed"}
            </span>
          </div>
          <div className="flex justify-between border-b border-border/60 py-1.5">
            <span className="text-muted-foreground">Your Score</span>
            <span className="font-medium tabular-nums">{score}</span>
          </div>
          <div className="flex justify-between border-b border-border/60 py-1.5">
            <span className="text-muted-foreground">Minimum Passing Score (MPS)</span>
            <span className="font-medium tabular-nums">{mps}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 card-elevated rounded-2xl p-6">
        <h2 className="text-base font-semibold">Your Performance on the Exam</h2>
        <p className="text-sm text-muted-foreground mt-1">
          How your overall score compares against the minimum passing score.
        </p>

        <div className="mt-8 mb-3 relative h-14">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-border" />
          {ticks.map((tick) => (
            <div key={tick} className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ left: `${(tick / maxScore) * 100}%` }}>
              <div className="h-2.5 w-px bg-border" />
              <div className="mt-2.5 text-[11px] text-muted-foreground tabular-nums">{tick}</div>
            </div>
          ))}

          <div
            className="absolute top-0 bottom-0 border-l border-dashed border-warning flex flex-col items-center"
            style={{ left: `${mpsPosition}%` }}
          >
            <div className="-mt-1 -translate-x-1/2 text-[11px] text-warning whitespace-nowrap">Pass mark {mps}</div>
          </div>

          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center"
            style={{ left: `${scorePosition}%` }}
          >
            <div className={`h-3.5 w-3.5 rounded-full border-2 border-background ${passed ==='pass' ? "bg-success" : "bg-destructive"}`} />
            <div className={`mt-1.5 text-xs font-semibold whitespace-nowrap ${passed ==='pass' ? "text-success" : "text-destructive"}`}>
              Your score {score}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          You scored {score} {passed === 'pass' ? "above" : "below"} the minimum passing score.
        </p>
      </div>

      <div className="mt-6 card-elevated rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Your Performance by Topic Area</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Percentage of questions answered correctly in each topic area.
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{subjectStats.length} topics</span>
        </div>

        <div className="mt-6 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectStats} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="subject"
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={70}
              />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
              <ReferenceLine y={mpsPosition} stroke="var(--warning)" strokeDasharray="4 4" label={{ value: `Pass mark ${mps}`, position: "insideTopLeft", fontSize: 11, fill: "var(--warning)" }} />
              <Bar dataKey={(entry) => (entry.score / entry.total) * 100} radius={[4, 4, 0, 0]}>
                {subjectStats.map((s) => (
                  <Cell key={s.subject} fill={scoreColor((s.score/s.total)*100)} opacity={0.5} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border">
                <th className="py-2 pr-4 font-medium">Topic Area</th>
                <th className="py-2 pr-4 font-medium">Your Score</th>
                {cfaLevel === "1" && <th className="py-2 pr-4 font-medium">Topic Weight</th>}
              </tr>
            </thead>
            <tbody>
              {subjectStats.map((s) => (
                <tr key={s.subject} className="border-b border-border/60 last:border-0">
                  <td className="py-2 pr-4">{s.subject}</td>
                  <td className="py-2 pr-4 tabular-nums" style={{ color: scoreColor((s.score/s.total)*100) }}>{(s.score/s.total)*100}%</td>
                  {cfaLevel === "1" && (
                    <td className="py-2 pr-4 text-muted-foreground">
                      {s.weight ?? "—"}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid lg:grid-cols-2 gap-5">
        <div className="card-elevated rounded-2xl p-6">
          <h2 className="text-base font-semibold">Key Insights</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            <li>
              You scored <span className="font-medium text-foreground">{score}</span> ({summary.correctCount}/{summary.totalQuestions} correct),{" "}
              {margin} {passed === 'pass' ? "above" : "below"} the passing mark.
            </li>
            <li>
              You attempted <span className="font-medium text-foreground">{summary.attempted}</span> of {summary.totalQuestions} questions
              {summary.notAttempted > 0 ? ` (${summary.notAttempted} skipped)` : ""}.
            </li>
            {strongSubjects && strongSubjects.length > 0 && (
              <li>
                Strongest topics: 
                {strongSubjects.map((s)=>(
                  <span className="font-medium text-foreground"> {s.subject},</span>
                ))}
              </li>
            )}
            {weakSubjects && weakSubjects.length > 0 && (
              <li>
                Weakest topics: 
                {weakSubjects?.map((s)=>(
                  <span className="font-medium text-foreground"> {s.subject}, </span>
                ))}
                 — focus your next review here.
              </li>
            )}
            <li>
              Time spent: <span className="font-medium text-foreground">{secondsToHM(summary.totalTimeSpent)}</span>
              {summary.overallTimeLeft > 0 ? ` (${secondsToHM(summary.overallTimeLeft)} left on the clock)` : ""}.
            </li>
          </ul>
        </div>

        <div className="card-elevated rounded-2xl p-6 flex flex-col">
          <h2 className="text-base font-semibold">Next Steps</h2>
          <p className="text-sm text-muted-foreground mt-1">Focus on your weakest topics before your next attempt.</p>
          <div className="mt-4 space-y-2">
            <Link
              to="/results/$resultId"
              params={{ resultId }}
              className="w-full inline-flex items-center justify-center gap-1 text-sm py-2 rounded-lg bg-surface border border-border hover:bg-accent"
            >
              Back to Summary
            </Link>
            <Link
              to="/mocks"
              className="w-full inline-flex items-center justify-center gap-1 text-sm py-2 rounded-lg bg-primary text-primary-foreground font-medium"
            >
              Take Next Mock <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
