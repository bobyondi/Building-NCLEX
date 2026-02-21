import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen, Flame, Target, ArrowRight, Clock, BarChart3,
  TrendingUp, Calendar, ChevronRight, Zap, Award, Play,
} from "lucide-react";
import {
  loadProgress, getOverallAccuracy, getTodayQuestionsCount,
  getDaysUntilExam, getReadinessScore, getWeakestCategories,
  getCategoryAccuracy, getTodaySessionCount,
} from "@/lib/store";
import type { UserProgress } from "@/lib/store";
import { SUBJECTS } from "@/data/subjects";

const catColors: Record<string, string> = {
  Pharmacology: "var(--coral)",
  "Med-Surg": "var(--teal)",
  "Maternal-Newborn": "var(--rose)",
  Pediatrics: "var(--purple)",
  Fundamentals: "var(--gold)",
  "Mental Health": "#8B6BB5",
  Safety: "#B8863B",
  Management: "#5A8E6B",
  Prioritization: "var(--ceil)",
};

function ReadinessRing({ score }: { score: number }) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "var(--teal)" : score >= 40 ? "var(--gold)" : "var(--nclex-red)";

  return (
    <div className="relative w-[140px] h-[140px]">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r} fill="none"
          stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[32px] font-extrabold" style={{ letterSpacing: "-0.03em", color }}>{score}</span>
        <span className="text-[10px] font-bold uppercase" style={{ color: "var(--text-tertiary)", letterSpacing: "0.08em" }}>Readiness</span>
      </div>
    </div>
  );
}

