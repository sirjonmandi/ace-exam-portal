import { createFileRoute, redirect } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { progressTrend, subjectBreakdown, snapshot } from "@/lib/mock-data";
import { TrendingUp, Target, Flame, Award, TrendingDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/store";
import { getPerformance } from "@/store/slices/performance-slice";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  LabelList,
} from "recharts";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const Route = createFileRoute("/performance")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStoredUser()) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Performance — Kaplan CFA Mock Portal" }] }),
  component: Performance,
});

function Performance() {
  const dispatch = useDispatch();
  
  const { summary, mockProgress, topicAccuracy, studyStreak } = useSelector((state:RootState)=>state.performance);

  useEffect(()=>{
    dispatch(getPerformance() as any);
  },[])
  return (
    <AppShell title="Performance">
      <h1 className="text-2xl font-semibold tracking-tight">Performance Analytics</h1>
      <p className="text-sm text-muted-foreground mt-1">Track your progress, accuracy, and weak topics across all mocks.</p>

      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Average Score", value: summary.averageScore+"%", icon: Target },
          { label: "Best Score", value: summary.bestScore+"%", icon: Award },
          { label: "Improvement", value: summary.improvement+"%", icon: summary.improvement > 0 ? TrendingUp : TrendingDown},
          { label: "Study Streak", value: summary.studyStreakScore, icon: Flame },
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

          <div className="mt-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockProgress}
                margin={{ top: 24, right: 8, left: -24, bottom: 8 }}
              >
                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="var(--border)"
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 11,
                    fill: "var(--muted-foreground)",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  domain={[0, 100]}
                  hide
                />

                <Bar
                  dataKey="percentage"
                  radius={[8, 8, 0, 0]}
                  maxBarSize={40}
                >
                  <LabelList
                    dataKey="percentage"
                    position="top"
                    formatter={(value) => `${value}%`}
                    style={{
                      fontSize: 11,
                      fill: "var(--muted-foreground)",
                    }}
                  />

                  {mockProgress.map((entry, index) => (
                    <Cell
                      key={index}
                      fill="url(#progressGradient)"
                    />
                  ))}
                </Bar>

                <defs>
                  <linearGradient
                    id="progressGradient"
                    x1="0"
                    y1="1"
                    x2="0"
                    y2="0"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity={1}
                    />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated rounded-2xl p-6">
          <h2 className="text-base font-semibold">Topic Accuracy</h2>
          <div className="mt-5 space-y-3">
            {topicAccuracy && topicAccuracy.map((s) => (
              <div key={s.name}>
                <div className="flex items-center justify-between text-xs">
                  <span>{s.name}</span>
                  <span className="text-muted-foreground tabular-nums">{s.accuracy}%</span>
                </div>
                <div className="mt-1.5 h-2 rounded-full bg-surface-elevated overflow-hidden">
                  <div className={`h-full ${s.accuracy >= 75 ? "bg-success" : s.accuracy >= 65 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${s.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      { studyStreak && studyStreak.length > 0 &&
      (<div className="mt-6 card-elevated rounded-2xl p-6">
        <h2 className="text-base font-semibold">Study Streak</h2>
        <p className="text-sm text-muted-foreground mt-1">Last 30 days of activity</p>
        <TooltipProvider delayDuration={100}>
          <div className="mt-5 grid grid-cols-15 sm:grid-cols-30 gap-1.5" style={{ gridTemplateColumns: "repeat(30, minmax(0,1fr))" }}>
            {(studyStreak ?? []).map((day, i) => {
              const cls =
                day.intensity >= 4 ? "bg-primary" :
                day.intensity === 3 ? "bg-primary/75" :
                day.intensity === 2 ? "bg-primary/50" :
                day.intensity === 1 ? "bg-primary/25" :
                "bg-surface-elevated";
              return (
                <Tooltip key={day.date ?? i}>
                  <TooltipTrigger asChild>
                    <div className={`aspect-square rounded ${cls}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    {day.mocksCompleted} mock{day.mocksCompleted === 1 ? "" : "s"} completed
                    {day.date ? ` · ${day.date}` : ""}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>)
      }
    </AppShell>
  );
}
