import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { mocks } from "@/lib/mock-data";
import { ArrowRight, BookOpenCheck, BarChart3, CheckCircle2, Flame, Lock, Play } from "lucide-react";
import { getStoredUser } from "@/lib/auth";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/store";
import { dashboard } from "@/store/slices/dashboard-slice";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStoredUser()) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Dashboard — Kaplan CFA Mock Portal" }] }),
  component: Dashboard,
});

function Dashboard() {
  const dispatch = useDispatch();
  const { performance } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(dashboard() as any);
  }, []);

  return (
    <AppShell>
      {/* Hero */}
      <div className="rounded-2xl bg-hero-grad border border-border p-6 md:p-8 grid lg:grid-cols-[1.1fr_1fr] gap-8">
        <div>
          <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/20">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> 2026 CFA Level 1 Preparation
          </span>
          <h1 className="mt-5 text-3xl md:text-4xl font-semibold leading-tight tracking-tight">
            Master Your CFA Exam<br />With Structured Mock<br />Assessments
          </h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-md leading-relaxed">
            Complete full-length mock exams, unlock advanced sessions progressively, analyze your weak areas,
            and simulate the real CFA testing experience.
          </p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <Link to="/mocks" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
              Continue Practice <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/performance" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-surface/60 text-sm font-medium hover:bg-surface">
              View Analytics
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-surface/70 backdrop-blur border border-border p-5">
          <div className="text-sm font-medium">Your Preparation Snapshot</div>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: "Mocks Completed", value: performance.mock, icon: CheckCircle2 },
              { label: "Questions Solved", value: performance.totalQuestionsSolved, icon: BookOpenCheck },
              { label: "Average Score", value: `${performance.averageScore}%`, icon: BarChart3 },
              { label: "Study Streak", value: `${performance.streakScore}d`, icon: Flame },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-surface-elevated border border-border p-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <s.icon className="h-3.5 w-3.5 text-primary" /> {s.label}
                </div>
                <div className="mt-2 text-2xl font-semibold tracking-tight">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mock library */}
      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Mock Examination Library</h2>
          <p className="text-sm text-muted-foreground mt-1">Each mock contains 2 sessions with 90 questions each.</p>
        </div>
        <Link to="/study-plan" className="text-xs px-3 py-2 rounded-lg bg-surface border border-border hover:bg-accent">
          Explore Curriculum
        </Link>
      </div>

      <div className="mt-5 grid lg:grid-cols-2 gap-5">
        {mocks.slice(0, 4).map((m) => (
          <MockCard key={m.id} mock={m} />
        ))}
      </div>
    </AppShell>
  );
}

function MockCard({ mock }: { mock: typeof mocks[number] }) {
  return (
    <div className="card-elevated rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Mock Assessment</span>
          <h3 className="mt-1.5 text-lg font-semibold">{mock.title}</h3>
          <p className="text-sm text-muted-foreground mt-1 max-w-md">{mock.description}</p>
        </div>
        <div className="h-9 w-9 rounded-full bg-surface-elevated border border-border grid place-items-center text-sm font-semibold">
          {mock.number}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Overall Progress</span>
          <span className="text-foreground font-medium">{mock.progress}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-surface-elevated overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${mock.progress}%` }} />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {mock.sessions.map((s) => (
          <SessionRow key={s.id} session={s} />
        ))}
      </div>
    </div>
  );
}

function SessionRow({ session }: { session: typeof mocks[number]["sessions"][number] }) {
  const badge =
    session.status === "completed"
      ? { label: "Completed", cls: "bg-success/15 text-success border-success/30" }
      : session.status === "available"
      ? { label: "Available", cls: "bg-primary/15 text-primary border-primary/30" }
      : { label: "Locked", cls: "bg-destructive/10 text-destructive border-destructive/30" };

  return (
    <div className="rounded-xl bg-surface border border-border p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium">{session.name}</div>
          <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-md border ${badge.cls}`}>
            {badge.label}
          </span>
        </div>
        <SessionButton session={session} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><BookOpenCheck className="h-3 w-3" /> {session.questions} Questions</span>
        <span className="flex items-center gap-1.5"><Flame className="h-3 w-3" /> {session.duration}</span>
        <span className="flex items-center gap-1.5"><BarChart3 className="h-3 w-3" /> Adaptive Tracking</span>
      </div>
    </div>
  );
}

function SessionButton({ session }: { session: typeof mocks[number]["sessions"][number] }) {
  if (session.status === "completed")
    return (
      <Link
        to="/results/$resultId"
        params={{ resultId: session.id }}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-success text-success-foreground font-medium hover:opacity-90"
      >
        Review Performance
      </Link>
    );
  if (session.status === "available")
    return (
      <Link
        to="/exam/$mockId"
        params={{ mockId: session.id }}
        className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-foreground text-background font-medium hover:opacity-90"
      >
        <Play className="h-3 w-3" /> Start Assessment
      </Link>
    );
  return (
    <button disabled className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-surface-elevated text-muted-foreground border border-border cursor-not-allowed">
      <Lock className="h-3 w-3" /> <span className="hidden sm:inline">Complete previous to </span>Unlock
    </button>
  );
}
