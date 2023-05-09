import express, { json, Request, urlencoded } from 'express'

import { addQuestionRepoToRequest } from './middleware/repositories'
import { type Question, type ReqWithQuestionRepository } from './types/QuestionRepository'
import { handleError } from './utils/errors'
import 'express-async-errors'
const STORAGE_FILE_PATH = 'questions.json'
const PORT = 3000

export const app = express()

app.use(urlencoded({ extended: true }))
app.use(json())
app.use(addQuestionRepoToRequest(STORAGE_FILE_PATH))
app.use(handleError)
app.get('/', (_, res) => {
  res.json({ message: 'Welcome to responder!' })
})

app.get('/questions/:questionId', async (req: ReqWithQuestionRepository, res) => {
  const question = await req.repositories.questionRepo.getQuestionById(req.params.questionId)
  res.json(question)
})

app.get('/questions', async (req: ReqWithQuestionRepository, res) => {
  const questions = await req.repositories.questionRepo.getQuestions()
  res.json(questions)
})

app.post('/questions', async (req: ReqWithQuestionRepository, res) => {
  const question = await req.repositories.questionRepo.addQuestion(req.body)
  res.status(201).json(question)
})

app.get('/questions/:questionId/answers', async (req: ReqWithQuestionRepository, res) => {
  const answers = await req.repositories.questionRepo.getAnswers(req.params.questionId)
  res.json(answers)
})

app.post('/questions/:questionId/answers', async (req: ReqWithQuestionRepository, res) => {
  console.log(3333)
  const answer = await req.repositories.questionRepo.addAnswer(req.params.questionId, req.body)
  res.status(201).json(answer)
})

app.get('/questions/:questionId/answers/:answerId', async (req: ReqWithQuestionRepository, res) => {
  const { questionId, answerId } = req.params
  res.json(await req.repositories.questionRepo.getAnswer(questionId, answerId))
})
app.listen(3000, () => { console.log('server starting on port 3000!') })
