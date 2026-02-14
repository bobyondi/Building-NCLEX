"use client";

import { useState, useEffect } from "react";
import { StudyPlan, OnboardingProfile, CATEGORY_LABELS, NCLEXCategory } from "@/types";
import Link from "next/link";

export default function DashboardPage() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [profile, setProfile] = useState<OnboardingProfile | null>(null);

  useEffect(() => {
    const storedPlan = sessionStorage.getItem("studyPlan");
    const storedProfile = sessionStorage.getItem("onboardingProfile");
    if (storedPlan) setPlan(JSON.parse(storedPlan));
    if (storedProfile) setProfile(JSON.parse(storedProfile));
  }, []);

  if (!plan || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">
            Welcome to NCLEXPrep
          </h1>
          <p className="text-muted mb-6">
            Take your free diagnostic to get a personalized study plan.
          </p>
          <Link
            href="/diagnostic"
            className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Start Free Diagnostic
          </Link>
        </div>
      </div>
    );
  }

  const accuracy = profile.diagnosticResult
    ? Math.round(profile.diagnosticResult.accuracy * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-foreground text-lg">
              NCLEX<span className="text-primary">Prep</span>
            </span>
          </div>
          <span className="text-sm text-muted">
            {profile.examType ? `NCLEX-${profile.examType}` : ""}
          </span>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Day 1 — Let&apos;s begin
          </h1>
          <p className="text-muted">
            Your plan: {plan.questionsPerDay} questions per day,{" "}
            {plan.sessionsPerWeek} days a week, for {plan.totalWeeks} weeks.
          </p>
        </div>

        {/* Today's task card */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Today&apos;s session</h2>
            <span className="text-xs text-muted bg-muted-light px-3 py-1 rounded-full">
              ~{plan.dailyTimeMinutes} min
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-3 p-3 bg-muted-light rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  Practice {plan.questionsPerDay} questions
                </div>
                <div className="text-xs text-muted">
                  Focus: {plan.focusAreas.slice(0, 2).map((c) => CATEGORY_LABELS[c as NCLEXCategory]).join(", ")}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted-light rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">
                  Review rationales
                </div>
                <div className="text-xs text-muted">
                  Understand every answer deeply
                </div>
              </div>
            </div>
          </div>

          <button className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold transition-colors">
            Start Today&apos;s Session
          </button>
        </div>

        {/* Diagnostic score recap */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6">
          <h3 className="font-semibold text-foreground mb-4">
            Your starting point
          </h3>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className={`text-3xl font-bold ${accuracy >= 70 ? "text-success" : accuracy >= 50 ? "text-accent" : "text-danger"}`}>
                {accuracy}%
              </div>
              <div className="text-xs text-muted mt-1">Diagnostic score</div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted mb-2">Focus areas:</p>
              <div className="flex flex-wrap gap-1.5">
                {plan.focusAreas.map((cat) => (
                  <span
                    key={cat}
                    className="text-xs font-medium bg-danger-light text-danger px-2 py-1 rounded-md"
                  >
                    {CATEGORY_LABELS[cat as NCLEXCategory]}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Coming soon banner */}
        <div className="bg-primary-light border border-primary/20 rounded-2xl p-6 text-center">
          <h3 className="font-semibold text-foreground mb-2">
            Full study mode coming soon
          </h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            Adaptive practice, spaced repetition, readiness scores, and detailed
            analytics are on the way. Your plan and progress will be saved.
          </p>
        </div>
      </div>
    </div>
  );
}
