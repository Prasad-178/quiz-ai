"use client"
// context/QuizContext.tsx
import React, { createContext, useContext, useState } from 'react';

// Define the type for quiz data
type QuizData = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

// Define the context type
interface QuizContextType {
  quizData: QuizData[];
  setQuizData: (data: QuizData[]) => void;
}

// Create the context
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Create the provider
export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizData, setQuizData] = useState<QuizData[]>([]);

  return (
    <QuizContext.Provider value={{ quizData, setQuizData }}>
      {children}
    </QuizContext.Provider>
  );
};

// Hook to use quiz context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};