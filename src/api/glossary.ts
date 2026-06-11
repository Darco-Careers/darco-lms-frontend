import { apiClient } from './client'
import type { GlossaryTerm } from '@/types'

export const glossaryApi = {
  list: async (courseSlug: string) => {
    const res = await apiClient.get<{ count: number; terms: GlossaryTerm[] }>(
      `/student/courses/${courseSlug}/glossary/`
    )
    return res.data.terms ?? []
  },

  term: async (courseSlug: string, term: string) => {
    const res = await apiClient.get<{ terms: GlossaryTerm[] }>(
      `/student/courses/${courseSlug}/glossary/?q=${encodeURIComponent(term)}`
    )
    return (res.data.terms ?? [])[0] ?? null
  },
}
