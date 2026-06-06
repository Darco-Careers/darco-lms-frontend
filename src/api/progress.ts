import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse, CourseProgress, DetailedProgress, Enrollment, CheckoutSession } from '@/types'

export const progressApi = {
  list: async () => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<CourseProgress>>>('/progress/')
    return res.data.data.results
  },

  detail: async (courseSlug: string): Promise<DetailedProgress> => {
    const res = await apiClient.get<Record<string, unknown>>(`/student/progress/${courseSlug}/`)
    const raw = res.data as Record<string, unknown>
    // Backend returns fields differently from the frontend DetailedProgress type:
    // overall_percent → progress_percentage
    // module_breakdown → modules (with is_completed, quiz_score, lessons)
    // graduation_requirements.met → is_completed
    const breakdown = (raw.module_breakdown as Array<Record<string, unknown>>) ?? []
    const gradReqs = (raw.graduation_requirements as Record<string, unknown>) ?? {}
    return {
      course_slug: courseSlug,
      course_title: (raw.course_title as string) ?? '',
      progress_percentage: (raw.overall_percent as number) ?? 0,
      is_completed: !!(gradReqs.met),
      certificate_url: (raw.certificate as Record<string, unknown>)?.pdf_url as string | null ?? null,
      modules: breakdown.map((m) => {
        const quiz = m.quiz as Record<string, unknown> | null
        return {
          id: m.id as number,
          title: m.title as string,
          is_completed: (m.lessons_completed as number) >= (m.lessons_total as number) && (m.lessons_total as number) > 0,
          quiz_score: quiz?.best_score as number | null ?? null,
          lessons: [],  // not returned by progress endpoint; used for display only
        }
      }),
    }
  },

  completeModule: async (moduleId: string | number) => {
    const res = await apiClient.post<ApiResponse<{ module_id: string | number; is_completed: boolean }>>(
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
        enrollment_id: string
        course_slug: string
        status: 'free_preview' | 'active'
        first_lesson_id: string
        already_enrolled?: boolean
      }
    }>('/student/enrollments/free/', { course_slug: courseSlug })
    return res.data.data
  },
}
