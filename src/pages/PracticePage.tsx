import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight, Check, X, Clock, Bookmark, BookmarkCheck,
  Flag, ArrowLeft, Zap, Target, ChevronRight, Home,
  Play, RotateCcw, BarChart3, Flame,
} from "lucide-react";
import type { UserAnswer, Question } from "@/types";
import { DIAGNOSTIC_BANKS } from "@/data/questions";
import { shuffle, formatTime } from "@/lib/utils";
import { loadProgress, saveProgress, recordSession } from "@/lib/store";
import type { UserProgress } from "@/lib/store";

type Phase = "ready" | "question" | "rationale" | "summary";

function getQuestionsForFocus(focus: string, count: number): Question[] {
  // Try exact match first, then fallback
  const bank = DIAGNOSTIC_BANKS[focus] || DIAGNOSTIC_BANKS.mixed;
  return shuffle(bank).slice(0, count);
}

function SessionSummary({ answers, elapsed, onAgain, onDashboard, streak }: {
  answers: UserAnswer[];
  elapsed: number;
  onAgain: () => void;
  onDashboard: () => void;
  streak: number;
}) {
  const correct = answers.filter((a) => a.correct).length;
  const pct = Math.round((correct / answers.length) * 100);
  const confident = answers.filter((a) => a.confidence === "confident" && a.correct).length;
  const guesses = answers.filter((a) => a.confidence === "guess").length;

  // Category breakdown
  const cats: Record<string, { t: number; c: number }> = {};
  answers.forEach((a) => {
    if (!cats[a.cat]) cats[a.cat] = { t: 0, c: 0 };
    cats[a.cat].t++;
    if (a.correct) cats[a.cat].c++;
  });

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "hsl(var(--background))" }}>
      <div className="max-w-[480px] w-full" style={{ animation: "fadeUp 0.5s ease" }}>
        {/* Score hero */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: pct >= 70 ? "var(--green-s)" : pct >= 50 ? "var(--accent-s)" : "var(--red-s)" }}>
            {pct >= 70 ? <Zap size={28} style={{ color: "var(--teal)" }} /> : <Target size={28} style={{ color: pct >= 50 ? "hsl(var(--primary))" : "var(--nclex-red)" }} />}
          </div>
          <div className="text-[48px] font-extrabold" style={{ letterSpacing: "-0.04em", color: pct >= 70 ? "var(--teal)" : pct >= 50 ? "hsl(var(--primary))" : "var(--nclex-red)" }}>{pct}%</div>
          <p className="text-[14px] mt-1" style={{ color: "var(--text-secondary)" }}>
            {correct} of {answers.length} correct · {formatTime(elapsed)}
          </p>
          {streak > 1 && (
            <div className="inline-flex items-center gap-[5px] mt-2 text-[12px] font-bold" style={{ color: "#F59E0B", background: "rgba(245,158,11,0.08)", padding: "4px 12px", borderRadius: 100 }}>
              <Flame size={13} fill="#F59E0B" /> {streak} day streak!
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-[8px] mb-4">
          <div className="nclex-card text-center" style={{ padding: "12px 8px" }}>
            <div className="text-[18px] font-extrabold" style={{ color: "var(--teal)" }}>{confident}</div>
            <div className="text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>Confident & Correct</div>
          </div>
          <div className="nclex-card text-center" style={{ padding: "12px 8px" }}>
            <div className="text-[18px] font-extrabold" style={{ color: "var(--nclex-red)" }}>{guesses}</div>
            <div className="text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>Guesses</div>
          </div>
          <div className="nclex-card text-center" style={{ padding: "12px 8px" }}>
            <div className="text-[18px] font-extrabold">{Math.round(elapsed / answers.length)}s</div>
            <div className="text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>Avg Time</div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="nclex-card mb-4" style={{ padding: "18px 20px" }}>
          <h3 className="font-bold text-[14px] mb-3">Category Breakdown</h3>
          {Object.entries(cats).sort((a, b) => Math.round((a[1].c / a[1].t) * 100) - Math.round((b[1].c / b[1].t) * 100)).map(([name, d]) => {
            const catPct = Math.round((d.c / d.t) * 100);
            return (
              <div key={name} className="mb-[8px] last:mb-0">
                <div className="flex justify-between mb-1">
                  <span className="text-[12px] font-semibold">{name}</span>
                  <span className="text-[11px] font-semibold" style={{ color: catPct >= 70 ? "var(--teal)" : "var(--nclex-red)" }}>{d.c}/{d.t}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "hsl(var(--background-alt))" }}>
                  <div className="h-full rounded-full" style={{ width: `${catPct}%`, background: catPct >= 70 ? "var(--teal)" : "var(--nclex-red)", animation: "growBar 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-[8px]">
          <button className="btn btn-p" onClick={onAgain} style={{ width: "100%", padding: 14, borderRadius: 12, fontSize: 15 }}>
            <RotateCcw size={15} /> Practice Again
          </button>
          <button className="btn btn-o" onClick={onDashboard} style={{ width: "100%", padding: 14, borderRadius: 12, fontSize: 14 }}>
            <BarChart3 size={15} /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PracticePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focusParam = searchParams.get("focus") || "mixed";

  const [phase, setPhase] = useState<Phase>("ready");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [conf, setConf] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [sessionStreak, setSessionStreak] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const sessionSize = 7; // questions per session

  const cfs = [
    { k: "guess", l: "Guessing", c: "var(--nclex-red)", bg: "var(--red-s)" },
    { k: "unsure", l: "Unsure", c: "hsl(var(--primary))", bg: "var(--accent-s)" },
    { k: "confident", l: "Confident", c: "var(--teal)", bg: "var(--teal-s)" },
  ];

  const startSession = useCallback(() => {
    const qs = getQuestionsForFocus(focusParam, sessionSize);
    setQuestions(qs);
    setIdx(0);
    setAnswers([]);
    setSel(null);
    setConf(null);
    setElapsed(0);
    setPhase("question");
    timer.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  }, [focusParam]);

  useEffect(() => {
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);

  const submitAnswer = () => {
    if (!sel) return;
    setPhase("rationale");
  };

  const nextQuestion = () => {
    const q = questions[idx];
    const isCorrect = sel === q.correct;
    const newAnswer: UserAnswer = {
      questionId: q.id,
      selected: sel!,
      confidence: conf as UserAnswer["confidence"],
      correct: isCorrect,
      cat: q.cat,
    };
    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (idx + 1 < questions.length) {
      setIdx(idx + 1);
      setSel(null);
      setConf(null);
      setPhase("question");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Session complete
      if (timer.current) clearInterval(timer.current);
      let progress = loadProgress();
      progress = recordSession(progress, newAnswers, elapsed, focusParam);

      // Handle bookmarks and flags
      if (bookmarked.size > 0) {
        const existing = new Set(progress.bookmarkedQuestions);
        bookmarked.forEach((id) => existing.add(id));
        progress.bookmarkedQuestions = Array.from(existing);
      }
      if (flagged.size > 0) {
        const existing = new Set(progress.flaggedQuestions);
        flagged.forEach((id) => existing.add(id));
        progress.flaggedQuestions = Array.from(existing);
      }

      saveProgress(progress);
      setSessionStreak(progress.streak.current);
      setPhase("summary");
    }
  };

  // ---- READY phase ----
  if (phase === "ready") {
    const focusLabel = focusParam === "mixed" ? "Mixed Review" : focusParam;
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "hsl(var(--background))" }}>
        <div className="max-w-[440px] w-full text-center" style={{ animation: "fadeUp 0.4s ease" }}>
          <div className="w-14 h-14 rounded-[16px] flex items-center justify-center mx-auto mb-4" style={{ background: "var(--accent-s)" }}>
            <Play size={24} className="text-primary" />
          </div>
          <h1 className="text-[26px] font-extrabold mb-[6px]" style={{ letterSpacing: "-0.03em" }}>Practice Session</h1>
          <p className="text-[14px] mb-2 leading-[1.5]" style={{ color: "var(--text-secondary)" }}>
            {sessionSize} questions · ~{Math.round(sessionSize * 1.5)} minutes · {focusLabel}
          </p>

          <div className="nclex-card mb-4 text-left" style={{ padding: "16px 18px" }}>
            <div className="flex flex-col gap-[8px] text-[13px]" style={{ color: "var(--text-secondary)" }}>
              <div className="flex items-center gap-[8px]"><Check size={14} style={{ color: "var(--teal)" }} /> Answer each question at your own pace</div>
              <div className="flex items-center gap-[8px]"><Check size={14} style={{ color: "var(--teal)" }} /> Rate your confidence to track growth</div>
              <div className="flex items-center gap-[8px]"><Check size={14} style={{ color: "var(--teal)" }} /> Read rationales to reinforce learning</div>
              <div className="flex items-center gap-[8px]"><Check size={14} style={{ color: "var(--teal)" }} /> Bookmark questions for later review</div>
            </div>
          </div>

          <button className="btn btn-p mb-3" onClick={startSession} style={{ width: "100%", padding: 15, borderRadius: 12, fontSize: 15 }}>
            Begin <ArrowRight size={16} />
          </button>
          <button className="btn btn-g" onClick={() => navigate("/dashboard")}>
            <ArrowLeft size={14} /> Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ---- SUMMARY phase ----
  if (phase === "summary") {
    return (
      <SessionSummary
        answers={answers}
        elapsed={elapsed}
        streak={sessionStreak}
        onAgain={() => {
          setBookmarked(new Set());
          setFlagged(new Set());
          startSession();
        }}
        onDashboard={() => navigate("/dashboard")}
      />
    );
  }

  // ---- QUESTION / RATIONALE phase ----
  const q = questions[idx];
  if (!q) return null;
  const isOk = sel === q.correct;
  const isRationale = phase === "rationale";
  const isBookmarked = bookmarked.has(q.id);
  const isFlagged = flagged.has(q.id);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(var(--background))" }}>
      {/* Sticky header */}
      <div className="sticky top-0 z-50" style={{ borderBottom: "1px solid hsl(var(--border))", background: "rgba(251,247,243,0.95)", backdropFilter: "blur(12px)" }}>
        <div className="max-w-[1100px] mx-auto flex justify-between items-center" style={{ padding: "10px 20px" }}>
          <div className="flex items-center gap-3">
            <button className="btn btn-g" onClick={() => navigate("/dashboard")} style={{ padding: "6px 8px", borderRadius: 8 }}>
              <Home size={15} />
            </button>
            <div className="flex items-center gap-[6px]">
              <span className="text-[13px] font-bold">{idx + 1}<span style={{ color: "var(--text-tertiary)" }}>/{questions.length}</span></span>
              <span className="text-[11px] font-semibold text-primary" style={{ background: "var(--accent-s)", padding: "2px 8px", borderRadius: 100 }}>{q.cat}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBookmarked((prev) => { const next = new Set(prev); if (next.has(q.id)) next.delete(q.id); else next.add(q.id); return next; })}
              className="transition-colors"
              title="Bookmark for review"
            >
              {isBookmarked ? <BookmarkCheck size={16} style={{ color: "var(--gold)" }} fill="var(--gold)" /> : <Bookmark size={16} style={{ color: "var(--text-tertiary)" }} />}
            </button>
            <button
              onClick={() => setFlagged((prev) => { const next = new Set(prev); if (next.has(q.id)) next.delete(q.id); else next.add(q.id); return next; })}
              className="transition-colors"
              title="Flag issue with question"
            >
              <Flag size={14} style={{ color: isFlagged ? "var(--nclex-red)" : "var(--text-tertiary)" }} fill={isFlagged ? "var(--nclex-red)" : "none"} />
            </button>
            <span className="flex items-center gap-1 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
              <Clock size={12} /> {formatTime(elapsed)}
            </span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-[3px]" style={{ background: "hsl(var(--border))" }}>
          <div className="h-full transition-all duration-500" style={{
            width: `${((idx + (isRationale ? 1 : 0.5)) / questions.length) * 100}%`,
            background: "linear-gradient(90deg, hsl(var(--primary)), var(--teal))",
          }} />
        </div>
      </div>

      {/* Question area */}
      <div className="max-w-[640px] mx-auto flex-1 px-5 pt-6 pb-10 w-full" key={`q-${idx}`}>
        <h2 className="text-[17px] font-semibold leading-relaxed mb-5" style={{ animation: "fadeUp 0.35s ease" }}>{q.stem}</h2>

        {/* Choices */}
        <div className="flex flex-col gap-[7px] mb-5">
          {q.choices.map((c) => {
            let cls = "qc";
            if (isRationale) {
              if (c.id === q.correct) cls += " ok";
              else if (c.id === sel) cls += " no";
              else cls += " dim";
            } else if (sel === c.id) cls += " sel";
            return (
              <button key={c.id} className={cls} onClick={() => !isRationale && setSel(c.id)} disabled={isRationale}>
                <span className="ql">
                  {isRationale && c.id === q.correct ? <Check size={13} /> : isRationale && c.id === sel && !isOk ? <X size={13} /> : c.id.toUpperCase()}
                </span>
                <span>{c.t}</span>
              </button>
            );
          })}
        </div>

        {/* Confidence + Submit (question phase) */}
        {!isRationale && (
          <div>
            <div className="flex items-center justify-between mb-[7px]">
              <span className="text-[11px] font-bold uppercase" style={{ color: "var(--text-tertiary)", letterSpacing: "0.08em" }}>How confident?</span>
              <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Optional</span>
            </div>
            <div className="flex gap-[7px] mb-[14px]">
              {cfs.map((cl) => (
                <button key={cl.k} className="cf" onClick={() => setConf(cl.k)} style={{ color: conf === cl.k ? cl.c : undefined, borderColor: conf === cl.k ? cl.c : undefined, background: conf === cl.k ? cl.bg : undefined }}>
                  {cl.l}
                </button>
              ))}
            </div>
            <button className={`btn ${sel ? "btn-p" : "btn-d"}`} onClick={submitAnswer} style={{ width: "100%", padding: 15, borderRadius: 12, fontSize: 15 }}>
              Check Answer
            </button>
          </div>
        )}

        {/* Rationale phase */}
        {isRationale && (
          <div className="flex flex-col gap-3" style={{ animation: "scaleIn 0.3s ease" }}>
            <div className="rounded-xl" style={{ background: isOk ? "var(--green-s)" : "var(--red-s)", border: `1px solid ${isOk ? "rgba(26,122,110,0.12)" : "rgba(201,68,82,0.1)"}`, padding: "18px 20px" }}>
              <div className="font-bold text-[15px] mb-2" style={{ color: isOk ? "var(--teal)" : "var(--nclex-red)" }}>
                {isOk ? "Correct!" : "Not quite."}
              </div>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{q.rationale}</p>
            </div>

            {!isOk && sel && q.whyNot?.[sel] && (
              <div className="rounded-xl" style={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", padding: "16px 20px", animation: "fadeIn 0.3s ease 0.1s forwards", opacity: 0 }}>
                <div className="font-bold text-[13px] mb-[6px]">Why {sel.toUpperCase()} is wrong:</div>
                <p className="text-[13px] leading-[1.55]" style={{ color: "var(--text-secondary)" }}>{q.whyNot[sel]}</p>
              </div>
            )}

            {q.keyConcept && (
              <div className="rounded-xl" style={{ background: "var(--gold-s)", border: "1px solid rgba(196,155,47,0.15)", padding: "16px 20px", animation: "fadeIn 0.3s ease 0.15s forwards", opacity: 0 }}>
                <div className="font-bold text-[13px] mb-[6px]" style={{ color: "var(--gold)" }}>Key Takeaway</div>
                <p className="text-[13px] leading-[1.55]" style={{ color: "var(--text-secondary)" }}>{q.keyConcept}</p>
              </div>
            )}

            <button className="btn btn-p" onClick={nextQuestion} style={{ width: "100%", padding: 15, borderRadius: 12, fontSize: 15 }}>
              {idx + 1 < questions.length ? (
                <>Next Question <ChevronRight size={16} /></>
              ) : (
                <>See Results <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
