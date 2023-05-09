import { Request, Response, NextFunction } from 'express';
import { makeQuestionRepository } from '../repositories/question';

export const addQuestionRepoToRequest = (fileName: string) =>
  (req: any, res: Response, next: NextFunction): void => {
    req.repositories = { questionRepo: makeQuestionRepository(fileName) };
    next();
  };