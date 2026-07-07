import { createFileRoute, Link, useNavigate, redirect } from "@tanstack/react-router";
import { getStoredUser } from "@/lib/auth";
import { sessionQuestions, m1AmQuestions } from "@/lib/mock-data";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Flag, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle2,
  BookOpenCheck, ClipboardList, ShieldAlert, ArrowRight,
  MousePointerClick, ListOrdered, Lock, Clock,
  Settings, SlidersHorizontal, ChevronDown, ChevronUp, X,
  Loader2, FileQuestion,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { getMockDetails ,getMockQuestions, submitMockExam } from "@/store/slices/mock-slice";
export const Route = createFileRoute("/exam/$mockId")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && !getStoredUser()) throw redirect({ to: "/login" });
  },
  head: () => ({ meta: [{ title: "Exam — Kaplan CFA Mock Portal" }] }),
  component: ExamPage,
});

type FilterType = "all" | "flagged" | "attempted" | "not-attempted";

type QuestionMetrics = {
  id: string;
  viewCount: number;
  totalTimeSeconds: number;
  timeAfterAttemptSeconds: number;
};

function ExamPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { mockId } = Route.useParams();
  const navigate = useNavigate();
  const { mock, mockQuestions } = useSelector((state: RootState) => state.mocks);
  // Once a real (possibly empty) fetch has completed, stop falling back to
  // placeholder data so a genuinely empty exam is shown as empty, not masked.
  const [questionsLoaded, setQuestionsLoaded] = useState(false);
  const questions = useMemo(() => {
    if (mockQuestions.length > 0) return mockQuestions;
    if (questionsLoaded) return [];
    return sessionQuestions[mockId] ?? m1AmQuestions;
  }, [mockQuestions, mockId, questionsLoaded]);
  const hasQuestions = questions.length > 0;
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, "A" | "B" | "C">>({});
  const [flagged, setFlagged] = useState<Set<string>>(new Set());
  const [seconds, setSeconds] = useState(() => (mock?.duration_minutes ?? 135) * 60);
  const [confirm, setConfirm] = useState(false);
  const [exitAttempt, setExitAttempt] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(true);
  const [beginLoading, setBeginLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [beginError, setBeginError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  // console.log('====================================');
  // console.log(JSON.stringify(mock,null,2));
  // console.log('====================================');
  const INSTRUCTIONS = [
    {
      icon: Clock,
      title: "Time limit",
      body: `You have ${mock?.formatted_duration ?? "0 hours 0 minutes"} to complete this session. The countdown begins the moment you click Begin Exam.`,
    },
    {
      icon: BookOpenCheck,
      title: "Questions",
      body: `This session contains ${mock?.total_questions ?? 0} questions spanning 10 CFA Level ${mock?.cfa_level==='one' ? '1' : mock?.cfa_level==='two' ? '2' : '3'} topic areas. Each question has exactly one correct answer.`,
    },
    {
      icon: ListOrdered,
      title: "Navigation",
      body: `Use the Previous / Next buttons or the Question Palette to move between questions. You can revisit any question before submitting.`,
    },
    {
      icon: Flag,
      title: "Flagging",
      body: `Flag questions you are unsure about and return to them later. Flagged questions are highlighted in the palette.`,
    },
    {
      icon: MousePointerClick,
      title: "Submitting",
      body: `Click Finish Test when you are ready. You will be asked to confirm before the session is closed.`,
    },
    {
      icon: ShieldAlert,
      title: "Important",
      body: `Once submitted, you cannot re-enter this session. Ensure you have answered all intended questions before submitting.`,
    },
  ];

  // --- NEW TRACKING REFS ---
  const trackingMetricsRef = useRef<Record<string, QuestionMetrics>>({});
  const currentQIdRef = useRef<string>(questions[0]?.id);
  const answersRef = useRef(answers);

  // Fetch mock details on load
  useEffect(() => {
    if (!mock && mockId) dispatch(getMockDetails(mockId) as any);
  }, [mockId]);

  // Initialize tracking metrics for all questions when the exam loads
  useEffect(() => {
    const initialMetrics: Record<string, QuestionMetrics> = {};
    questions.forEach((q) => {
      initialMetrics[q.id] = {
        id: q.id,
        viewCount: 0, // 0 initially, updated when viewed
        totalTimeSeconds: 0,
        timeAfterAttemptSeconds: 0,
      };
    });
    trackingMetricsRef.current = initialMetrics;
  }, [questions]);

  // Keep refs synced with React state so our setInterval can read them without restarting
  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  // Sync the countdown to the mock's duration once it loads, but only before the exam starts
  useEffect(() => {
    if (instructionsOpen && mock?.duration_minutes) {
      setSeconds(mock.duration_minutes * 60);
    }
  }, [mock?.duration_minutes, instructionsOpen]);

  useEffect(() => {
    const activeQ = questions[idx];
    if (!activeQ) return;
    
    currentQIdRef.current = activeQ.id;

    // Only log views if instructions are closed
    if (!instructionsOpen && trackingMetricsRef.current[activeQ.id]) {
      trackingMetricsRef.current[activeQ.id].viewCount += 1;
    }
  }, [idx, instructionsOpen, questions]);

  // Timer only runs after instructions are dismissed
  useEffect(() => {
      if (instructionsOpen) return;

      const t = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds <= 1) {
            clearInterval(t);
            handleFinalSubmit(); // Trigger final submit if time runs out
            return 0;
          }
          return prevSeconds - 1;
        });

        // --- TRACKING LOGIC ---
        const qId = currentQIdRef.current;
        if (qId && trackingMetricsRef.current[qId]) {
          // Add 1 second to the total time spent on this specific question
          trackingMetricsRef.current[qId].totalTimeSeconds += 1;
          
          // If this question's ID exists in the answers ref, the user is looking at it AFTER attempting it
          if (answersRef.current[qId]) {
            trackingMetricsRef.current[qId].timeAfterAttemptSeconds += 1;
          }
        }
      }, 1000);

      return () => clearInterval(t);
    }, [seconds, mockId, navigate, instructionsOpen]);
    
    // Block navigation away once exam starts
    useEffect(() => {
      if (instructionsOpen) return;
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
      };
      window.history.pushState(null, "", window.location.href);
      const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
        setExitAttempt(true);
      };
      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
      };
    }, [instructionsOpen]);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Group questions into sections by topic
  const sections = useMemo(() => {
    const topicOrder: string[] = [];
    const topicMap = new Map<string, number[]>();
    questions.forEach((q, i) => {
      if (!topicMap.has(q.topic)) {
        topicMap.set(q.topic, []);
        topicOrder.push(q.topic);
      }
      topicMap.get(q.topic)!.push(i);
    });
    return topicOrder.map(topic => ({ topic, indices: topicMap.get(topic)! }));
  }, [questions]);

  // All sections start expanded
  const [expandedSections, setExpandedSections] = useState<Set<number>>(
    () => new Set(Array.from({ length: 50 }, (_, i) => i))
  );

  const toggleSection = (si: number) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      next.has(si) ? next.delete(si) : next.add(si);
      return next;
    });
  };
