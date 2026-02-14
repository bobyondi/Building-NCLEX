"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { OnboardingProfile, DiagnosticAnswer, DiagnosticResult, Question } from "@/types";
import { calculateDiagnosticResult } from "@/lib/utils";

interface AppState {
  profile: OnboardingProfile;
  diagnosticAnswers: DiagnosticAnswer[];
  diagnosticQuestions: Question[];
  currentQuestionIndex: number;
  setProfile: (updates: Partial<OnboardingProfile>) => void;
  addDiagnosticAnswer: (answer: DiagnosticAnswer) => void;
  setDiagnosticQuestions: (questions: Question[]) => void;
  nextQuestion: () => void;
  finishDiagnostic: () => DiagnosticResult;
  resetDiagnostic: () => void;
}

const defaultProfile: OnboardingProfile = {
  examType: null,
  targetDate: null,
  studyDaysPerWeek: null,
  studyMinutesPerDay: null,
  selfAssessment: null,
  diagnosticResult: null,
};

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<OnboardingProfile>(defaultProfile);
  const [diagnosticAnswers, setDiagnosticAnswers] = useState<DiagnosticAnswer[]>([]);
  const [diagnosticQuestions, setDiagnosticQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const setProfile = useCallback((updates: Partial<OnboardingProfile>) => {
    setProfileState((prev) => ({ ...prev, ...updates }));
  }, []);

  const addDiagnosticAnswer = useCallback((answer: DiagnosticAnswer) => {
    setDiagnosticAnswers((prev) => [...prev, answer]);
  }, []);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prev) => prev + 1);
  }, []);

  const finishDiagnostic = useCallback(() => {
    const result = calculateDiagnosticResult(diagnosticAnswers, diagnosticQuestions);
    setProfileState((prev) => ({ ...prev, diagnosticResult: result }));
    return result;
  }, [diagnosticAnswers, diagnosticQuestions]);

  const resetDiagnostic = useCallback(() => {
    setDiagnosticAnswers([]);
    setCurrentQuestionIndex(0);
    setDiagnosticQuestions([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        profile,
        diagnosticAnswers,
        diagnosticQuestions,
        currentQuestionIndex,
        setProfile,
        addDiagnosticAnswer,
        setDiagnosticQuestions,
        nextQuestion,
        finishDiagnostic,
        resetDiagnostic,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
