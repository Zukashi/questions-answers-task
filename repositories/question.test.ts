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
      answers: [{ id: 'ce7bddfb-0544-4b14-92d8-188b03c41ee4', author: 'Brian McKenzie', summary: 'The Earth is flat.' }, { id: '2', author: 'Dr Strange', summary: 'It is egg-shaped.' }]
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

  describe('GET question/answers', () => {
    test('should throw error with status code of 404', async () => {
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
      const response = await request(app).get('/questions/999999/answers')
      expect(response.statusCode).toBe(404)
    })

    test('should return an array of answers to specified id of question', async () => {
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
      const answers = (await questionRepo.getAnswers('1'))
      expect(answers).toHaveLength(2)
    })
  })

  describe('GET question/answer', () => {
    test('should throw error with status code of 404', async () => {
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
      const response = await request(app).get('/questions/1/answers/21301223523143453425234DSASDXCZ')
      expect(response.statusCode).toBe(404)
    })

    test('should return an answer for specified id of question', async () => {
      await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))
      const answer = (await questionRepo.getAnswer('1', '2'))
      console.log(answer)
      expect(answer).toMatchObject({ id: '2', author: 'Dr Strange', summary: 'It is egg-shaped.' })
      expect(answer).not.toMatchObject({ id: '1', author: 3, summary: 'It is egg-shaped.' })
    })
  })
})
