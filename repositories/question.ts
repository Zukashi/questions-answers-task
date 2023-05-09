import { readFile } from 'node:fs/promises'
import { type Answer, type Question } from '../types/QuestionRepository'
import { UserError } from '../utils/errors'
import { questionDTOSchema } from '../schema/question'
import { writeFile } from 'fs/promises'
import { faker } from '@faker-js/faker'

export const makeQuestionRepository = (fileName: string) => {
  const getQuestions = async (): Promise<Question[]> => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions: Question[] = JSON.parse(fileContent)
    return questions
  }

  const getQuestionById = async (questionId: string): Promise<Question | undefined> => {
    const questions = await getQuestions()
    console.log(questions)
    const question = questions.find((question) => question.id === questionId)
    console.log(333)
    if (question === undefined) throw new UserError('Question not found', 404)
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
    console.log(answers)
    if (answers != null) {
      return answers
    } else {
      throw new UserError('Not found answers of specified question id', 404)
    }
  }
  // const getAnswer = async (questionId: string, answerId: string): Promise<Answer> => {}
  // const addAnswer = async (questionId: string, answer: Answer): Promise<void> => {}

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers
    // getAnswer,
    // addAnswer
  }
}
