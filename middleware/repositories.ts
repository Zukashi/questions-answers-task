import { type Response, type NextFunction, type Request } from 'express'
import { makeQuestionRepository } from '../repositories/question'
import { type AddQuestionRepoMiddleware, ReqWithQuestionRepository } from '../types/QuestionRepository'

export const addQuestionRepoToRequest = (fileName: string) =>
  (req: ReqWithQuestionRepository, res: Response, next: NextFunction): void => {
    req.repositories = { questionRepo: makeQuestionRepository(fileName) }
    next()
  }
