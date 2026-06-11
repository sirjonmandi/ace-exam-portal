import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight, BarChart3, BookOpenCheck, ShieldCheck, Timer, Lock, TrendingUp, FileText } from "lucide-react";
import { ThemeToggle } from "@/lib/theme";
import { getStoredUser } from "@/lib/auth";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getStoredUser()) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Kaplan CFA Mock Portal — Master Your CFA Exam" },
      { name: "description", content: "Premium CFA mock exam platform. Full-length timed mocks, adaptive analytics, and structured assessments to ace the CFA exam." },
      { property: "og:title", content: "Kaplan CFA Mock Portal" },
      { property: "og:description", content: "Master your CFA Exam with structured mock assessments." },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: BookOpenCheck,
    title: "6 Full-Length Mock Exams",
    desc: "180 questions per mock across 2 sessions — Morning and Afternoon — matching the real CFA format.",
  },
  {
    icon: Timer,
    title: "Timed Exam Sessions",
    desc: "2h 15m per session with a live countdown timer and auto-submit when time expires.",
  },
  {
    icon: Lock,
    title: "Progressive Unlock",
    desc: "Complete each session to unlock the next. Mirrors the real CFA progression pathway.",
  },
  {
    icon: BarChart3,
    title: "Topic-by-Topic Analytics",
    desc: "See your accuracy across all 10 CFA topic areas and identify exactly where to focus.",
  },
  {
    icon: TrendingUp,
    title: "Score Trend Tracking",
    desc: "Track how your scores improve across mocks with visual progress charts.",
  },
  {
    icon: FileText,
    title: "Detailed Score Reports",
    desc: "Post-exam breakdowns with correct answers, weak topics, and suggested next steps.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-hero-grad">
      <header className="max-w-7xl mx-auto flex items-center px-4 md:px-6 lg:px-10 h-16 md:h-20">
        <Link to="/" className="flex items-center gap-2 md:gap-3">
          <div className="h-8 w-8 md:h-9 md:w-9 rounded-lg bg-primary/20 text-primary grid place-items-center font-bold text-sm shrink-0">CFA</div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">Kaplan CFA Mock Portal</div>
            <div className="text-[11px] text-muted-foreground hidden sm:block">Chartered Financial Analyst Practice</div>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-1.5 md:gap-2">
          <ThemeToggle />
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground px-2 md:px-3 py-2">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="text-sm px-3 md:px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 pt-8 md:pt-10 pb-16 md:pb-20 grid lg:grid-cols-[1.1fr_1fr] gap-8 md:gap-12 items-start">
        {/* Left — hero copy */}
        <div>
          <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/20">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> 2026 CFA Level 1 Preparation
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05]">
            Master Your CFA Exam<br />
            With Structured Mock<br />
            <span className="text-primary">Assessments</span>
          </h1>
          <p className="mt-6 text-muted-foreground max-w-xl leading-relaxed">
            Complete full-length mock exams, unlock advanced sessions progressively, analyze your weak areas,
            and simulate the real CFA testing experience.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
            >
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border bg-surface/60 text-sm font-medium hover:bg-surface"
            >
              Sign in
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl">
            {[
              { icon: BookOpenCheck, label: "Full-length mocks", value: "6" },
              { icon: Timer, label: "Per session", value: "2h 15m" },
              { icon: ShieldCheck, label: "Anti-cheat", value: "Built-in" },
              { icon: BarChart3, label: "Topic areas", value: "10" },
            ].map((f) => (
              <div key={f.label} className="card-elevated rounded-xl p-3">
                <f.icon className="h-4 w-4 text-primary" />
                <div className="mt-2 text-xs text-muted-foreground">{f.label}</div>
                <div className="text-sm font-semibold">{f.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — what's included */}
        <div className="card-elevated rounded-2xl p-6 lg:p-7">
          <div className="text-sm font-semibold">What's included</div>
          <p className="text-xs text-muted-foreground mt-1">Everything you need to pass the CFA Level 1 exam.</p>
          <ul className="mt-5 space-y-4">
            {features.map((f) => (
              <li key={f.title} className="flex items-start gap-3">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center">
                  <f.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="text-sm font-medium">{f.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 pt-5 border-t border-border">
            <Link
              to="/signup"
              className="w-full inline-flex items-center justify-center gap-2 text-sm py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90"
            >
              Create free account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
