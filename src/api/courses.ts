import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse, Course, Module, Lesson } from '@/types'

export const coursesApi = {
  list: async (page = 1, pageSize = 20) => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Course>>>(
      `/courses/?page=${page}&page_size=${pageSize}`
    )
    return res.data.data
  },

  detail: async (slug: string) => {
    const res = await apiClient.get<ApiResponse<Course>>(`/courses/${slug}/`)
    return res.data.data
  },

  modules: async (slug: string) => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Module>>>(`/courses/${slug}/modules/`)
    return res.data.data.results
  },

  lessons: async (moduleId: number) => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Lesson>>>(`/modules/${moduleId}/lessons/`)
    return res.data.data.results
  },

  lesson: async (lessonId: number) => {
    const res = await apiClient.get<ApiResponse<Lesson>>(`/lessons/${lessonId}/`)
    return res.data.data
  },
}
