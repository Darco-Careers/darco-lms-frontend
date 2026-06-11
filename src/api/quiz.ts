import { apiClient } from './client'
import type { Quiz, QuizResult, QuizSubmission } from '@/types'

export const quizApi = {
  /**
   * GET /student/quizzes/<uuid>/
   * Returns quiz questions (without correct answers) and attempt history.
   */
  get: async (quizId: string): Promise<Quiz> => {
    const res = await apiClient.get<Quiz>(`/student/quizzes/${quizId}/`)
    return res.data
  },

  /**
   * POST /student/quizzes/<uuid>/attempt/
   * Body: { answers: { "<question_id>": "<answer_id>", ... } }
   * Returns score, passed, correct_answers, etc.
   */
  submit: async (quizId: string, submission: QuizSubmission): Promise<QuizResult> => {
    const res = await apiClient.post<QuizResult>(`/student/quizzes/${quizId}/attempt/`, submission)
    return res.data
  },
}
