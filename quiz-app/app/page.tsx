"use client"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Home() {
  const router = useRouter();

  const handleCreateQuiz = () => {
    router.push('/question');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500">
      <h1 className="text-5xl font-bold text-white mb-6">AI Quiz Generator</h1>
      <p className="text-white text-xl mb-8">
        This app helps students prepare by creating quizzes on any topic.
      </p>
      <Button onClick={handleCreateQuiz} className="bg-white text-black px-4 py-2">
        Create a Quiz
      </Button>
    </div>
  );
}
