export type ExamType = "RN" | "PN";

export type ConfidenceLevel = "not_sure" | "somewhat_sure" | "very_sure";

export type SelfAssessment = "just_starting" | "some_foundation" | "fairly_confident" | "almost_ready";

export type NCLEXCategory =
  | "pharmacology"
  | "medical_surgical"
  | "maternal_newborn"
  | "pediatrics"
  | "mental_health"
  | "fundamentals"
  | "safety_infection_control"
  | "management_leadership";

export const CATEGORY_LABELS: Record<NCLEXCategory, string> = {
  pharmacology: "Pharmacology",
  medical_surgical: "Medical-Surgical",
  maternal_newborn: "Maternal-Newborn",
  pediatrics: "Pediatrics",
  mental_health: "Mental Health",
  fundamentals: "Fundamentals",
  safety_infection_control: "Safety & Infection Control",
  management_leadership: "Management & Leadership",
};

export interface Question {
  id: string;
  stem: string;
  choices: { label: string; text: string }[];
  correctAnswer: string;
  rationale: string;
  whyWrong: Record<string, string>;
  keyTakeaway: string;
  category: NCLEXCategory;
  difficulty: "easy" | "medium" | "hard";
}

export interface DiagnosticAnswer {
  questionId: string;
  selectedAnswer: string;
  confidence: ConfidenceLevel;
  isCorrect: boolean;
  timeSpentMs: number;
}

export interface DiagnosticResult {
  answers: DiagnosticAnswer[];
  accuracy: number;
  avgTimePerQuestion: number;
  categoryBreakdown: Record<NCLEXCategory, { correct: number; total: number }>;
  weakestCategories: NCLEXCategory[];
  strongestCategories: NCLEXCategory[];
}

export interface OnboardingProfile {
  examType: ExamType | null;
  targetDate: string | null;
  studyDaysPerWeek: number | null;
  studyMinutesPerDay: number | null;
  selfAssessment: SelfAssessment | null;
  diagnosticResult: DiagnosticResult | null;
}

export interface StudyPlan {
  totalWeeks: number;
  sessionsPerWeek: number;
  questionsPerDay: number;
  focusAreas: NCLEXCategory[];
  dailyTimeMinutes: number;
}
