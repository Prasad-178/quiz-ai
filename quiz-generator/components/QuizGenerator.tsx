'use client'

import { useState } from 'react'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'

interface Question {
  question: string
  options: { [key: string]: string }
  answer: string
  explanation: string
}

export default function QuizGenerator() {
  const [topic, setTopic] = useState('')
  const [quizData, setQuizData] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({})
  const [score, setScore] = useState<number | null>(null)
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const generateQuiz = async () => {
    setLoading(true)
    try {
      const response = await axios.post('http://localhost:8000/create_quiz', { topic })
      const parsedQuestions = parseQuizData(response.data.questions)
      setQuizData(parsedQuestions)
      setUserAnswers({})
      setScore(null)
      setQuizSubmitted(false)
    } catch (error) {
      console.error('Error generating quiz:', error)
    }
    setLoading(false)
  }

  const parseQuizData = (rawData: string): Question[] => {
    const questions = rawData.split('\n\n').filter(q => q.startsWith('**'))
    return questions.map(q => {
      const lines = q.split('\n')
      const question = lines[0].replace(/^\*\*|\*\*$/g, '')
      const options: { [key: string]: string } = {}
      lines.slice(1, 5).forEach(o => {
        const [key, value] = o.split(') ')
        options[key.trim()] = value.trim()
      })
      const answerLine = lines.find(l => l.startsWith('**Answer:**'))
      const answer = answerLine ? answerLine.split('**Answer:**')[1].trim() : ''
      const explanationLine = lines.find(l => l.startsWith('**Explanation:**'))
      const explanation = explanationLine ? explanationLine.split('**Explanation:**')[1].trim() : ''
      return { question, options, answer, explanation }
    })
  }

  const handleAnswerChange = (questionIndex: number, value: string) => {
    setUserAnswers(prev => ({ ...prev, [questionIndex]: value }))
  }

  const submitQuiz = () => {
    let correctAnswers = 0
    quizData.forEach((q, index) => {
      if (userAnswers[index] === q.answer) correctAnswers++
    })
    setScore((correctAnswers / quizData.length) * 100)
    setQuizSubmitted(true)
  }

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter topic and specific instructions"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="min-h-[100px]"
      />
      <Button onClick={generateQuiz} disabled={loading}>
        {loading ? 'Generating...' : 'Generate Quiz'}
      </Button>
      {quizData.length > 0 && (
        <div className="space-y-4">
          {quizData.map((q, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{q.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  onValueChange={(value) => handleAnswerChange(index, value)}
                  value={userAnswers[index]}
                >
                  {Object.entries(q.options).map(([key, value]) => (
                    <div className="flex items-center space-x-2" key={key}>
                      <RadioGroupItem value={key} id={`q${index}o${key}`} />
                      <Label htmlFor={`q${index}o${key}`}>{value}</Label>
                    </div>
                  ))}
                </RadioGroup>
                {quizSubmitted && (
                  <div className="mt-4">
                    <p className="font-semibold">Correct Answer: {q.answer}</p>
                    <p>{q.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          <Button onClick={submitQuiz} disabled={Object.keys(userAnswers).length !== quizData.length || quizSubmitted}>
            Submit Quiz
          </Button>
          {score !== null && (
            <Card>
              <CardContent className="pt-4">
                <p className="text-xl font-bold">Your Score: {score.toFixed(2)}%</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
