import { readFile } from 'node:fs/promises'
import { type Answer, type Question } from '../types/QuestionRepository'

export const makeQuestionRepository = async (fileName: string) => {
  const getQuestions = async (): Promise<Question[]> => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions: Question[] = JSON.parse(fileContent)
    return questions
  }

  const getQuestionById = async (questionId: string): Promise<Question | undefined> => {
    const questions = await getQuestions()
    return questions.find((question) => question.id === questionId)
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

module.exports = { makeQuestionRepository }