// Reusable submit function to handle both manual clicks and timer run-outs
  const handleFinalSubmitOld = () => {
    const metricsArray = Object.values(trackingMetricsRef.current);
    const attemptedCount = Object.keys(answersRef.current).length;
    const notAttemptedCount = questions.length - attemptedCount;

    const TOTAL_EXAM_SECONDS = (mock?.duration_minutes ?? 0) * 60;
    const overallTimeSpent = TOTAL_EXAM_SECONDS - seconds;

    // Initialize accuracy counters
    let correctCount = 0;
    let wrongCount = 0;

    const subjectMap:any = {};

    // Process each question to determine correctness
    const finalQuestionMetrics = metricsArray.map((m) => {
      const question = questions.find((q) => q.id === m.id);
      const correctAnswer = question?.answer;
      const givenAnswer = answersRef.current[m.id] || null;
      let isCorrect = false;

      if (givenAnswer) {
        if (givenAnswer === correctAnswer) {
          isCorrect = true;
          correctCount += 1;
        } else {
          wrongCount += 1;
        }
      }

      // Build subject stats
      const subject = question?.topic || "Unknown";

      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          subject,
          score: 0,
          total: 0,
        };
      }

      subjectMap[subject].total += 1;

      if (isCorrect) {
        subjectMap[subject].score += 1;
      }

      return {
        questionId: m.id,
        topic: question?.topic,
        totalTimeSpent: m.totalTimeSeconds,
        timeSpentAfterAttempt: m.timeAfterAttemptSeconds,
        timesViewed: m.viewCount,
        isReopened: m.viewCount > 1,
        isAttempted: !!givenAnswer,
        givenAnswer: givenAnswer,
        correctAnswer: correctAnswer, 
        isCorrect: isCorrect,
      };
    });

    const subjectStats = Object.values(subjectMap);
    // Prepare the final analytics payload
    const trackingReport = {
      examId: mockId,
      userId: user?.id,
      summary: {
        totalQuestions: questions.length,
        attempted: attemptedCount,
        notAttempted: notAttemptedCount,
        correctCount: correctCount,
        wrongCount: wrongCount,
        overallTimeLeft: seconds,
        totalTimeSpent: overallTimeSpent,
      },
      subjectStats,
      questionMetrics: finalQuestionMetrics,
    };

    // TODO: Dispatch 'trackingReport' to your backend API here
    console.log("Final Analytics Payload:", trackingReport);
    // localStorage.removeItem(mockId);
    // localStorage.setItem(mockId,JSON.stringify(trackingReport));
    // navigate({ to: "/results/$resultId", params: { resultId: mockId } });
  };

  const handleFinalSubmit = async () => {
    const metricsArray = Object.values(trackingMetricsRef.current);
    const attemptedCount = Object.keys(answersRef.current).length;
    const notAttemptedCount = questions.length - attemptedCount;

    const TOTAL_EXAM_SECONDS = (mock?.duration_minutes ?? 0) * 60;
    const overallTimeSpent = TOTAL_EXAM_SECONDS - seconds;

    // Process each question to determine correctness
    const finalQuestionMetrics = metricsArray.map((m) => {
      const question = questions.find((q) => q.id === m.id);
      const givenAnswer = answersRef.current[m.id] || null;


      return {
        questionId: question?.question_id,
        totalTimeSpent: m.totalTimeSeconds,
        timeSpentAfterAttempt: m.timeAfterAttemptSeconds,
        timesViewed: m.viewCount,
        isReopened: m.viewCount > 1,
        isAttempted: !!givenAnswer,
        givenAnswer: givenAnswer,
      };
    });
    // Prepare the final analytics payload
    const data = {
      examId: mockId,
      questionMetrics: finalQuestionMetrics,
      totalQuestions: questions.length,
      attempted: attemptedCount,
      notAttempted: notAttemptedCount,
      totalTimeSpent: overallTimeSpent,
    };

    // TODO: Dispatch 'trackingReport' to your backend API here
    // console.log("Final Analytics Payload:", data);
    // dispatch(submitMockExam({ mockId, data }) as any)
    try {
      setSubmitLoading(true);
      const result: any = await (dispatch(submitMockExam({ mockId, data }) as any) as any);
      if (result.meta.requestStatus === "fulfilled") {
        navigate({ to: "/results/$resultId", params: { resultId: mockId } });
      }
    } catch (error) {
      console.error("Error submitting exam:", error);
    } finally {
      setSubmitLoading(false);
    }
  }

  const handleBeginExam = async () => {
    if (!mock?.id || beginLoading) return;
    setBeginError(null);
    setBeginLoading(true);
    try {
      const result: any = await (dispatch(getMockQuestions(mock.id) as any) as any).unwrap();
      setQuestionsLoaded(true);
      const loaded = result?.data ?? [];
      if (!loaded.length) {
        setBeginError("No questions were found for this exam. Please contact support.");
        return;
      }
      setInstructionsOpen(false);
    } catch (err: any) {
      setBeginError(typeof err === "string" ? err : err?.message ?? "Failed to load questions. Please try again.");
    } finally {
      setBeginLoading(false);
    }
  }

  //handle submit 
  const handleSubmit = () =>{
    handleFinalSubmit();
    // navigate({ to: "/results/$resultId", params: { resultId: mockId } });
  }

  const q = questions[idx];
  const hh = Math.floor(seconds / 3600).toString().padStart(2, "0");
  const mm = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");
  const lowTime = seconds < 600;
  const progress = hasQuestions ? Math.round((Object.keys(answers).length / questions.length) * 100) : 0;

  const currentSectionIdx = useMemo(
    () => sections.findIndex(s => s.indices.includes(idx)),
    [sections, idx]
  );

  const toggleFlag = () => {
    if (!q) return;
    setFlagged(prev => {
      const next = new Set(prev);
      next.has(q.id) ? next.delete(q.id) : next.add(q.id);
      return next;
    });
  };

  const passesFilter = (qIdx: number) => {
    const question = questions[qIdx];
    if (filterType === "flagged") return flagged.has(question.id);
    if (filterType === "attempted") return !!answers[question.id];
    if (filterType === "not-attempted") return !answers[question.id];
    return true;
  };

  const filterLabel =
    filterType === "flagged" ? "Flagged"
    : filterType === "attempted" ? "Attempted"
    : filterType === "not-attempted" ? "Not Attempted"
    : "Filter";

  const noSidebarResults = filterType !== "all" && sections.every(s => s.indices.filter(passesFilter).length === 0);

  const renderPalette = (closeOnSelect: boolean) => (
    <>
      {noSidebarResults && (
        <div className="h-full flex justify-center items-center">
          <div className="px-4 py-8 text-center items-center text-sm text-gray-400">
            No questions match this filter
            <button 
            className="w-full flex justify-center px-3 py-1.5 rounded text-sm font-medium transition-colors mt-2 border border-red-300 text-red-500 hover:cursor-pointer "
            onClick={()=>setFilterType('all')}
            >Clear Filter</button>
          </div>
        </div>
      )}
      {filterType !== 'all' && !noSidebarResults ? 
        <div className="px-2 flex justify-between items-center mb-2">
            <p className="">
              <span className="truncate"><strong>{filterLabel}</strong></span>
            </p>
            <button
            className="flex justify-center px-3 py-1.5 rounded text-sm font-medium border border-red-300 text-red-500 transition-colors mt-2 hover:cursor-pointer "
            onClick={()=>setFilterType('all')}
            >Clear Filter</button>
        </div>
        : ''}
      {sections.map((section, si) => {
        const hasMultiple = section.indices.length > 1;
        const isExpanded = expandedSections.has(si);
        const isActiveSection = currentSectionIdx === si;
        const visibleSubIndices = section.indices.filter(passesFilter);
        if (filterType !== "all" && visibleSubIndices.length === 0) return null;

        return (
          <div key={si} className="px-2 mb-1">
            {/* Section header */}
            <button
              onClick={() => {
                if (hasMultiple) {
                  toggleSection(si);
                } else {
                  setIdx(section.indices[0]);
                  if (closeOnSelect) setPaletteOpen(false);
                }
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded text-sm font-semibold text-white transition-opacity"
              style={{
                background: "#4caf50",
                opacity: isActiveSection ? 1 : 0.82,
              }}
              onMouseEnter={e => { if (!isActiveSection) (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              onMouseLeave={e => { if (!isActiveSection) (e.currentTarget as HTMLElement).style.opacity = "0.82"; }}
            >
              <span>{si + 1}</span>
              {hasMultiple && (
                isExpanded
                  ? <ChevronUp className="h-3.5 w-3.5" />
                  : <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {/* Sub-questions */}
            {hasMultiple && isExpanded && (
              <div className="mt-1 pl-2 space-y-0.5 grid grid-cols-3 gap-1">
                {section.indices.map((qi, subI) => {
                  if (!passesFilter(qi)) return null;
                  const subQ = questions[qi];
                  const isActive = qi === idx;
                  const isAnswered = !!answers[subQ.id];
                  const isFlagged = flagged.has(subQ.id);
                  return (
                    <button
                      key={qi}
                      onClick={() => { setIdx(qi); if (closeOnSelect) setPaletteOpen(false); }}
                      className="w-full flex justify-center px-3 py-1.5 rounded text-sm font-medium transition-colors border border-primary/20 hover:cursor-pointer"
                      style={
                        isActive
                          ? { background: "#4caf50", color: "#ffffff" }
                          : isFlagged
                          ? { background: "#b45309", color: "#fffbeb" }
                          : isAnswered
                          ? { background: "#4b5563", color: "#f9fafb" }
                          : {}
                      }
                    >
                      {isFlagged ?
                       <>
                        <Flag className="h-4 w-4" /> 
                        <span className="pr-4"/>
                       </>
                      : ''}
                       {si + 1}.{subI + 1}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </>
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">

      {/* ── Instructions modal ── */}
      {instructionsOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm sm:p-4">
          <div className="bg-background w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl flex flex-col max-h-[92dvh] sm:max-h-[90vh] shadow-2xl">
            <div className="flex items-center gap-3 px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-primary/20 shrink-0">
              <div className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-xl bg-green-100 text-green-600 grid place-items-center">
                <ClipboardList className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-semibold tracking-tight">Exam Instructions</h2>
                <p className="text-[11px] sm:text-xs text-gray-500">Read carefully before you begin</p>
              </div>
              <div className="ml-auto hidden sm:flex gap-2 text-xs">
                {[
                  { label: "Questions", value: `${ mock?.total_questions ?? questions.length}` },
                  { label: "Duration", value: `${ mock?.formatted_duration ?? "0h 0m" }` },
                  { label: "Topics", value: `${ mock?.mock_modules_count ?? sections.length}` },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg bg-gradient-to-br border border-primary/20 px-2.5 sm:px-3 py-1.5 text-center">
                    <div className="text-gray-500 text-[10px]">{s.label}</div>
                    <div className="font-semibold text-xs mt-0.5">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              <div className="flex sm:hidden gap-2 px-4 pt-3">
                {[
                  { label: "Questions", value: `${ mock?.total_questions ?? questions.length}` },
                  { label: "Duration", value: `${ mock?.formatted_duration ?? "0h 0m" }` },
                  { label: "Topics", value: `${ mock?.mock_modules_count ?? sections.length}` },
                ].map((s) => (
                  <div key={s.label} className="flex-1 rounded-lg bg-gradient-to-br border border-primary/20 px-2 py-1.5 text-center">
                    <div className="text-gray-500 text-[10px]">{s.label}</div>
                    <div className="font-semibold text-[11px] mt-0.5">{s.value}</div>
                  </div>
                ))}
              </div>
              <div className="px-4 sm:px-6 pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                {INSTRUCTIONS.map((item) => (
                  <div key={item.title} className="flex items-start gap-2.5 rounded-xl bg-gradient-to-br border border-primary/20 p-3">
                    <div className="h-6 w-6 shrink-0 rounded-md bg-green-100 text-green-600 grid place-items-center mt-0.5">
                      <item.icon className="h-3 w-3" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold">{item.title}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.body}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mx-4 sm:mx-6 mt-3 mb-1 rounded-xl bg-amber-50 border border-amber-200 px-3 sm:px-3.5 py-2.5 flex items-start sm:items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                <p className="text-xs text-gray-600">
                  <span className="font-semibold text-gray-800">The timer starts</span> only after you click Begin Exam. Make sure you are ready before proceeding.
                </p>
              </div>
              {beginError && (
                <div className="mx-4 sm:mx-6 mt-2 mb-1 rounded-xl bg-red-50 border border-red-200 px-3 sm:px-3.5 py-2.5 flex items-start sm:items-center gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0 mt-0.5 sm:mt-0" />
                  <p className="text-xs text-red-700">{beginError}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3 px-4 sm:px-6 pt-3 pb-4 sm:pb-5 border-t border-primary/20 shrink-0">
              <Link
                to="/dashboard"
                className="flex-1 text-center text-sm py-2.5 rounded-lg bg-background border border-primary/20 transition-colors text-forground hover:bg-primary/20"
              >
                Go back
              </Link>
              <button
                onClick={handleBeginExam}
                disabled={beginLoading}
                className="flex-1 inline-flex items-center justify-center gap-2 text-sm py-2.5 rounded-lg font-medium transition-colors text-white hover:cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                style={{ background: "#4caf50" }}
              >
                {beginLoading ? (
                  <>Loading questions <Loader2 className="h-4 w-4 animate-spin" /></>
                ) : (
                  <>Begin Exam <ArrowRight className="h-4 w-4" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Dark header ── */}
      <header className="bg-background">
        <div className="container m-auto h-14 shrink-0 flex items-center px-2.5 sm:px-4 md:px-6 gap-2 sm:gap-4">
          {/* Left: Question / Section info */}
          <div className="text-[11px] sm:text-xs leading-snug shrink-0 sm:min-w-[90px]">
            <div className="font-bold">
              <span className="hidden sm:inline">Question: </span>
              <span className="sm:hidden">Q</span>{hasQuestions ? idx + 1 : "-"}
            </div>
            <div style={{ color: "#9ca3af" }}>
              <span className="hidden sm:inline">Section: </span>
              <span className="sm:hidden">Sec </span>{hasQuestions ? currentSectionIdx + 1 : "-"}
            </div>
          </div>

          {/* Center: Timer + Progress */}
          <div className="flex-1 flex items-center justify-center gap-2 sm:gap-3 md:gap-5 min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2 text-white shrink-0">
              <Clock className="h-4 w-4 shrink-0" style={{ color: "#9ca3af" }} />
              <div>
                <div className="hidden sm:block text-[10px] leading-none" style={{ color: "#9ca3af" }}>Section Time Remaining:</div>
                <div
                  className="text-xs sm:text-sm font-mono font-bold text-muted-foreground leading-tight mt-0.5 tabular-nums"
                  // style={{ color: lowTime && !instructionsOpen ? "#f87171" : "#ffffff" }}
                >
                  {instructionsOpen ? "00:14:59" : `${hh}:${mm}:${ss}`}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1 min-w-[56px] sm:min-w-[100px] md:min-w-[140px]">
              <div className="w-full h-2 rounded-full overflow-hidden bg-accent">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progress}%`, background: "#4caf50" }}
                  // style={{ width: `${progress}%`, background: "#ffffff" }}
                />
              </div>
              <div className="hidden sm:block text-[10px]" style={{ color: "#9ca3af" }}>Progress {progress}%</div>
            </div>
          </div>

          {/* Right: Finish Test */}
          <button
            onClick={() => setConfirm(true)}
            disabled={instructionsOpen}
            className="h-9 px-2.5 sm:px-4 md:px-5 rounded-lg text-xs sm:text-sm font-bold text-white disabled:opacity-40 transition-colors shrink-0 hover:cursor-pointer"
            style={{ background: "#4caf50" }}
            // style={{ background: "#e8c84a", color: "#1c2333" }}
          >
            <span className="hidden sm:inline">Finish Test</span>
            <span className="sm:hidden">Finish</span>
          </button>
        </div>
      </header>

      {/* ── Green info bar ── */}
      <div
        // className="h-9 shrink-0 flex items-center justify-between gap-2 px-2.5 sm:px-4 md:px-6 text-[11px] sm:text-sm"
        style={{ background: "#4caf50" }}
      >
        <div className="container m-auto h-9 shrink-0 flex items-center text-white justify-between gap-2 px-2.5 sm:px-4 md:px-6 text-[11px] sm:text-sm">
          <span className="truncate"><strong>ACE Exam Portal</strong></span>
          <span className="truncate shrink-0"><strong>Candidate : </strong>{user?.name ?? "Guest"}</span>
        </div>
      </div>

      {/* ── Body: left sidebar + main content ── */}
        <div className="container m-auto flex-1 flex overflow-hidden">
          {/* Left sidebar (desktop) */}
          <aside className="hidden md:block w-1/4 shrink-0 border-x border-primary/20 overflow-y-auto py-2 px-2
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:bg-primary/20
            [&::-webkit-scrollbar-thumb]:bg-[#4caf50]
          ">
            {hasQuestions && renderPalette(false)}
          </aside>

          {/* Main question content */}
          <main className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
              {q ? (
                <div className="bg-background border border-primary/20 rounded-xl shadow-sm p-4 sm:p-5 md:p-8">
                  {/* Topic + flag badge */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span
                      className="text-xs px-2.5 py-1 rounded-full font-medium border"
                      style={{color: "#15803d", borderColor: "#15803d" }}
                    >
                      {q.topic}
                    </span>
                    <span className="text-xs text-gray-400">Question {idx + 1} of {questions.length}</span>
                    {flagged.has(q.id) && (
                      <span
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border"
                        style={{color: "#b45309", borderColor: "#b45309" }}
                      >
                        <Flag className="h-3 w-3" /> Flagged
                      </span>
                    )}
                  </div>

                  {/* Question text */}
                  <p className="text-base md:text-lg leading-relaxed">{q.prompt}</p>

                  {/* Answer options */}
                  <div className="mt-6 space-y-3">
                    {q.options.map((opt) => {
                      const selected = answers[q.id] === opt.key;
                      return (
                        <button
                          key={opt.key}
                          onClick={() => setAnswers({ ...answers, [q.id]: opt.key })}
                          className="w-full text-left flex items-start gap-4 p-4 rounded-lg border-2 border-primary/20 transition-all"
                          style={
                            selected
                              ? { borderColor: "#4caf50"}
                              : {}
                          }
                        >
                          <span
                            className="h-7 w-7 shrink-0 rounded grid place-items-center text-sm font-bold transition-colors"
                            style={
                              selected
                                ? { background: "#4caf50", color: "#ffffff" }
                                : { background: "#f3f4f6", color: "#6b7280" }
                            }
                          >
                            {opt.key}
                          </span>
                          <span className="text-sm pt-0.5 leading-relaxed">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-background border border-primary/20 rounded-xl shadow-sm p-8 flex flex-col items-center text-center gap-3">
                  <div className="h-11 w-11 rounded-full bg-red-100 text-red-600 grid place-items-center">
                    <FileQuestion className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold">No questions available</h3>
                  <p className="text-sm text-gray-500 max-w-sm">
                    This exam session doesn't have any questions loaded. Please go back and try again, or contact support if the problem continues.
                  </p>
                  <Link
                    to="/dashboard"
                    className="mt-2 inline-flex text-sm px-4 py-2 rounded-lg bg-background border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    Back to dashboard
                  </Link>
                </div>
              )}
            </div>
          </main>
        </div>

      {/* ── Bottom toolbar ── */}
      <div className="h-14 shrink-0 bg-background border-t border-primary/20 px-2.5 sm:px-4 md:px-6">
        <div className="container m-auto h-14 flex items-center justify-between gap-2 px-2.5 sm:px-4 md:px-6">
          {/* Left section: Palette + Settings + Filter */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Question palette toggle (mobile / tablet) */}
            <button
              onClick={() => setPaletteOpen(true)}
              disabled={!hasQuestions}
              className="md:hidden h-9 w-9 rounded-lg border border-primary/20 grid place-items-center text-muted-foreground transition-colors disabled:opacity-40"
              aria-label="Open question palette"
            >
              <ListOrdered className="h-4 w-4" />
            </button>

            {/* Settings icon */}
            <button
              className="hidden sm:grid h-9 w-9 rounded-lg border border-primary/20 place-items-center text-muted-foreground transition-colors"
              aria-label="Settings"
            >
              <Settings className="h-4 w-4" />
            </button>

            {/* Filter button with dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="h-9 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-lg border border-primary/20 text-sm text-muted-foreground font-medium transition-colors"
                style={
                  filterType !== "all"
                    ? { borderColor: "#86efac", color: "#15803d" }
                    : {}
                }
                aria-label="Filter questions"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">{filterLabel}</span>
                {filterType !== "all" && (
                  <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "#4caf50" }} />
                )}
                <ChevronDown className={`h-3 w-3 transition-transform ${filterOpen ? "rotate-180" : ""}`} />
              </button>

              {filterOpen && (
                <div className="absolute bottom-11 left-0 bg-white border border-gray-200 rounded-xl shadow-xl py-1 w-48 z-50">
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wide border-b border-gray-100" style={{ color: "#9ca3af" }}>
                    Filter Questions
                  </div>
                  {(
                    [
                      { label: "All Questions", value: "all" },
                      { label: "Flagged", value: "flagged" },
                      { label: "Attempted", value: "attempted" },
                      { label: "Not Attempted", value: "not-attempted" },
                    ] as { label: string; value: FilterType }[]
                  ).map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setFilterType(opt.value); setFilterOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors hover:bg-gray-50"
                      style={filterType === opt.value ? { background: "#f0fdf4", color: "#15803d", fontWeight: 500 } : { color: "#374151" }}
                    >
                      {filterType === opt.value && (
                        <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ background: "#4caf50" }} />
                      )}
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right section: Flag + Previous + Next */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Flag button */}
            <button
              onClick={toggleFlag}
              disabled={!q}
              className="h-9 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-lg border border-primary/20 text-muted-foreground text-sm font-medium transition-colors disabled:opacity-40"
              style={
                q && flagged.has(q.id)
                  ? {color: "#b45309"}
                  : {}
              }
            >
              <Flag className="h-4 w-4" />
              <span className="hidden sm:inline">{q && flagged.has(q.id) ? "Unflag" : "Flag"}</span>
            </button>

            {/* Previous button */}
            <button
              onClick={() => setIdx(Math.max(0, idx - 1))}
              disabled={!hasQuestions || idx === 0}
              className="h-9 px-2.5 sm:px-4 flex items-center gap-1.5 rounded-lg border border-primary/20 text-sm text-muted-foreground disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Next button */}
            <button
              onClick={() => setIdx(Math.min(questions.length - 1, idx + 1))}
              disabled={!hasQuestions || idx === questions.length - 1}
              className="h-9 px-2.5 sm:px-4 flex items-center gap-1.5 rounded-lg text-sm font-bold text-white disabled:opacity-40 transition-colors"
              style={{ background: "#4caf50" }}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile/tablet question palette sheet ── */}
      {paletteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="bg-white w-full rounded-t-2xl flex flex-col max-h-[75dvh] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
              <h3 className="text-sm font-semibold text-gray-900">Question Palette</h3>
              <button
                onClick={() => setPaletteOpen(false)}
                className="h-8 w-8 grid place-items-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                aria-label="Close question palette"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="overflow-y-auto py-2">
              {hasQuestions && renderPalette(true)}
            </div>
          </div>
        </div>
      )}

      {/* ── Exit-attempt warning ── */}
      {exitAttempt && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="h-11 w-11 rounded-full bg-red-100 text-red-600 grid place-items-center">
              <Lock className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Exam in progress</h3>
            <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
              You cannot leave this exam without submitting. Complete your exam and click{" "}
              <strong className="">Finish Test</strong> to exit.
            </p>
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setExitAttempt(false)}
                className="flex-1 text-sm py-2.5 rounded-lg bg-background border border-primary/20 hover:bg-primary/20 transition-colors"
              >
                Continue exam
              </button>
              <button
                onClick={() => { setExitAttempt(false); setConfirm(true); }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 text-sm py-2.5 rounded-lg text-white font-medium transition-colors"
                style={{ background: "#4caf50" }}
              >
                <CheckCircle2 className="h-4 w-4" /> Submit now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Submit confirm dialog ── */}
      {confirm && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 grid place-items-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Submit your exam?</h3>
            <p className="text-sm text-gray-500 mt-1">
              You answered {Object.keys(answers).length} of {questions.length} questions.
              You can't return to this session after submitting.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                onClick={() => setConfirm(false)}
                className="text-sm px-4 py-2 rounded-lg bg-background border border-primary/20 hover:bg-primary/20 hover:cursor-pointer "
              >
                Keep going
              </button>
              <button
                className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg text-white font-medium hover:cursor-pointer"
                style={{ background: "#4caf50" }}
                onClick={handleSubmit}
                disabled={submitLoading}
              > 
              {submitLoading ? (
                <>Submitting <Loader2 className="h-4 w-4 animate-spin" /></>
              ) : (
                <><CheckCircle2 className="h-4 w-4" /> Submit now </>
              )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
