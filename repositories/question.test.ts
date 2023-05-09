import { makeQuestionRepository } from './question'
import { rm, writeFile } from 'fs/promises'
import { faker } from '@faker-js/faker'
import { Question, QuestionRepository } from '../types/QuestionRepository'

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
  const questionWithId1 = testQuestions[0]
  beforeAll(async () => {
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify([]))
    questionRepo = await makeQuestionRepository(TEST_QUESTIONS_FILE_PATH)
  })

  afterAll(async () => {
    await rm(TEST_QUESTIONS_FILE_PATH)
  })

  test('should return a list of 0 questions', async () => {
    expect(await questionRepo.getQuestions()).toHaveLength(0)
  })

  test('should return a list of 2 questions', async () => {
    console.log(testQuestions)
    await writeFile(TEST_QUESTIONS_FILE_PATH, JSON.stringify(testQuestions))

    expect(await questionRepo.getQuestions()).toHaveLength(2)
  })

  test('should return undefined', async () => {
    expect(await questionRepo.getQuestionById('999')).toBeUndefined()
  })

  test('should return a question with an id of 1', async () => {
    expect(await questionRepo.getQuestionById('1')).toMatchObject(questionWithId1)
  })
})
