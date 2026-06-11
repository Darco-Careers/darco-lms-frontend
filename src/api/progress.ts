import { apiClient } from './client'
import type { CourseProgress, DetailedProgress, CheckoutSession } from '@/types'

export const progressApi = {
  list: async (): Promise<CourseProgress[]> => {
    const res = await apiClient.get<{ enrollments: Array<Record<string, unknown>> }>('/student/enrollments/')
    const enrollments = res.data.enrollments ?? []
    return enrollments.map((e) => ({
      course_id: e.course_id as number,
      course_slug: e.course_slug as string,
      course_title: e.course_title as string,
      enrollment_date: e.enrolled_at as string,
      enrollment_id: e.id as string,
      enrollment_status: e.status as string,
      modules_completed: (e.modules_completed as number) ?? 0,
      modules_total: (e.modules_total as number) ?? 0,
      progress_percentage: (e.progress_pct as number) ?? 0,
      is_completed: false,    // not returned by list endpoint; use progress_pct === 100 as proxy
    }))
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

  completeLesson: async (lessonId: string) => {
    const res = await apiClient.post<{ lesson_id: string; completed: boolean; completed_at: string; certificate_issued: boolean }>(
      `/student/lessons/${lessonId}/complete/`
    )
    return res.data
  },
}

export const enrollmentApi = {
  list: async () => {
    const res = await apiClient.get<{ enrollments: Array<Record<string, unknown>> }>('/student/enrollments/')
    return res.data.enrollments ?? []
  },

  create: async (courseSlug: string) => {
    const res = await apiClient.post<Record<string, unknown>>('/student/enrollments/', { course_slug: courseSlug })
    return res.data
  },

  createCheckout: async (courseSlug: string, promoCode?: string) => {
    const res = await apiClient.post<CheckoutSession>('/student/checkout/', {
      course_slug: courseSlug,
      ...(promoCode ? { promo_code: promoCode } : {}),
    })
    return res.data
  },
}

export const cancelPreviewApi = {
  cancel: async (enrollmentId: string) => {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      `/student/enrollments/${enrollmentId}/cancel-preview/`
    )
    return res.data
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
