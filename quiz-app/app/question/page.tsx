"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuiz } from "@/app/context/QuizContext"; // Import the useQuiz hook
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CreateQuiz() {
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const { setQuizData } = useQuiz(); // Get setQuizData from context
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const parseQuizData = (data: any) => {
    // Split the data into individual questions based on the '**' delimiter
    const questionsArray: { question: any; options: any; answer: any; explanation: any; }[] = [];
    const questionsRaw = data.questions.split("\n**Question");

    questionsRaw.slice(1).forEach((rawQuestion: string) => {
      const lines = rawQuestion.split("\n");
      const question = lines[0].trim(); // The question text is on the first line

      // Extract options (skip the empty lines and those containing 'Answer' or 'Explanation')
      const options = lines.slice(1, 6).map((line) => line.trim());

      // Extract the answer and explanation
      const answer = lines
        .find((line) => line.includes("**Answer:"))
        ?.replace("**Answer:**", "")
        .trim();
      const explanation = lines
        .find((line) => line.includes("**Explanation:"))
        ?.replace("**Explanation:**", "")
        .trim();

      questionsArray.push({
        question,
        options,
        answer,
        explanation,
      });
    });

    return questionsArray;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/create_quiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, notes }),
      });

      const data = await response.json();
      console.log(data);

      // Parse the string response into an array of questions
      const parsedQuizData = parseQuizData(data);

      // Ensure we set quizData only if it's an array
      if (Array.isArray(parsedQuizData)) {
        setQuizData(parsedQuizData);
        router.push("/quiz");
      } else {
        console.error("Parsed data is not an array:", parsedQuizData);
      }
    } catch (error) {
      console.error("Error fetching quiz data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 space-y-6 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800">Create Your Quiz</h2>
        <Input
          placeholder="Enter the topic (e.g., Chemistry)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="border border-gray-300 p-3 rounded-md w-full focus:border-blue-500"
        />
        <Input
          placeholder="Add notes (e.g., 11th grade chemistry)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border border-gray-300 p-3 rounded-md w-full focus:border-blue-500"
        />
        <Button
          onClick={handleSubmit}
          className={`w-full py-3 text-white font-semibold rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Quiz"}
        </Button>
      </div>
    </div>
  );
}
