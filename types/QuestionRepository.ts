import { Request } from 'express'

interface QuestionRepository {
  getQuestions: () => Promise<Question[]>
  getQuestionById: (questionId: string) => Promise<Question | undefined>
  addQuestion: (question: Omit<Question, 'id'>) => Promise<Omit<Question, 'id'>>
  getAnswers: (questionId: string) => Promise<Answer[]>
  getAnswer: (questionId: string, answerId: string) => Promise<Answer>
  // addAnswer: (questionId: string, answer: Answer) => Promise<void>
}

interface Question {
  id: string
  author: string
  summary: string
  answers: Answer[]
}

type Answer = Omit<Question, 'answers'>

interface ReqWithQuestionRepository extends Request {
  repositories: {
    questionRepo: QuestionRepository
  }
}

export type { ReqWithQuestionRepository, Answer, Question, QuestionRepository }
