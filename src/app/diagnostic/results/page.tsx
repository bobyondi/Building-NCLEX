"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DiagnosticResult, CATEGORY_LABELS, NCLEXCategory } from "@/types";
import Link from "next/link";

export default function ResultsPage() {
  const router = useRouter();
  const [result, setResult] = useState<DiagnosticResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("diagnosticResult");
    if (stored) {
      setResult(JSON.parse(stored));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-muted mb-4">No results found.</p>
          <Link
            href="/diagnostic"
            className="text-primary hover:text-primary-dark font-medium"
          >
            Take the diagnostic first
          </Link>
        </div>
      </div>
    );
  }

  const accuracyPercent = Math.round(result.accuracy * 100);
  const avgTimeSeconds = Math.round(result.avgTimePerQuestion / 1000);

  const categoriesWithData = (
    Object.entries(result.categoryBreakdown) as [
      NCLEXCategory,
      { correct: number; total: number }
    ][]
  )
    .filter(([, data]) => data.total > 0)
    .sort(([, a], [, b]) => a.correct / a.total - b.correct / b.total);

  const handleBuildPlan = () => {
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="bg-card border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-semibold text-foreground">
              NCLEX<span className="text-primary">Prep</span>
            </span>
          </div>
          <span className="text-sm text-muted">Diagnostic Results</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10 animate-slide-up">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Your diagnostic results
          </h1>
          <p className="text-muted">
            Here&apos;s where you stand — and where to focus.
          </p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="bg-card border border-border rounded-2xl p-5 text-center animate-slide-up">
            <div
              className={`text-3xl font-bold mb-1 ${
                accuracyPercent >= 70
                  ? "text-success"
                  : accuracyPercent >= 50
                  ? "text-accent"
                  : "text-danger"
              }`}
            >
              {accuracyPercent}%
            </div>
            <div className="text-sm text-muted">Accuracy</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 text-center animate-slide-up">
            <div className="text-3xl font-bold text-foreground mb-1">
              {avgTimeSeconds}s
            </div>
            <div className="text-sm text-muted">Avg per question</div>
          </div>
          <div className="bg-card border border-border rounded-2xl p-5 text-center animate-slide-up">
            <div className="text-3xl font-bold text-foreground mb-1">
              {result.answers.length}
            </div>
            <div className="text-sm text-muted">Questions</div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-10 animate-slide-up">
          <h2 className="font-semibold text-foreground mb-1">
            Performance by category
          </h2>
          <p className="text-sm text-muted mb-6">
            Categories are sorted from weakest to strongest.
          </p>

          <div className="space-y-4">
            {categoriesWithData.map(([category, data]) => {
              const pct =
                data.total > 0
                  ? Math.round((data.correct / data.total) * 100)
                  : 0;
              const isWeak = result.weakestCategories.includes(category);
              const barColor =
                pct >= 70
                  ? "bg-success"
                  : pct >= 50
                  ? "bg-accent"
                  : "bg-danger";

              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {CATEGORY_LABELS[category]}
                      </span>
                      {isWeak && (
                        <span className="text-[10px] font-semibold text-danger bg-danger-light px-2 py-0.5 rounded-full uppercase tracking-wide">
                          Focus area
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted">
                      {data.correct}/{data.total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2.5 bg-muted-light rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full animate-progress`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak areas summary */}
        {result.weakestCategories.length > 0 && (
          <div className="bg-accent-light border border-accent/20 rounded-2xl p-6 mb-10 animate-slide-up">
            <h3 className="font-semibold text-foreground mb-2">
              Your priority focus areas
            </h3>
            <p className="text-sm text-muted mb-4">
              We&apos;ll weight your study plan toward these categories to close the
              gaps fastest.
            </p>
            <div className="flex flex-wrap gap-2">
              {result.weakestCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center text-sm font-medium bg-card border border-border text-foreground px-3 py-1.5 rounded-lg"
                >
                  {CATEGORY_LABELS[cat]}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center animate-slide-up">
          <h3 className="text-xl font-bold text-foreground mb-2">
            Ready to build your study plan?
          </h3>
          <p className="text-sm text-muted mb-6 max-w-md mx-auto">
            Tell us your exam date and availability, and we&apos;ll create a daily
            plan focused on your weakest areas.
          </p>
          <button
            onClick={handleBuildPlan}
            className="cta-pulse inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
          >
            Build My Study Plan
            <svg
              className="ml-2 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>

          <div className="mt-4">
            <Link
              href="/diagnostic"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Retake diagnostic
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
