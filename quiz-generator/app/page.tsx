import FlashcardGenerator from '@/components/FlashcardGenerator'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Flashcard Generator</h1>
      <FlashcardGenerator />
    </main>
  )
}
