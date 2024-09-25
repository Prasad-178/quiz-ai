"use client";
import { useQuiz } from "@/app/context/QuizContext"; // Import the useQuiz hook
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const QuizPage = () => {
  const { quizData } = useQuiz(); // Get quiz data from context
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: string;
  }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleOptionChange = (questionIndex: number, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: option }));
  };

  const handleSubmit = () => {
    let totalScore = 0;

    quizData.forEach((question: any, index: number) => {
      if (selectedAnswers[index] === question.answer) {
        totalScore += 1;
      }
    });

    setScore(totalScore);
    setSubmitted(true);
  };

  if (!Array.isArray(quizData) || quizData.length === 0) {
    return (
      <p className="text-center text-xl text-gray-600">
        No quiz data available. Please create a quiz first.
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Quiz
      </h1>

      {quizData.map((question, index) => (
        <Card key={index} className="mb-6 bg-white shadow-md rounded-lg p-6">
          <h3 className="font-semibold text-xl text-gray-800 mb-4">
            {index + 1}. {question.question}
          </h3>
          <div className="flex flex-col">
            {question.options.map((option: string, optIndex: number) => {
                console.log(option)
                return (
              <label key={optIndex} className="block mb-3 text-gray-700">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  onChange={() => handleOptionChange(index, option)}
                  disabled={submitted}
                  className="mr-2"
                />
                <span>{option}</span>
              </label>
            )})}
          </div>

          {/* Show correct answer and explanation only after submission */}
          {submitted && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-300">
              <p
                className={`font-medium ${
                  selectedAnswers[index] === question.answer
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {selectedAnswers[index] === question.answer
                  ? "Correct!"
                  : "Incorrect!"}
              </p>
              <p className="text-gray-700">
                <strong>Correct Answer:</strong> {question.answer}
              </p>
              <p className="text-gray-600">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            </div>
          )}
        </Card>
      ))}

      {/* Submit button */}
      {!submitted && (
        <Button
          onClick={handleSubmit}
          className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          Submit Quiz
        </Button>
      )}

      {/* Show final score */}
      {submitted && (
        <div className="mt-10 text-center">
          <p className="text-2xl font-bold text-green-600">
            You scored: {score} out of {quizData.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizPage;
