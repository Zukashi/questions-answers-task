import { makeQuestionRepository } from './question'
import { rm, writeFile } from 'fs/promises'
import { Question, QuestionRepository } from '../types/QuestionRepository'
import request from 'supertest'
import { app } from '../index'

describe('question repository', () => {
  const TEST_QUESTIONS_FILE_PATH = 'test-questions.json'
  let questionRepo: QuestionRepository
  const testQuestions: Question[] = [
    {
      id: '1',
      summary: 'Who are you?',
      author: 'Tim Doods',
      answers: []
    },
    {
      id: '2',
      summary: 'Test question?',
      author: 'Test User',
      answers: []
    }
  ]

  const questionWithIdOf1 = testQuestions[0]
  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))
    questionRepo = makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  describe('GET questions', function () {
    test('should return a list of 0 questions', async () => {
      expect(await questionRepo.getQuestions()).toHaveLength(0)
    })

    test('should return a list of 2 questions', async () => {
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

      expect(await questionRepo.getQuestions()).toHaveLength(2)
    })
  })

  describe('GET question', () => {
    test('should throw error', async () => {
      await expect(async () => await questionRepo.getQuestionById('999')).rejects.toThrow('Question not found')
    })

    test('should return a question with an id of 1', async () => {
      expect(await questionRepo.getQuestionById('1')).toMatchObject(questionWithIdOf1)
    })
  })

  describe('POST question', () => {
    test('should throw error with status code of 400', async () => {
      const testQuestion = {
        author: 'Test',
        summary: 3,
        answers: []
      }
      const response = await request(app).post('/questions').send(testQuestion)
      expect(response.statusCode).toBe(400)
    })

    test('should return status code 201 and be defined and match object provided from req', async () => {
      const testQuestion = {
        author: 'Test',
        summary: 'test summary',
        answers: []
      }
      const response = await request(app).post('/questions').send(testQuestion)
      expect(response.statusCode).toBe(201)
      expect(response.body).toBeDefined()
      expect(response.body).toMatchObject(testQuestion)
    })
  })
})
