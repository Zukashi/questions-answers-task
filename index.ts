import express, { json, Request, urlencoded } from 'express'

import { addQuestionRepoToRequest } from './middleware/repositories'
import { type Question, type ReqWithQuestionRepository } from './types/QuestionRepository'

const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

export const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(addQuestionRepoToRequest(STORAGE_FILE_PATH))

app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions', async (req: ReqWithQuestionRepository, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.get('/questions/:questionId', async (req: ReqWithQuestionRepository, res) => {
  // const question = await req.repositories.questionRepo.getOneQuestion(req.params.questionId)
  // res.json(question)
})

app.post('/questions', (req, res) => {})

app.get('/questions/:questionId/answers', (req, res) => {})

app.post('/questions/:questionId/answers', (req, res) => {})

app.get('/questions/:questionId/answers/:answerId', (req, res) => {})

app.listen(PORT, () => {
  console.log(`Responder app listening on port ${PORT}`)
})
