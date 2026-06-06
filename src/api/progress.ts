import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse, CourseProgress, DetailedProgress, Enrollment, CheckoutSession } from '@/types'

export const progressApi = {
  list: async () => {
    const res = await apiClient.get<ApiResponse<{ enrollments: CourseProgress[] }>>('/student/enrollments/')
    return res.data.data.enrollments
  },

  detail: async (enrollmentId: string) => {
    const res = await apiClient.get<ApiResponse<DetailedProgress>>(`/student/progress/${enrollmentId}/`)
    return res.data.data
  },

  completeLesson: async (lessonId: number) => {
    const res = await apiClient.post<ApiResponse<{ lesson_id: number; is_completed: boolean }>>(
      `/student/lessons/${lessonId}/complete/`
    )
    return res.data.data
  },
}

export const enrollmentApi = {
  list: async () => {
    const res = await apiClient.get<ApiResponse<{ enrollments: Enrollment[] }>>('/student/enrollments/')
    return res.data.data.enrollments
  },

  create: async (courseSlug: string) => {
    const res = await apiClient.post<ApiResponse<Enrollment>>('/student/enrollments/', { course_slug: courseSlug })
    return res.data.data
  },

  createCheckout: async (courseSlug: string) => {
    const res = await apiClient.post<ApiResponse<CheckoutSession>>('/student/enrollments/checkout/', {
      course_slug: courseSlug,
    })
    return res.data.data
  },
}
