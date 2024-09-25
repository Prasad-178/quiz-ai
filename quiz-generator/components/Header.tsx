import { FC } from 'react'
import { Card, CardContent } from '@/components/ui/card'

const Header: FC = () => {
  return (
    <Card className="rounded-none bg-gradient-to-r from-purple-600 to-blue-600">
      <CardContent className="p-6">
        <h1 className="text-4xl font-bold text-center text-white">AI in a FLASH</h1>
        <p className="text-xl text-center mt-2 text-white opacity-80">Generate flashcards instantly with AI</p>
      </CardContent>
    </Card>
  )
}

export default Header
