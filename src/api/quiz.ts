import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse, Quiz, QuizResult, QuizAttempt, QuizSubmission } from '@/types'

export const quizApi = {
  get: async (moduleId: number) => {
    const res = await apiClient.get<ApiResponse<Quiz>>(`/modules/${moduleId}/quiz/`)
    return res.data.data
  },

  submit: async (quizId: number, submission: QuizSubmission) => {
    const res = await apiClient.post<ApiResponse<QuizResult>>(`/quiz/${quizId}/submit/`, submission)
    return res.data.data
  },

  attempts: async (quizId: number) => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<QuizAttempt>>>(`/quiz/${quizId}/attempts/`)
    return res.data.data.results
  },
}
