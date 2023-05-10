import { readFile } from 'node:fs/promises'
import { type Answer, type Question } from '../types/QuestionRepository'
import { UserError } from '../utils/errors'
import { answerDTOSchema, questionDTOSchema } from '../schema/question'
import { writeFile } from 'fs/promises'
import { faker } from '@faker-js/faker'
import { ZodError } from 'zod'

export const makeQuestionRepository = (fileName: string) => {
  const getQuestions = async (): Promise<Question[]> => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions: Question[] = JSON.parse(fileContent)
    return questions
  }

  const getQuestionById = async (questionId: string): Promise<Question | undefined> => {
    const questions = await getQuestions()
    const question = questions.find((question) => question.id === questionId)
    if (question == null) throw new UserError('Question not found', 404)
    return question
  }
  const addQuestion = async (question: Omit<Question, 'id'>): Promise<Omit<Question, 'id'>> => {
    try {
      questionDTOSchema.parse(question)

      const newQuestion = {
        id: faker.datatype.uuid(),
        ...question
      }
      const allQuestions = await getQuestions()
      allQuestions.push(newQuestion)

      await writeFile(fileName, JSON.stringify(allQuestions))

      // extract id of new question from newQuestion
      const { id: placeholder, ...newQuestionWithoutId } = newQuestion
      return newQuestionWithoutId
    } catch (e) {
      throw new UserError('Invalid dto data provided', 400)
    }
  }
  const getAnswers = async (questionId: string): Promise<Answer[]> => {
    const answers = (await getQuestionById(questionId))?.answers
    if (answers != null) {
      return answers
    } else {
      throw new UserError('Not found answers of specified question id', 404)
    }
  }
  const getAnswer = async (questionId: string, answerId: string): Promise<Answer> => {
    const question = await getQuestionById(questionId)
    if (question == null) {
      throw new UserError('Not found question', 404)
    }
    const answer = question.answers?.find((answer) => answer.id === answerId)
    if (answer != null) {
      return answer
    } else {
      throw new UserError('Not found answer', 404)
    }
  }
  const addAnswer = async (questionId: string, answer: Omit<Answer, 'id'>): Promise<Omit<Answer, 'id'>> => {
    try {
      await answerDTOSchema.parseAsync(answer)
      const questions = await getQuestions()
      const question = await getQuestionById(questionId)
      if (!Array.isArray(question?.answers) || (question == null)) throw new UserError('Not found answers of specified question', 404)
      const newAnswer = {
        ...answer,
        id: faker.datatype.uuid()
      }
      const filteredQuestions = questions.filter((question) => questionId !== question.id)

      question.answers.push(newAnswer)
      filteredQuestions.push(question)
      await writeFile(fileName, JSON.stringify(filteredQuestions))

      const { id: placeholder, ...newAnswerWithoutId } = newAnswer
      return newAnswerWithoutId
    } catch (e) {
      if (!(e instanceof ZodError)) throw new UserError('incorrect question id provided', 404)
      throw new UserError('answerDTO doesnt match', 400)
    }
  }

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}