function StreakBadge({ streak }: { streak: number }) {
  return (
    <div className="flex items-center gap-[6px]">
      <div className="relative">
        <Flame size={20} style={{ color: streak > 0 ? "#F59E0B" : "var(--text-tertiary)" }} fill={streak > 0 ? "#F59E0B" : "none"} />
        {streak > 0 && <div className="absolute -top-[2px] -right-[2px] w-[6px] h-[6px] rounded-full" style={{ background: "#F59E0B", animation: "pulseRing 2s infinite" }} />}
      </div>
      <div>
        <div className="text-[18px] font-extrabold leading-none" style={{ letterSpacing: "-0.02em" }}>{streak}</div>
        <div className="text-[10px] font-medium" style={{ color: "var(--text-tertiary)" }}>day streak</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  if (!progress) return null;

  const accuracy = getOverallAccuracy(progress);
  const readiness = getReadinessScore(progress);
  const todayQuestions = getTodayQuestionsCount(progress);
  const todaySessions = getTodaySessionCount(progress);
  const daysUntilExam = getDaysUntilExam(progress);
  const weakest = getWeakestCategories(progress.categories);
  const dailyGoal = progress.onboarding.dailyTime === "60" ? 30 : progress.onboarding.dailyTime === "30" ? 15 : 7;
  const dailyProgress = Math.min(100, Math.round((todayQuestions / dailyGoal) * 100));

  const recentSessions = [...progress.sessions].reverse().slice(0, 5);

  return (
    <div className="min-h-screen" style={{ background: "hsl(var(--background))" }}>
      {/* Top nav */}
      <nav className="sticky top-0 z-50" style={{ background: "rgba(251,247,243,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid hsl(var(--border))" }}>
        <div className="max-w-[900px] mx-auto px-5 flex justify-between items-center h-14">
          <div className="flex items-center gap-[9px]">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), #1A7A6E)" }}>
              <BookOpen size={13} color="#fff" strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-[15px]" style={{ letterSpacing: "-0.02em" }}>
              NCLEX<span className="text-primary">Prep</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <StreakBadge streak={progress.streak.current} />
          </div>
        </div>
      </nav>

      <div className="max-w-[900px] mx-auto px-5 py-6">
        {/* Greeting + Quick Start */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6" style={{ animation: "fadeUp 0.4s ease" }}>
          <div>
            <h1 className="text-[24px] font-extrabold" style={{ letterSpacing: "-0.03em" }}>
              {todaySessions > 0 ? "Welcome back" : "Ready to study"}
            </h1>
            <p className="text-[14px] mt-[2px]" style={{ color: "var(--text-secondary)" }}>
              {daysUntilExam !== null ? `${daysUntilExam} days until your NCLEX` : "Your personalized study dashboard"}
            </p>
          </div>
          <button className="btn btn-p" onClick={() => navigate("/practice")} style={{ padding: "14px 28px", fontSize: 15, whiteSpace: "nowrap" }}>
            <Play size={16} fill="white" /> Start Session
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px] mb-5" style={{ animation: "fadeUp 0.4s ease 0.05s forwards", opacity: 0 }}>
          <div className="nclex-card" style={{ padding: "16px 18px" }}>
            <div className="flex items-center gap-[6px] mb-[6px]">
              <Target size={13} style={{ color: "var(--teal)" }} />
              <span className="text-[11px] font-bold uppercase" style={{ color: "var(--text-tertiary)", letterSpacing: "0.06em" }}>Accuracy</span>
            </div>
            <div className="text-[24px] font-extrabold" style={{ letterSpacing: "-0.02em", color: accuracy >= 70 ? "var(--teal)" : accuracy >= 50 ? "var(--gold)" : "var(--nclex-red)" }}>{accuracy}%</div>
          </div>
          <div className="nclex-card" style={{ padding: "16px 18px" }}>
            <div className="flex items-center gap-[6px] mb-[6px]">
              <BarChart3 size={13} style={{ color: "var(--purple)" }} />
              <span className="text-[11px] font-bold uppercase" style={{ color: "var(--text-tertiary)", letterSpacing: "0.06em" }}>Questions</span>
            </div>
            <div className="text-[24px] font-extrabold" style={{ letterSpacing: "-0.02em" }}>{progress.totalQuestionsAnswered}</div>
          </div>
          <div className="nclex-card" style={{ padding: "16px 18px" }}>
            <div className="flex items-center gap-[6px] mb-[6px]">
              <TrendingUp size={13} style={{ color: "var(--coral)" }} />
              <span className="text-[11px] font-bold uppercase" style={{ color: "var(--text-tertiary)", letterSpacing: "0.06em" }}>Sessions</span>
            </div>
            <div className="text-[24px] font-extrabold" style={{ letterSpacing: "-0.02em" }}>{progress.sessions.length}</div>
          </div>
          <div className="nclex-card" style={{ padding: "16px 18px" }}>
            <div className="flex items-center gap-[6px] mb-[6px]">
              <Award size={13} style={{ color: "var(--gold)" }} />
              <span className="text-[11px] font-bold uppercase" style={{ color: "var(--text-tertiary)", letterSpacing: "0.06em" }}>Best Streak</span>
            </div>
            <div className="text-[24px] font-extrabold" style={{ letterSpacing: "-0.02em" }}>{progress.streak.longest}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-[14px]" style={{ animation: "fadeUp 0.4s ease 0.1s forwards", opacity: 0 }}>
          {/* Left column */}
          <div className="flex flex-col gap-[14px]">
            {/* Daily progress */}
            <div className="nclex-card" style={{ padding: "20px 22px" }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-[15px]">Today's Progress</h3>
                <span className="text-[12px] font-semibold" style={{ color: dailyProgress >= 100 ? "var(--teal)" : "var(--text-tertiary)" }}>
                  {todayQuestions}/{dailyGoal} questions
                </span>
              </div>
              <div className="h-[6px] rounded-full overflow-hidden" style={{ background: "hsl(var(--background-alt))" }}>
                <div className="h-full rounded-full transition-all duration-700" style={{
                  width: `${dailyProgress}%`,
                  background: dailyProgress >= 100 ? "var(--teal)" : "linear-gradient(90deg, hsl(var(--primary)), var(--teal))",
                }} />
              </div>
              {dailyProgress >= 100 && (
                <div className="flex items-center gap-[6px] mt-[10px] text-[12px] font-semibold" style={{ color: "var(--teal)" }}>
                  <Zap size={13} /> Daily goal complete!
                </div>
              )}
            </div>

            {/* Category breakdown */}
            <div className="nclex-card" style={{ padding: "20px 22px" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[15px]">Category Mastery</h3>
                <span className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>
                  {Object.keys(progress.categories).length} categories practiced
                </span>
              </div>
              {Object.keys(progress.categories).length === 0 ? (
                <div className="text-center py-6">
                  <BarChart3 size={28} style={{ color: "var(--text-tertiary)", margin: "0 auto 8px" }} />
                  <p className="text-[13px]" style={{ color: "var(--text-secondary)" }}>Complete your first session to see category breakdown</p>
                </div>
              ) : (
                <div className="flex flex-col gap-[10px]">
                  {Object.entries(progress.categories)
                    .sort((a, b) => getCategoryAccuracy(a[1]) - getCategoryAccuracy(b[1]))
                    .map(([name, stats]) => {
                      const pct = getCategoryAccuracy(stats);
                      const color = catColors[name] || "hsl(var(--primary))";
                      const isWeak = weakest.includes(name);
                      return (
                        <button key={name} className="text-left group" onClick={() => navigate(`/practice?focus=${encodeURIComponent(name)}`)}>
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-[6px]">
                              <span className="text-[13px] font-semibold group-hover:text-primary transition-colors">{name}</span>
                              {isWeak && <span className="text-[9px] font-bold uppercase px-[6px] py-[1px] rounded-full" style={{ background: "var(--red-s)", color: "var(--nclex-red)", letterSpacing: "0.04em" }}>Focus</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[12px] font-semibold" style={{ color }}>{pct}%</span>
                              <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{stats.correct}/{stats.total}</span>
                            </div>
                          </div>
                          <div className="h-[4px] rounded-full overflow-hidden" style={{ background: "hsl(var(--background-alt))" }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color, animation: "growBar 0.8s ease" }} />
                          </div>
                        </button>
                      );
                    })}
                </div>
              )}
            </div>

            {/* Quick practice by subject */}
            <div className="nclex-card" style={{ padding: "20px 22px" }}>
              <h3 className="font-bold text-[15px] mb-3">Quick Practice</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[6px]">
                {SUBJECTS.slice(0, 8).map((s) => (
                  <button
                    key={s.id}
                    className="flex flex-col items-center gap-[6px] rounded-xl transition-all duration-150 hover:scale-[1.02]"
                    style={{ padding: "14px 8px", background: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                    onClick={() => navigate(`/practice?focus=${s.id}`)}
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "hsl(var(--background-alt))", color: s.color }}>
                      <Target size={15} />
                    </div>
                    <span className="text-[11px] font-semibold text-center leading-tight">{s.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-[14px]">
            {/* Readiness score */}
            <div className="nclex-card flex flex-col items-center" style={{ padding: "24px 20px" }}>
              <ReadinessRing score={readiness} />
              <p className="text-[12px] mt-[10px] text-center leading-[1.4]" style={{ color: "var(--text-secondary)" }}>
                {readiness >= 70 ? "Strong foundation — keep building!" : readiness >= 40 ? "Making progress. Focus on weak areas." : "Early stages. Every session counts!"}
              </p>
            </div>

            {/* Weak areas */}
            {weakest.length > 0 && (
              <div className="nclex-card" style={{ padding: "18px 20px" }}>
                <h3 className="font-bold text-[13px] mb-[10px]">Priority Focus</h3>
                <div className="flex flex-col gap-[6px]">
                  {weakest.map((cat) => (
                    <button
                      key={cat}
                      className="flex items-center justify-between rounded-lg transition-all duration-150 hover:bg-background-alt"
                      style={{ padding: "10px 12px", background: "hsl(var(--background))" }}
                      onClick={() => navigate(`/practice?focus=${encodeURIComponent(cat)}`)}
                    >
                      <span className="text-[13px] font-semibold">{cat}</span>
                      <ChevronRight size={14} style={{ color: "var(--text-tertiary)" }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent sessions */}
            <div className="nclex-card" style={{ padding: "18px 20px" }}>
              <h3 className="font-bold text-[13px] mb-[10px]">Recent Sessions</h3>
              {recentSessions.length === 0 ? (
                <p className="text-[12px]" style={{ color: "var(--text-tertiary)" }}>No sessions yet</p>
              ) : (
                <div className="flex flex-col gap-[6px]">
                  {recentSessions.map((s) => (
                    <div key={s.id} className="flex items-center justify-between rounded-lg" style={{ padding: "8px 10px", background: "hsl(var(--background))" }}>
                      <div>
                        <div className="text-[12px] font-semibold">{s.focus === "mixed" ? "Mixed" : s.focus}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-tertiary)" }}>
                          {new Date(s.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {s.answers.length}q
                        </div>
                      </div>
                      <span className="text-[13px] font-bold" style={{ color: s.accuracy >= 70 ? "var(--teal)" : s.accuracy >= 50 ? "var(--gold)" : "var(--nclex-red)" }}>{s.accuracy}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Exam countdown */}
            {daysUntilExam !== null && (
              <div className="nclex-card text-center" style={{ padding: "18px 20px" }}>
                <Calendar size={18} style={{ color: "hsl(var(--primary))", margin: "0 auto 6px" }} />
                <div className="text-[28px] font-extrabold text-primary" style={{ letterSpacing: "-0.03em" }}>{daysUntilExam}</div>
                <div className="text-[11px] font-medium" style={{ color: "var(--text-tertiary)" }}>days until NCLEX</div>
              </div>
            )}
          </div>
        </div>

        {/* Help & Feedback footer */}
        <div className="mt-6 text-center" style={{ animation: "fadeUp 0.4s ease 0.2s forwards", opacity: 0 }}>
          <div className="flex items-center justify-center gap-4 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
            <button className="hover:text-primary transition-colors" onClick={() => navigate("/feedback")}>Send Feedback</button>
            <span>·</span>
            <button className="hover:text-primary transition-colors" onClick={() => navigate("/onboarding")}>Retake Diagnostic</button>
            <span>·</span>
            <button className="hover:text-primary transition-colors" onClick={() => navigate("/")}>Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}
