// Persistent localStorage store for user progress, streaks, and session data
import type { UserAnswer } from "@/types";

export interface StudySession {
  id: string;
  date: string; // ISO date
  answers: UserAnswer[];
  elapsed: number; // seconds
  focus: string;
  accuracy: number; // 0-100
}

export interface CategoryStats {
  total: number;
  correct: number;
  confident: number;
  guesses: number;
  lastPracticed: string | null;
}

export interface UserProgress {
  onboarding: {
    completed: boolean;
    focus: string;
    nclexDate: string | null;
    readiness: string | null;
    dailyTime: string | null;
    email: string;
    reminderTime: string;
    studyDays: string[];
  };
  sessions: StudySession[];
  streak: {
    current: number;
    longest: number;
    lastStudyDate: string | null; // ISO date YYYY-MM-DD
  };
  categories: Record<string, CategoryStats>;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  diagnosticScore: number | null;
  bookmarkedQuestions: number[];
  flaggedQuestions: number[]; // questions user flagged for feedback
}

const STORAGE_KEY = "nclex-prep-progress";

const defaultProgress: UserProgress = {
  onboarding: {
    completed: false,
    focus: "mixed",
    nclexDate: null,
    readiness: null,
    dailyTime: null,
    email: "",
    reminderTime: "8:00 AM",
    studyDays: ["Mon", "Tue", "Thu", "Sat"],
  },
  sessions: [],
  streak: { current: 0, longest: 0, lastStudyDate: null },
  categories: {},
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  diagnosticScore: null,
  bookmarkedQuestions: [],
  flaggedQuestions: [],
};

export function loadProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultProgress };
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage full — silently fail
  }
}

export function updateStreak(progress: UserProgress): UserProgress {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (progress.streak.lastStudyDate === today) {
    return progress; // Already counted today
  }

  const isConsecutive = progress.streak.lastStudyDate === yesterday;
  const newCurrent = isConsecutive ? progress.streak.current + 1 : 1;

  return {
    ...progress,
    streak: {
      current: newCurrent,
      longest: Math.max(newCurrent, progress.streak.longest),
      lastStudyDate: today,
    },
  };
}

export function recordSession(
  progress: UserProgress,
  answers: UserAnswer[],
  elapsed: number,
  focus: string
): UserProgress {
  const correct = answers.filter((a) => a.correct).length;
  const accuracy = answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0;

  const session: StudySession = {
    id: `s-${Date.now()}`,
    date: new Date().toISOString(),
    answers,
    elapsed,
    focus,
    accuracy,
  };

  // Update category stats
  const cats = { ...progress.categories };
  answers.forEach((a) => {
    if (!cats[a.cat]) {
      cats[a.cat] = { total: 0, correct: 0, confident: 0, guesses: 0, lastPracticed: null };
    }
    cats[a.cat].total++;
    if (a.correct) cats[a.cat].correct++;
    if (a.confidence === "confident") cats[a.cat].confident++;
    if (a.confidence === "guess") cats[a.cat].guesses++;
    cats[a.cat].lastPracticed = new Date().toISOString().split("T")[0];
  });

  let updated: UserProgress = {
    ...progress,
    sessions: [...progress.sessions, session],
    categories: cats,
    totalQuestionsAnswered: progress.totalQuestionsAnswered + answers.length,
    totalCorrect: progress.totalCorrect + correct,
  };

  updated = updateStreak(updated);
  return updated;
}

export function getCategoryAccuracy(stats: CategoryStats): number {
  if (stats.total === 0) return 0;
  return Math.round((stats.correct / stats.total) * 100);
}

export function getWeakestCategories(cats: Record<string, CategoryStats>, count = 3): string[] {
  return Object.entries(cats)
    .filter(([, s]) => s.total >= 1)
    .sort((a, b) => getCategoryAccuracy(a[1]) - getCategoryAccuracy(b[1]))
    .slice(0, count)
    .map(([name]) => name);
}

export function getOverallAccuracy(progress: UserProgress): number {
  if (progress.totalQuestionsAnswered === 0) return 0;
  return Math.round((progress.totalCorrect / progress.totalQuestionsAnswered) * 100);
}

export function getTodaySessionCount(progress: UserProgress): number {
  const today = new Date().toISOString().split("T")[0];
  return progress.sessions.filter((s) => s.date.startsWith(today)).length;
}

export function getTodayQuestionsCount(progress: UserProgress): number {
  const today = new Date().toISOString().split("T")[0];
  return progress.sessions
    .filter((s) => s.date.startsWith(today))
    .reduce((sum, s) => sum + s.answers.length, 0);
}

export function getDaysUntilExam(progress: UserProgress): number | null {
  const date = progress.onboarding.nclexDate;
  if (!date || date === "none") return null;
  const diff = new Date(date).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

export function getReadinessScore(progress: UserProgress): number {
  // Weighted score: accuracy (40%) + coverage (30%) + confidence (30%)
  const accuracy = getOverallAccuracy(progress) / 100;

  const allCats = ["Pharmacology", "Med-Surg", "Maternal-Newborn", "Pediatrics", "Fundamentals", "Mental Health", "Safety", "Management", "Prioritization"];
  const coveredCats = Object.keys(progress.categories).filter((c) => progress.categories[c].total >= 3).length;
  const coverage = coveredCats / allCats.length;

  const totalConfident = Object.values(progress.categories).reduce((s, c) => s + c.confident, 0);
  const totalAnswered = progress.totalQuestionsAnswered || 1;
  const confidence = totalConfident / totalAnswered;

  return Math.round((accuracy * 0.4 + coverage * 0.3 + confidence * 0.3) * 100);
}
