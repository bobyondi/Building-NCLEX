"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ExamType,
  DiagnosticResult,
  NCLEXCategory,
  CATEGORY_LABELS,
  OnboardingProfile,
  StudyPlan,
} from "@/types";
import { generateStudyPlan } from "@/lib/utils";
import Link from "next/link";

type Step = "exam_type" | "target_date" | "availability" | "daily_time" | "plan_preview";

const STEPS: Step[] = [
  "exam_type",
  "target_date",
  "availability",
  "daily_time",
  "plan_preview",
];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);

  const [profile, setProfile] = useState<OnboardingProfile>({
    examType: null,
    targetDate: null,
    studyDaysPerWeek: null,
    studyMinutesPerDay: null,
    selfAssessment: null,
    diagnosticResult: null,
  });

  const [plan, setPlan] = useState<StudyPlan | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("diagnosticResult");
    if (stored) {
      const parsed = JSON.parse(stored) as DiagnosticResult;
      setDiagnosticResult(parsed);
      setProfile((prev) => ({ ...prev, diagnosticResult: parsed }));
    }
  }, []);

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const goNext = () => {
    if (currentStep + 1 >= STEPS.length) return;

    // Generate plan before showing preview
    if (STEPS[currentStep + 1] === "plan_preview") {
      const updatedProfile = { ...profile, diagnosticResult };
      const generatedPlan = generateStudyPlan(updatedProfile);
      setPlan(generatedPlan);
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
      setIsTransitioning(false);
    }, 200);
  };

  const goBack = () => {
    if (currentStep === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep((prev) => prev - 1);
      setIsTransitioning(false);
    }, 200);
  };

  const canProceed = (): boolean => {
    switch (step) {
      case "exam_type":
        return !!profile.examType;
      case "target_date":
        return !!profile.targetDate;
      case "availability":
        return !!profile.studyDaysPerWeek;
      case "daily_time":
        return !!profile.studyMinutesPerDay;
      case "plan_preview":
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between">
          <button
            onClick={goBack}
            disabled={currentStep === 0}
            className={`text-sm font-medium transition-colors ${
              currentStep === 0
                ? "text-transparent cursor-default"
                : "text-muted hover:text-foreground"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm text-muted">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          <div className="w-5" />
        </div>
        <div className="h-1 bg-muted-light">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div
        className={`max-w-2xl mx-auto px-6 py-12 transition-opacity duration-200 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {/* ── Exam Type ──────────────────── */}
        {step === "exam_type" && (
          <div className="animate-slide-up">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Which NCLEX exam are you taking?
            </h1>
            <p className="text-muted mb-8">
              This helps us tailor your content and study plan.
            </p>

            <div className="space-y-3">
              {(
                [
                  {
                    value: "RN" as ExamType,
                    title: "NCLEX-RN",
                    desc: "Registered Nurse licensure exam",
                  },
                  {
                    value: "PN" as ExamType,
                    title: "NCLEX-PN",
                    desc: "Practical/Vocational Nurse licensure exam",
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setProfile((prev) => ({ ...prev, examType: opt.value }))
                  }
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    profile.examType === opt.value
                      ? "border-primary bg-primary-light ring-2 ring-primary/20"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="font-semibold text-foreground">{opt.title}</div>
                  <div className="text-sm text-muted mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={goNext}
              disabled={!canProceed()}
              className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                canProceed()
                  ? "bg-primary hover:bg-primary-dark text-white"
                  : "bg-muted-light text-muted cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* ── Target Date ────────────────── */}
        {step === "target_date" && (
          <div className="animate-slide-up">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              When is your NCLEX exam?
            </h1>
            <p className="text-muted mb-8">
              We&apos;ll build your plan around your timeline.
            </p>

            <input
              type="date"
              value={profile.targetDate || ""}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, targetDate: e.target.value }))
              }
              className="w-full p-4 rounded-xl border-2 border-border bg-card text-foreground text-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />

            <button
              onClick={() => {
                const fourWeeks = new Date();
                fourWeeks.setDate(fourWeeks.getDate() + 28);
                setProfile((prev) => ({
                  ...prev,
                  targetDate: fourWeeks.toISOString().split("T")[0],
                }));
              }}
              className="mt-3 text-sm text-primary hover:text-primary-dark transition-colors"
            >
              Not scheduled yet? Use 4 weeks from now
            </button>

            <button
              onClick={goNext}
              disabled={!canProceed()}
              className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                canProceed()
                  ? "bg-primary hover:bg-primary-dark text-white"
                  : "bg-muted-light text-muted cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* ── Weekly Availability ─────────── */}
        {step === "availability" && (
          <div className="animate-slide-up">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              How many days per week can you study?
            </h1>
            <p className="text-muted mb-8">
              Be realistic — consistency beats intensity.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 3, label: "3 days" },
                { value: 4, label: "4 days" },
                { value: 5, label: "5 days" },
                { value: 6, label: "6–7 days" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setProfile((prev) => ({
                      ...prev,
                      studyDaysPerWeek: opt.value,
                    }))
                  }
                  className={`p-5 rounded-xl border-2 text-center transition-all ${
                    profile.studyDaysPerWeek === opt.value
                      ? "border-primary bg-primary-light ring-2 ring-primary/20"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="font-semibold text-foreground text-lg">
                    {opt.label}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={goNext}
              disabled={!canProceed()}
              className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                canProceed()
                  ? "bg-primary hover:bg-primary-dark text-white"
                  : "bg-muted-light text-muted cursor-not-allowed"
              }`}
            >
              Continue
            </button>
          </div>
        )}

        {/* ── Daily Time ─────────────────── */}
        {step === "daily_time" && (
          <div className="animate-slide-up">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              How much time per study session?
            </h1>
            <p className="text-muted mb-8">
              Even 20 minutes a day adds up.
            </p>

            <div className="space-y-3">
              {[
                { value: 25, label: "20–30 min", desc: "Quick focused sessions" },
                { value: 45, label: "30–60 min", desc: "Solid daily practice" },
                { value: 75, label: "60–90 min", desc: "Deep study blocks" },
                { value: 105, label: "90+ min", desc: "Intensive preparation" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() =>
                    setProfile((prev) => ({
                      ...prev,
                      studyMinutesPerDay: opt.value,
                    }))
                  }
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                    profile.studyMinutesPerDay === opt.value
                      ? "border-primary bg-primary-light ring-2 ring-primary/20"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="font-semibold text-foreground">{opt.label}</div>
                  <div className="text-sm text-muted mt-0.5">{opt.desc}</div>
                </button>
              ))}
            </div>

            <button
              onClick={goNext}
              disabled={!canProceed()}
              className={`w-full mt-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                canProceed()
                  ? "bg-primary hover:bg-primary-dark text-white"
                  : "bg-muted-light text-muted cursor-not-allowed"
              }`}
            >
              See My Plan
            </button>
          </div>
        )}

        {/* ── Plan Preview ───────────────── */}
        {step === "plan_preview" && plan && (
          <div className="animate-slide-up">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-success-light flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Here&apos;s your study plan
              </h1>
              <p className="text-muted">
                Personalized based on your diagnostic results and availability.
              </p>
            </div>

            {/* Plan summary */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted-light rounded-xl text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {plan.totalWeeks}
                  </div>
                  <div className="text-sm text-muted">weeks</div>
                </div>
                <div className="p-4 bg-muted-light rounded-xl text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {plan.sessionsPerWeek}
                  </div>
                  <div className="text-sm text-muted">sessions/week</div>
                </div>
                <div className="p-4 bg-muted-light rounded-xl text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {plan.questionsPerDay}
                  </div>
                  <div className="text-sm text-muted">questions/day</div>
                </div>
                <div className="p-4 bg-muted-light rounded-xl text-center">
                  <div className="text-2xl font-bold text-foreground">
                    {plan.dailyTimeMinutes}
                  </div>
                  <div className="text-sm text-muted">min/session</div>
                </div>
              </div>
            </div>

            {/* Focus areas */}
            <div className="bg-accent-light border border-accent/20 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-3">
                Priority focus areas
              </h3>
              <p className="text-sm text-muted mb-4">
                Your plan will emphasize these categories based on your
                diagnostic results.
              </p>
              <div className="flex flex-wrap gap-2">
                {plan.focusAreas.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center text-sm font-medium bg-card border border-border text-foreground px-3 py-1.5 rounded-lg"
                  >
                    {CATEGORY_LABELS[cat as NCLEXCategory]}
                  </span>
                ))}
              </div>
            </div>

            {/* Daily preview */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <h3 className="font-semibold text-foreground mb-3">
                A typical study day
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">1</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      Practice questions
                    </div>
                    <div className="text-sm text-muted">
                      {plan.questionsPerDay} questions from your focus areas
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">2</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      Review rationales
                    </div>
                    <div className="text-sm text-muted">
                      Understand why each answer is right (and wrong)
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">3</span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground text-sm">
                      Track progress
                    </div>
                    <div className="text-sm text-muted">
                      See your accuracy improve day over day
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => {
                // Store onboarding data
                sessionStorage.setItem("onboardingProfile", JSON.stringify(profile));
                sessionStorage.setItem("studyPlan", JSON.stringify(plan));
                // For now, go to a "coming soon" state
                router.push("/dashboard");
              }}
              className="cta-pulse w-full py-4 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold text-lg transition-colors"
            >
              Start Day 1
              <svg className="inline ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <div className="text-center mt-4">
              <button
                onClick={goBack}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Edit my preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
