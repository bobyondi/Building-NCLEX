import { NCLEXCategory, OnboardingProfile, StudyPlan, Question, DiagnosticAnswer, DiagnosticResult } from "@/types";

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function pickRandomQuestions(questions: Question[], count: number): Question[] {
  const shuffled = shuffleArray(questions);
  const categories = new Set<NCLEXCategory>();
  const selected: Question[] = [];

  // First pass: try to get diverse categories
  for (const q of shuffled) {
    if (selected.length >= count) break;
    if (!categories.has(q.category)) {
      categories.add(q.category);
      selected.push(q);
    }
  }

  // Fill remaining from shuffled pool
  for (const q of shuffled) {
    if (selected.length >= count) break;
    if (!selected.includes(q)) {
      selected.push(q);
    }
  }

  return shuffleArray(selected);
}

export function calculateDiagnosticResult(
  answers: DiagnosticAnswer[],
  questions: Question[]
): DiagnosticResult {
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  const categoryBreakdown: Record<NCLEXCategory, { correct: number; total: number }> = {
    pharmacology: { correct: 0, total: 0 },
    medical_surgical: { correct: 0, total: 0 },
    maternal_newborn: { correct: 0, total: 0 },
    pediatrics: { correct: 0, total: 0 },
    mental_health: { correct: 0, total: 0 },
    fundamentals: { correct: 0, total: 0 },
    safety_infection_control: { correct: 0, total: 0 },
    management_leadership: { correct: 0, total: 0 },
  };

  let totalCorrect = 0;
  let totalTime = 0;

  for (const answer of answers) {
    const question = questionMap.get(answer.questionId);
    if (!question) continue;

    categoryBreakdown[question.category].total += 1;
    if (answer.isCorrect) {
      categoryBreakdown[question.category].correct += 1;
      totalCorrect += 1;
    }
    totalTime += answer.timeSpentMs;
  }

  const categoriesWithQuestions = (Object.entries(categoryBreakdown) as [NCLEXCategory, { correct: number; total: number }][])
    .filter(([, data]) => data.total > 0);

  const sorted = categoriesWithQuestions.sort(
    ([, a], [, b]) => a.correct / a.total - b.correct / b.total
  );

  const weakestCategories = sorted.slice(0, 3).map(([cat]) => cat);
  const strongestCategories = sorted
    .reverse()
    .slice(0, 2)
    .map(([cat]) => cat);

  return {
    answers,
    accuracy: answers.length > 0 ? totalCorrect / answers.length : 0,
    avgTimePerQuestion: answers.length > 0 ? totalTime / answers.length : 0,
    categoryBreakdown,
    weakestCategories,
    strongestCategories,
  };
}

export function generateStudyPlan(profile: OnboardingProfile): StudyPlan {
  const now = new Date();
  const target = profile.targetDate ? new Date(profile.targetDate) : new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000);
  const daysUntilExam = Math.max(7, Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const totalWeeks = Math.max(1, Math.ceil(daysUntilExam / 7));

  const sessionsPerWeek = profile.studyDaysPerWeek || 5;
  const dailyTimeMinutes = profile.studyMinutesPerDay || 45;

  // ~2 minutes per question including review
  const questionsPerDay = Math.max(5, Math.floor(dailyTimeMinutes / 2));

  const focusAreas = profile.diagnosticResult?.weakestCategories || [
    "pharmacology",
    "medical_surgical",
    "safety_infection_control",
  ];

  return {
    totalWeeks,
    sessionsPerWeek,
    questionsPerDay,
    focusAreas: focusAreas as NCLEXCategory[],
    dailyTimeMinutes,
  };
}
