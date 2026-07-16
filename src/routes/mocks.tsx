import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
// import { mocks } from "@/lib/mock-data";
import { BookOpenCheck, Flame, BarChart3, Lock, Play } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getMocks, setMock } from "@/store/slices/mock-slice";
import { RootState } from "@/store";

export const Route = createFileRoute("/mocks")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStoredUser()) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Mock Library — Kaplan CFA Mock Portal" }] }),
  component: MocksPage,
});

function MocksPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mocks } = useSelector((state:RootState)=>state.mocks);

  useEffect(()=>{
    dispatch(getMocks(1) as any);
  },[]);

  const onClickMock = (mock:any) =>{
    dispatch(setMock(mock));
    navigate({ to: "/exam/$mockId", params: { mockId: mock.id } });
  }
  return (
    <AppShell title="Mock Library">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mock Examination Library</h1>
          <p className="text-sm text-muted-foreground mt-1">All available mock exams. Complete sessions to unlock the next.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs shrink-0">
          {["All", "Available", "Completed", "Locked"].map((t, i) => (
            <button key={t} className={`px-3 py-1.5 rounded-lg border border-border ${i === 0 ? "bg-primary text-primary-foreground" : "bg-surface hover:bg-accent"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {/* {mocks.map((m) => (
          <div key={m.id} className="card-elevated rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Mock Assessment</span>
                <h3 className="mt-1.5 text-lg font-semibold">{m.title}</h3>
              </div>
              <div className="h-9 w-9 rounded-full bg-surface-elevated border border-border grid place-items-center text-sm font-semibold">{m.number}</div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border"><BookOpenCheck className="h-3 w-3" /> 180 Questions</span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border"><Flame className="h-3 w-3" /> 4h 30m</span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border"><BarChart3 className="h-3 w-3" /> Medium</span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span className="text-foreground font-medium">{m.progress}%</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-surface-elevated overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${m.progress}%` }} />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              {m.sessions.some((s) => s.status === "available") ? (
                <Link to="/exam/$mockId" params={{ mockId: m.sessions.find((s) => s.status === "available")!.id }} className="flex-1 text-center text-xs py-2 rounded-md bg-primary text-primary-foreground font-medium">
                  <Play className="h-3 w-3 inline mr-1" /> Start
                </Link>
              ) : m.sessions.every((s) => s.status === "completed") ? (
                <Link to="/results/$resultId" params={{ resultId: m.sessions[0].id }} className="flex-1 text-center text-xs py-2 rounded-md bg-success text-success-foreground font-medium">
                  Review
                </Link>
              ) : (
                <button disabled className="flex-1 text-center text-xs py-2 rounded-md bg-surface-elevated text-muted-foreground border border-border cursor-not-allowed">
                  <Lock className="h-3 w-3 inline mr-1" /> Locked
                </button>
              )}
            </div>
          </div>
        ))} */}
        {mocks.map((m) => (
          <div key={m.id} className="card-elevated rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Mock Assessment</span>
                <h3 className="mt-1.5 text-lg font-semibold capitalize">Mock Level {m.cfa_level==='one' ? '1' : m.cfa_level==='two' ? '2' : '3'} - {m.name}</h3>
              </div>
              <div className="h-9 w-9 rounded-full bg-surface-elevated border border-border grid place-items-center text-sm font-semibold">{m.id}</div>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border"><BookOpenCheck className="h-3 w-3" /> {m.total_questions} Questions</span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border"><Flame className="h-3 w-3" /> {m.formatted_duration}</span>
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-surface border border-border capitalize"><BarChart3 className="h-3 w-3 " /> {m.difficulty}</span>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span className="text-foreground font-medium">{m.progress ?? 0}%</span>
              </div>
              <div className="mt-1.5 h-2 rounded-full bg-surface-elevated overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{ width: `${m.progress ?? 0}%` }} />
              </div>
            </div>

            <div className="mt-5 flex gap-2">
              {m.is_unlocked ? (
                m.submission_status === 'submitted' ?
                <>
                  <Link to="/results/$resultId" params={{ resultId: m.result_id ?? '' }} className="flex-1 text-center text-xs py-2 rounded-md bg-success text-success-foreground font-medium">
                    Review
                  </Link>
                  {m.is_retake && (
                    <button onClick={()=>onClickMock(m)} className="flex-1 text-center text-xs py-2 rounded-md bg-primary text-primary-foreground font-medium cursor-pointer">
                        <Play className="h-3 w-3 inline mr-1" /> Retake
                    </button>
                  )}
                </>
                 : <button onClick={()=>onClickMock(m)} className="flex-1 text-center text-xs py-2 rounded-md bg-primary text-primary-foreground font-medium cursor-pointer">
                    <Play className="h-3 w-3 inline mr-1" /> Start
                </button>
              ) : (
                <button disabled className="flex-1 text-center text-xs py-2 rounded-md bg-surface-elevated text-muted-foreground border border-border cursor-not-allowed">
                  <Lock className="h-3 w-3 inline mr-1" /> <span className="hidden sm:inline">Complete {m.unlock_name ?? 'previous'} to </span>Unlock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
