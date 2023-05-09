import { NextFunction, Request, Response } from 'express'

interface QuestionRepository {
  getQuestions: () => Promise<Question[]>
  // getQuestionById: (questionId: string) => Promise<Question>
  // addQuestion: (question: Question) => Promise<void>
  // getAnswers: (questionId: string) => Promise<Answer[]>
  // getAnswer: (questionId: string, answerId: string) => Promise<Answer>
  // addAnswer: (questionId: string, answer: Answer) => Promise<void>
}

interface Question {
  id: string
  author: string
  summary: string
  answers: Answer[]
}
 type Answer = Omit<Question, 'answers' >

interface ReqWithQuestionRepository extends Request {
  repositories: {
    questionRepo: QuestionRepository
  }
}
type AddQuestionRepoMiddleware = (
  fileName: string
) => (req: ReqWithQuestionRepository, res: Response, next: NextFunction) => void

export type { AddQuestionRepoMiddleware, ReqWithQuestionRepository, Answer, Question, QuestionRepository }
