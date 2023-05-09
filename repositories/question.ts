import { readFile } from 'node:fs/promises';

export const makeQuestionRepository = (fileName:string) => {
  const getQuestions = async () => {
    const fileContent = await readFile(fileName, { encoding: 'utf-8' })
    const questions = JSON.parse(fileContent)

    return questions
  }

  const getQuestionById = async (questionId:string) => {}
  const addQuestion = async (question:any) => {}
  const getAnswers = async (questionId:any) => {}
  const getAnswer = async (questionId:string, answerId:string) => {}
  const addAnswer = async (questionId:string, answer:any) => {}

  return {
    getQuestions,
    getQuestionById,
    addQuestion,
    getAnswers,
    getAnswer,
    addAnswer
  }
}

module.exports = { makeQuestionRepository }
