import { readFile } from 'node:fs/promises'
import { type Answer, type Question } from '../types/QuestionRepository'
import { UserError } from '../utils/errors'

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
    if (question === undefined) throw new UserError('Question not found', 404)

    return question
  }
  // const addQuestion = async (question: Question): Promise<void> => {}
  // const getAnswers = async (questionId: string): Promise<Answer[]> => {}
  // const getAnswer = async (questionId: string, answerId: string): Promise<Answer> => {}
  // const addAnswer = async (questionId: string, answer: Answer): Promise<void> => {}

  return {
    getQuestions,
    getQuestionById
    // addQuestion,
    // getAnswers,
    // getAnswer,
    // addAnswer
  }
}
