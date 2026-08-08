import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { ArrowRight, BookOpenCheck, BarChart3, CheckCircle2, Flame, Loader2 } from "lucide-react";
import { getStoredUser } from "@/lib/auth";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef } from "react";
import { RootState } from "@/store";
import { dashboard } from "@/store/slices/dashboard-slice";
import { getSessionMocks } from "@/store/slices/mock-slice";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { SessionMockCard } from "@/components/session-mock-card";

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
  const { sessionMocks, sessionMocksPagination, loading } = useSelector((state: RootState) => state.mocks);
  const pageRef = useRef(1);
  const loadingMoreRef = useRef(false);

  useEffect(() => {
    dispatch(dashboard() as any);
    pageRef.current = 1;
    dispatch(getSessionMocks(1) as any);
  }, []);

  const loadMore = useCallback(() => {
    if (loadingMoreRef.current || !sessionMocksPagination.hasMorePages) return;
    loadingMoreRef.current = true;
    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;
    (dispatch(getSessionMocks(nextPage) as any) as Promise<any>).finally(() => {
      loadingMoreRef.current = false;
    });
  }, [dispatch, sessionMocksPagination.hasMorePages]);

  const sentinelRef = useInfiniteScroll(loadMore, sessionMocksPagination.hasMorePages && !loading);

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
        {sessionMocks.map((m) => (
          <SessionMockCard key={m.id} mock={m} />
        ))}
      </div>

      {sessionMocksPagination.hasMorePages && (
        <div ref={sentinelRef} className="mt-6 flex items-center justify-center gap-2 py-4 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading more mocks…
        </div>
      )}
    </AppShell>
  );
}
