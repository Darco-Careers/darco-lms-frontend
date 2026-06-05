import { apiClient } from './client'
import type { ApiResponse, PaginatedResponse, GlossaryTerm } from '@/types'

export const glossaryApi = {
  list: async (courseSlug: string) => {
    const res = await apiClient.get<ApiResponse<PaginatedResponse<GlossaryTerm>>>(`/glossary/${courseSlug}/`)
    return res.data.data.results
  },

  term: async (courseSlug: string, term: string) => {
    const res = await apiClient.get<ApiResponse<GlossaryTerm>>(`/glossary/${courseSlug}/${encodeURIComponent(term)}/`)
    return res.data.data
  },
}
