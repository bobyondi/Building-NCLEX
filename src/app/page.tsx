"use client";

import Link from "next/link";

const TRUST_ITEMS = [
  { icon: "✓", text: "NCLEX-aligned questions" },
  { icon: "✓", text: "Written by nursing educators" },
  { icon: "✓", text: "Personalized plan after results" },
];

const FEATURES = [
  {
    title: "Know your weak spots",
    description:
      "Our diagnostic identifies exactly where you need the most work — so you study smarter, not harder.",
  },
  {
    title: "Get a real plan",
    description:
      "Based on your timeline, availability, and results, we build a daily study plan that actually fits your life.",
  },
  {
    title: "Understand every answer",
    description:
      "Every question comes with a rationale, why wrong answers are wrong, and a key takeaway you'll remember on exam day.",
  },
];

const STATS = [
  { value: "5 min", label: "diagnostic" },
  { value: "10", label: "questions" },
  { value: "Free", label: "no signup" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ──────────────────────────────────── */}
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
          <Link
            href="/diagnostic"
            className="text-sm font-medium text-primary hover:text-primary-dark transition-colors"
          >
            Start Free Diagnostic
          </Link>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-light text-primary-dark text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-primary rounded-full" />
            Free — no signup required
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight tracking-tight mb-5">
            Find out if you&apos;re ready
            <br />
            <span className="text-primary">for the NCLEX</span>
          </h1>

          {/* Subhead */}
          <p className="text-lg text-muted leading-relaxed mb-8 max-w-lg mx-auto">
            Take a 5-minute diagnostic. See your strengths, your weak spots,
            and get a personalized study plan — instantly.
          </p>

          {/* CTA */}
          <Link
            href="/diagnostic"
            className="cta-pulse inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
          >
            Start Free Diagnostic
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust Strip ──────────────────────────── */}
      <section className="border-y border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.text}
                className="flex items-center gap-2 text-sm text-muted"
              >
                <span className="w-5 h-5 rounded-full bg-success-light text-success flex items-center justify-center text-xs font-bold">
                  {item.icon}
                </span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h2 className="text-2xl font-bold text-foreground text-center mb-3">
          How it works
        </h2>
        <p className="text-muted text-center mb-12 max-w-md mx-auto">
          Three steps to a study plan that actually works for you.
        </p>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            {
              step: "1",
              title: "Take the diagnostic",
              desc: "Answer 10 NCLEX-style questions. We track your accuracy, speed, and confidence across categories.",
            },
            {
              step: "2",
              title: "See your results",
              desc: "Instant breakdown of your strongest and weakest areas — no fluff, just clarity.",
            },
            {
              step: "3",
              title: "Get your plan",
              desc: "We generate a daily study plan based on your timeline, availability, and weakest areas.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-card border border-border rounded-2xl p-6 text-center hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary text-white font-bold flex items-center justify-center mx-auto mb-4 text-lg">
                {item.step}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────── */}
      <section className="bg-card border-y border-border">
        <div className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold text-foreground text-center mb-12">
            Built for how nurses actually study
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="space-y-2">
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Ready to find out where you stand?
        </h2>
        <p className="text-muted mb-8 max-w-md mx-auto">
          5 minutes. 10 questions. A clear picture of what to study next.
        </p>
        <Link
          href="/diagnostic"
          className="cta-pulse inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold text-lg px-8 py-4 rounded-xl transition-colors"
        >
          Start Free Diagnostic
          <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </section>

      {/* ── Footer ───────────────────────────────── */}
      <footer className="border-t border-border bg-card">
        <div className="max-w-5xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-muted">
            NCLEXPrep — Study smarter. Pass with confidence.
          </p>
        </div>
      </footer>
    </div>
  );
}
