import { createFileRoute, redirect } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { AppShell } from "@/components/app-shell";
import { CheckCircle2, Circle } from "lucide-react";

export const Route = createFileRoute("/study-plan")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStoredUser()) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Study Plan — Kaplan CFA Mock Portal" }] }),
  component: StudyPlan,
});

const plan = [
  { week: "Week 1", topic: "Ethics & Professional Standards", done: true },
  { week: "Week 2", topic: "Quantitative Methods", done: true },
  { week: "Week 3", topic: "Economics", done: true },
  { week: "Week 4", topic: "Financial Reporting & Analysis", done: false, current: true },
  { week: "Week 5", topic: "Corporate Issuers", done: false },
  { week: "Week 6", topic: "Equity Investments", done: false },
  { week: "Week 7", topic: "Fixed Income", done: false },
  { week: "Week 8", topic: "Derivatives & Alternatives", done: false },
  { week: "Week 9", topic: "Portfolio Management", done: false },
  { week: "Week 10", topic: "Full-Length Mock Exams", done: false },
];

function StudyPlan() {
  return (
    <AppShell title="Study Plan">
      <h1 className="text-2xl font-semibold tracking-tight">Your Study Plan</h1>
      <p className="text-sm text-muted-foreground mt-1">A structured 10-week curriculum aligned with the CFA Level 1 syllabus.</p>

      <div className="mt-6 card-elevated rounded-2xl p-6">
        <ol className="relative border-l border-border ml-2">
          {plan.map((item) => (
            <li key={item.week} className="ml-6 pb-6 last:pb-0">
              <span className="absolute -left-[11px] grid h-5 w-5 place-items-center rounded-full bg-background border border-border">
                {item.done ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Circle className={`h-3 w-3 ${item.current ? "text-primary fill-primary" : "text-muted-foreground"}`} />}
              </span>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-muted-foreground">{item.week}</div>
                  <div className="text-sm font-medium mt-0.5">{item.topic}</div>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-md border ${
                  item.done ? "bg-success/15 text-success border-success/30" :
                  item.current ? "bg-primary/15 text-primary border-primary/30" :
                  "bg-surface border-border text-muted-foreground"}`}>
                  {item.done ? "Completed" : item.current ? "In Progress" : "Upcoming"}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </AppShell>
  );
}
