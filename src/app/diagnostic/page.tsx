"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { questionBank } from "@/data/questions";
import { pickRandomQuestions } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { ConfidenceLevel, Question, CATEGORY_LABELS } from "@/types";
import Link from "next/link";

const TOTAL_QUESTIONS = 10;

type Phase = "intro" | "quiz" | "rationale";

export default function DiagnosticPage() {
  const router = useRouter();
  const {
    diagnosticQuestions,
    currentQuestionIndex,
    setDiagnosticQuestions,
    addDiagnosticAnswer,
    nextQuestion,
    finishDiagnostic,
  } = useApp();

  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceLevel | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const questions = pickRandomQuestions(questionBank, TOTAL_QUESTIONS);
      setDiagnosticQuestions(questions);
    }
  }, [setDiagnosticQuestions]);

  const currentQuestion: Question | undefined =
    diagnosticQuestions[currentQuestionIndex];

  const startQuiz = useCallback(() => {
    setPhase("quiz");
    setQuestionStartTime(Date.now());
  }, []);

  const submitAnswer = useCallback(() => {
    if (!selectedAnswer || !confidence || !currentQuestion) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    const timeSpent = Date.now() - questionStartTime;

    addDiagnosticAnswer({
      questionId: currentQuestion.id,
      selectedAnswer,
      confidence,
      isCorrect,
      timeSpentMs: timeSpent,
    });

    setPhase("rationale");
  }, [
    selectedAnswer,
    confidence,
    currentQuestion,
    questionStartTime,
    addDiagnosticAnswer,
  ]);

  const goToNext = useCallback(() => {
    if (currentQuestionIndex + 1 >= TOTAL_QUESTIONS) {
      const result = finishDiagnostic();
      // Store result in sessionStorage for the results page
      sessionStorage.setItem("diagnosticResult", JSON.stringify(result));
      router.push("/diagnostic/results");
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      nextQuestion();
      setSelectedAnswer(null);
      setConfidence(null);
      setPhase("quiz");
      setQuestionStartTime(Date.now());
      setIsTransitioning(false);
    }, 200);
  }, [currentQuestionIndex, finishDiagnostic, nextQuestion, router]);

  // ── Intro Screen ──────────────────────────────
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-lg w-full text-center animate-slide-up">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted hover:text-foreground transition-colors mb-8"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-3">
            Your free diagnostic is ready
          </h1>
          <p className="text-muted leading-relaxed mb-2">
            {TOTAL_QUESTIONS} questions. No signup. At the end, you&apos;ll see your
            weakest areas and a personalized study plan.
          </p>
          <p className="text-sm text-muted/70 mb-8">
            Questions are drawn from real NCLEX categories — pharmacology,
            med-surg, pediatrics, maternal-newborn, and more.
          </p>

          <button
            onClick={startQuiz}
            className="cta-pulse w-full sm:w-auto inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
          >
            Begin Diagnostic
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>

          <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted">
            <span>~5 minutes</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Instant results</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>100% free</span>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading guard ──
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted">Loading questions...</div>
      </div>
    );
  }

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const progress = ((currentQuestionIndex + 1) / TOTAL_QUESTIONS) * 100;

  // ── Quiz / Rationale Screen ───────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="text-sm font-medium text-foreground">
            Question {currentQuestionIndex + 1}{" "}
            <span className="text-muted">of {TOTAL_QUESTIONS}</span>
          </div>
          <div className="text-xs text-muted px-3 py-1 bg-muted-light rounded-full">
            {CATEGORY_LABELS[currentQuestion.category]}
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-muted-light">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        className={`max-w-3xl mx-auto px-6 py-8 transition-opacity duration-200 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* Question stem */}
        <div className="mb-8 animate-slide-up">
          <h2 className="text-xl font-semibold text-foreground leading-relaxed">
            {currentQuestion.stem}
          </h2>
        </div>

        {/* Answer choices */}
        <div className="space-y-3 mb-8">
          {currentQuestion.choices.map((choice) => {
            const isSelected = selectedAnswer === choice.label;
            const isDisabled = phase === "rationale";
            const isThisCorrect = choice.label === currentQuestion.correctAnswer;

            let borderColor = "border-border";
            let bgColor = "bg-card";
            let ringColor = "";

            if (phase === "rationale") {
              if (isThisCorrect) {
                borderColor = "border-success";
                bgColor = "bg-success-light";
              } else if (isSelected && !isThisCorrect) {
                borderColor = "border-danger";
                bgColor = "bg-danger-light";
              }
            } else if (isSelected) {
              borderColor = "border-primary";
              bgColor = "bg-primary-light";
              ringColor = "ring-2 ring-primary/20";
            }

            return (
              <button
                key={choice.label}
                onClick={() => !isDisabled && setSelectedAnswer(choice.label)}
                disabled={isDisabled}
                className={`w-full text-left p-4 rounded-xl border-2 ${borderColor} ${bgColor} ${ringColor} transition-all duration-150 ${
                  !isDisabled ? "hover:border-primary/50 cursor-pointer" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                      phase === "rationale" && isThisCorrect
                        ? "bg-success text-white"
                        : phase === "rationale" && isSelected && !isThisCorrect
                        ? "bg-danger text-white"
                        : isSelected
                        ? "bg-primary text-white"
                        : "bg-muted-light text-muted"
                    }`}
                  >
                    {phase === "rationale" && isThisCorrect
                      ? "✓"
                      : phase === "rationale" && isSelected && !isThisCorrect
                      ? "✗"
                      : choice.label}
                  </span>
                  <span className="text-foreground leading-relaxed pt-1">
                    {choice.text}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Confidence meter (before answering) */}
        {phase === "quiz" && selectedAnswer && (
          <div className="mb-8 animate-slide-up">
            <p className="text-sm font-medium text-foreground mb-3">
              How confident are you?
            </p>
            <div className="flex gap-3">
              {(
                [
                  { value: "not_sure", label: "Not sure", color: "bg-accent-light text-accent border-accent/30" },
                  { value: "somewhat_sure", label: "Somewhat", color: "bg-primary-light text-primary border-primary/30" },
                  { value: "very_sure", label: "Very sure", color: "bg-success-light text-success border-success/30" },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setConfidence(opt.value)}
                  className={`confidence-option flex-1 py-2.5 px-4 rounded-lg border-2 text-sm font-medium transition-all ${
                    confidence === opt.value
                      ? opt.color
                      : "border-border bg-card text-muted hover:border-muted"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Submit button */}
        {phase === "quiz" && (
          <button
            onClick={submitAnswer}
            disabled={!selectedAnswer || !confidence}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              selectedAnswer && confidence
                ? "bg-primary hover:bg-primary-dark text-white cursor-pointer"
                : "bg-muted-light text-muted cursor-not-allowed"
            }`}
          >
            Check Answer
          </button>
        )}

        {/* Rationale */}
        {phase === "rationale" && (
          <div className="animate-reveal">
            {/* Correct/Incorrect banner */}
            <div
              className={`p-4 rounded-xl mb-4 ${
                isCorrect ? "bg-success-light border border-success/20" : "bg-danger-light border border-danger/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-semibold ${isCorrect ? "text-success" : "text-danger"}`}>
                  {isCorrect ? "Correct!" : "Not quite."}
                </span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {currentQuestion.rationale}
              </p>
            </div>

            {/* Why wrong (if answered wrong) */}
            {!isCorrect && selectedAnswer && currentQuestion.whyWrong[selectedAnswer] && (
              <div className="p-4 rounded-xl bg-muted-light border border-border mb-4">
                <p className="text-sm font-medium text-foreground mb-1">
                  Why {selectedAnswer} is wrong:
                </p>
                <p className="text-sm text-muted leading-relaxed">
                  {currentQuestion.whyWrong[selectedAnswer]}
                </p>
              </div>
            )}

            {/* Key takeaway */}
            <div className="p-4 rounded-xl bg-accent-light border border-accent/20 mb-8">
              <p className="text-sm font-medium text-accent mb-1">Key Takeaway</p>
              <p className="text-sm text-foreground/80 leading-relaxed">
                {currentQuestion.keyTakeaway}
              </p>
            </div>

            {/* Next button */}
            <button
              onClick={goToNext}
              className="w-full py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-lg transition-colors"
            >
              {currentQuestionIndex + 1 >= TOTAL_QUESTIONS
                ? "See My Results"
                : "Next Question"}
              <svg className="inline ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
