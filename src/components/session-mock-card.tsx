import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpenCheck, BarChart3, Flame, Lock, Play } from "lucide-react";
import { useDispatch } from "react-redux";
import { setMock, SessionMock, SessionMockSession } from "@/store/slices/mock-slice";

export function SessionMockCard({ mock, showStatusBadge = true }: { mock: SessionMock; showStatusBadge?: boolean }) {
  return (
    <div className="card-elevated rounded-2xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Mock Assessment</span>
          <h3 className="mt-1.5 text-lg font-semibold capitalize">{mock.name}</h3>
          {mock.description && <p className="text-sm text-muted-foreground mt-1 max-w-md">{mock.description}</p>}
        </div>
        <div className="h-9 w-9 rounded-full bg-surface-elevated border border-border grid place-items-center text-sm font-semibold">
          {mock.id}
        </div>
      </div>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Overall Progress</span>
          <span className="text-foreground font-medium">{mock.progress ?? 0}%</span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-surface-elevated overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${mock.progress ?? 0}%` }} />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {mock.sessions.map((s, i) => (
          <SessionRow key={s.session_id} mock={mock} session={s} previousSession={mock.sessions[i - 1]} showStatusBadge={showStatusBadge} />
        ))}
      </div>
    </div>
  );
}

function SessionRow({
  mock,
  session,
  previousSession,
  showStatusBadge,
}: {
  mock: SessionMock;
  session: SessionMockSession;
  previousSession?: SessionMockSession;
  showStatusBadge: boolean;
}) {
  const badge = !mock.is_unlocked
    ? { label: "Locked", cls: "bg-destructive/10 text-destructive border-destructive/30" }
    : session.is_locked
    ? { label: "Locked", cls: "bg-destructive/10 text-destructive border-destructive/30" }
    : session.submission_status === "submitted"
    ? { label: "Completed", cls: "bg-success/15 text-success border-success/30" }
    : { label: "Available", cls: "bg-primary/15 text-primary border-primary/30" };

  return (
    <div className={`rounded-xl bg-surface border border-border p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium">{session.name}</div>
          {showStatusBadge && (
            <span className={`inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded-md border ${badge.cls}`}>
              {badge.label}
            </span>
          )}
        </div>
        <SessionButton mock={mock} session={session} previousSession={previousSession} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1.5"><BookOpenCheck className="h-3 w-3" /> {session.total_questions} Questions</span>
        <span className="flex items-center gap-1.5"><Flame className="h-3 w-3" /> {session.formatted_duration}</span>
        <span className="flex items-center gap-1.5"><BarChart3 className="h-3 w-3" /> Adaptive Tracking</span>
      </div>
    </div>
  );
}

function SessionButton({ mock, session, previousSession }: { mock: SessionMock; session: SessionMockSession; previousSession?: SessionMockSession }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onStart = () => {
    dispatch(setMock({ ...mock, session_id: session.session_id }));
    navigate({
      to: "/exam/$mockId",
      params: { mockId: mock.id },
      search: session.session_id ? { sessionId: String(session.session_id) } : {},
    });
  };

  if (!mock.is_unlocked)
    return (
      <button disabled className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-surface-elevated text-muted-foreground border border-border cursor-not-allowed">
        <Lock className="h-3 w-3" /> <span className="hidden sm:inline">Complete {mock.unlock_name ?? "previous"} to </span>Unlock
      </button>
    );

  if (session.is_locked)
    return (
      <button disabled className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-surface-elevated text-muted-foreground border border-border cursor-not-allowed">
        <Lock className="h-3 w-3" /> Complete {previousSession?.name ?? "the previous session"} First
      </button>
    );

  if (session.submission_status === "submitted")
    return (
      <div className="flex items-center gap-2">
        <Link
          to="/results/$resultId"
          params={{ resultId: session.result_id ?? "" }}
          className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-success text-success-foreground font-medium hover:opacity-90"
        >
          Review Performance
        </Link>
        {session.is_retake && (
          <button
            onClick={onStart}
            className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-foreground text-background font-medium hover:opacity-90"
          >
            <Play className="h-3 w-3" /> Retake
          </button>
        )}
      </div>
    );

  return (
    <button
      onClick={onStart}
      className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md bg-foreground text-background font-medium hover:opacity-90"
    >
      <Play className="h-3 w-3" /> Start Assessment
    </button>
  );
}
