import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse, CourseProgress, DetailedProgress, Enrollment, CheckoutSession } from '@/types'

export const progressApi = {
  list: async () => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<CourseProgress>>>('/progress/')
    return res.data.data.results
  },

  detail: async (courseSlug: string) => {
    const res = await apiClient.get<ApiResponse<DetailedProgress>>(`/progress/${courseSlug}/`)
    return res.data.data
  },

  completeModule: async (moduleId: number) => {
    const res = await apiClient.post<ApiResponse<{ module_id: number; is_completed: boolean }>>(
      `/progress/${moduleId}/complete/`
    )
    return res.data.data
  },
}

export const enrollmentApi = {
  list: async () => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Enrollment>>>('/enrollment/')
    return res.data.data.results
  },

  create: async (courseSlug: string) => {
    const res = await apiClient.post<ApiResponse<Enrollment>>('/enrollment/', { course_slug: courseSlug })
    return res.data.data
  },

  createCheckout: async (courseSlug: string) => {
    const res = await apiClient.post<ApiResponse<CheckoutSession>>('/payments/create-checkout/', {
      course_slug: courseSlug,
    })
    return res.data.data
  },
}

export const freeEnrollmentApi = {
  enroll: async (courseSlug: string) => {
    const res = await apiClient.post<{
      success: boolean
      data: {
        enrollment_id: number
        course_slug: string
        status: 'free_preview' | 'active'
        first_lesson_id: number
        already_enrolled?: boolean
      }
    }>('/v1/student/enrollments/free/', { course_slug: courseSlug })
    return res.data.data
  },
}
