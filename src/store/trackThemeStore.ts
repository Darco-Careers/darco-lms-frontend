import { create } from 'zustand'
import { COURSE_COLORS } from '@/types'
import type { CourseColorTheme } from '@/types'

interface TrackThemeStore {
  /** The active course slug, or null when not in a course context */
  activeSlug: string | null
  /** The resolved theme for the active slug (null = use default white/navy layout) */
  theme: CourseColorTheme | null
  /** Call on mount in any course-context page (LessonPage, CourseDetailPage, etc.) */
  setTrackTheme: (slug: string | null) => void
}

export const useTrackThemeStore = create<TrackThemeStore>((set) => ({
  activeSlug: null,
  theme: null,
  setTrackTheme: (slug) =>
    set({
      activeSlug: slug,
      theme: slug ? (COURSE_COLORS[slug] ?? null) : null,
    }),
}))
