import { z } from 'zod'

export const questionDTOSchema = z.object({

  author: z.string(),
  summary: z.string(),
  answers: z.array(z.object({
    id: z.string(),
    summary: z.string(),
    author: z.string()
  }))
}).strict()

export const answerDTOSchema = z.object({
  summary: z.string(),
  author: z.string()
}).strict()
