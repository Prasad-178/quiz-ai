'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { RotateCw } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Flashcard {
  term: string
  definition: string
}

export default function FlashcardGenerator() {
  const [topic, setTopic] = useState('')
  const [instructions, setInstructions] = useState('')
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(false)
  const [flippedCards, setFlippedCards] = useState<{ [key: number]: boolean }>({})

  const generateFlashcards = async () => {
    setLoading(true)
    try {
      const response = await axios.post('https://deployed-quizapp-production.up.railway.app/create_quiz', { topic, instructions })
      const parsedFlashcards = parseFlashcardData(response.data.questions)
      setFlashcards(parsedFlashcards)
      setFlippedCards({})
    } catch (error) {
      console.error('Error generating flashcards:', error)
    }
    setLoading(false)
  }

  const parseFlashcardData = (rawData: string): Flashcard[] => {
    const jsonStart = rawData.indexOf('{')
    const jsonEnd = rawData.lastIndexOf('}') + 1
    const jsonString = rawData.slice(jsonStart, jsonEnd)
    const parsedData = JSON.parse(jsonString)
    
    const cardRegex = /\*\*\d+\.\*\* \*\*Term:\*\* (.*?)   \*\*Definition:\*\* (.*?)(?=\n\*\*|$)/gs
    const matches = [...parsedData.questions.matchAll(cardRegex)]
    
    return matches.map(match => ({
      term: match[1].trim(),
      definition: match[2].trim()
    }))
  }

  const flipCard = (index: number) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }))
  }

  return (
    <div className="space-y-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Generate Flashcards</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                placeholder="Enter topic for flashcards"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="instructions">Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="Enter any specific instructions"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={generateFlashcards} disabled={loading} className="w-full">
            {loading ? 'Generating...' : 'Generate Flashcards'}
          </Button>
        </CardFooter>
      </Card>
      {flashcards.length > 0 && (
        <div>
          <h3 className="text-2xl font-bold mb-4 text-center">Your Flashcards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {flashcards.map((card, index) => (
              <Card key={index} className="relative">
                <CardContent className="p-6 h-40 flex items-center justify-center text-center">
                  {flippedCards[index] ? (
                    <p className="text-sm">{card.definition}</p>
                  ) : (
                    <h3 className="text-lg font-bold">{card.term}</h3>
                  )}
                </CardContent>
                <CardFooter className="absolute bottom-0 right-0 p-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => flipCard(index)}
                    aria-label="Flip card"
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
