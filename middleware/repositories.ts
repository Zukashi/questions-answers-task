import { Response, NextFunction } from 'express'
import { makeQuestionRepository } from '../repositories/question'
import { ReqWithQuestionRepository } from '../types/QuestionRepository'

export const addQuestionRepoToRequest = (fileName: string) =>
  (req: ReqWithQuestionRepository, res: Response, next: NextFunction): void => {
    req.repositories = { questionRepo: makeQuestionRepository(fileName) }
    next()
  }
