import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse, Course, Module, Lesson } from '@/types'

export const coursesApi = {
  list: async (page = 1, pageSize = 20) => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Course>>>(
      `/student/courses/?page=${page}&page_size=${pageSize}`
    )
    return res.data.data
  },

  detail: async (slug: string): Promise<Course> => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>>>(`/student/courses/${slug}/`)
    const raw = res.data.data as Record<string, unknown>

    // Normalize field names from backend to frontend TypeScript types:
    // - price_cents (backend) → price in dollars (frontend)
    // - modules[].lessons_total (backend) → modules[].lessons_count (frontend)
    const rawModules = (raw.modules as Array<Record<string, unknown>>) ?? []
    const modules: Module[] = rawModules.map((m) => ({
      id: m.id as number,
      title: m.title as string,
      sequence_order: m.sequence_order as number,
      lessons_count: (m.lessons_total ?? m.lessons_count ?? 0) as number,
      is_completed: (m.lessons_completed !== undefined
        ? (m.lessons_completed as number) >= (m.lessons_total as number)
        : false),
      quiz_score: null,
    }))

    return {
      id: raw.id as number,
      slug: raw.slug as string,
      title: raw.title as string,
      description: raw.description as string,
      instructor: (raw.instructor as string) ?? '',
      modules_count: modules.length,
      quiz_count: (raw.quiz_count as number) ?? modules.filter((m) => m.lessons_count > 0).length,
      glossary_terms_count: (raw.glossary_terms_count as number) ?? 0,
      price: Math.round(((raw.price_cents as number) ?? 0) / 100),
      is_enrolled: !!(raw.enrollment),
      modules,
    }
  },

  modules: async (slug: string): Promise<Module[]> => {
    const res = await apiClient.get<Record<string, unknown>>(`/student/courses/${slug}/modules/`)
    const raw = res.data as Record<string, unknown>
    // Backend returns {modules: [...]} not the standard {data: {results: [...]}}
    const rawModules = (raw.modules ?? (raw.data as Record<string, unknown>)?.results ?? []) as Array<Record<string, unknown>>
    return rawModules.map((m) => {
      const rawLessons = (m.lessons as Array<Record<string, unknown>>) ?? []
      return {
        id: m.id as number,
        title: m.title as string,
        sequence_order: m.sequence_order as number,
        lessons_count: rawLessons.length ?? (m.lessons_total as number) ?? (m.lessons_count as number) ?? 0,
        is_completed: !!(m.quiz_passed),
        quiz_score: (m.quiz_passed ? 100 : null) as number | null,
        lessons: rawLessons.map((l) => ({
          id: l.id as string,
          title: l.title as string,
          sequence_order: l.sequence_order as number,
          is_completed: !!(l.completed),
        })),
      }
    })
  },

  lessons: async (moduleId: number) => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<Lesson>>>(`/student/modules/${moduleId}/lessons/`)
    return res.data.data.results
  },

  lesson: async (lessonId: string | number): Promise<Lesson> => {
    const res = await apiClient.get<Record<string, unknown>>(`/student/lessons/${lessonId}/`)
    const raw = res.data
    // Normalize backend response shape to frontend Lesson type
    const nav = (raw.navigation as Record<string, unknown>) ?? {}
    const prevNav = nav.prev as Record<string, unknown> | null
    const nextNav = nav.next as Record<string, unknown> | null
    const moduleObj = raw.module as Record<string, unknown> | null
    const progress = (raw.progress as Record<string, unknown>) ?? {}
    return {
      id: raw.id as string,
      title: raw.title as string,
      sequence_order: raw.sequence_order as number,
      content_type: ((raw.content_type as string) ?? 'markdown') as 'markdown' | 'html' | 'video' | 'pdf',
      body: (raw.body as string) ?? '',
      youtube_url: (raw.youtube_url as string | null) ?? null,
      module_id: moduleObj ? (moduleObj.id as string) : (raw.module_id as string),
      module_title: moduleObj ? (moduleObj.title as string) : null,
      is_completed: !!(progress.completed ?? raw.is_completed),
      prev_lesson_id: prevNav ? (prevNav.id as string) : (raw.prev_lesson_id as string | null) ?? null,
      next_lesson_id: nextNav ? (nextNav.id as string) : (raw.next_lesson_id as string | null) ?? null,
      quiz_id: (nav.quiz_id as string | null) ?? (raw.quiz_id as string | null) ?? null,
      next_module_lesson_id: (() => {
        const nml = nav.next_module_lesson as Record<string, unknown> | null
        return nml ? (nml.id as string) : null
      })(),
      lesson_position: (raw.lesson_position as number | null) ?? null,
      lesson_total: (raw.lesson_total as number | null) ?? null,
    }
  },
}
