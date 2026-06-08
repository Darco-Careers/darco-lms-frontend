/**
 * DARCO Academy — Promo Code API Client
 * Admin endpoints for managing promo codes.
 * Student endpoint for validating a promo code at checkout.
 */

import { apiClient } from './client'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PromoCode {
  id: string
  code: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  course: string | null
  course_slug: string | null
  max_uses: number | null
  uses_per_student: number
  times_used: number
  valid_from: string
  expires_at: string | null
  is_active: boolean
  is_valid: boolean
  created_at: string
  created_by: string | null
}

export interface CreatePromoCodePayload {
  code: string
  discount_value: number
  discount_type?: 'percent' | 'fixed'
  course_slug?: string | null
  max_uses?: number | null
  expires_at?: string | null
}

export interface ValidatePromoCodeResult {
  valid: boolean
  code: string
  promo_code_id: string
  discount_type: 'percent' | 'fixed'
  discount_value: number
  discount_label: string
  original_price_cents: number
  discount_cents: number
  final_price_cents: number
  is_free: boolean
  course_title: string
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export const promoCodesApi = {
  /** GET /api/v1/admin/promo-codes/ — list all promo codes */
  list: async (): Promise<PromoCode[]> => {
    const res = await apiClient.get('/admin/promo-codes/')
    return res.data.promo_codes
  },

  /** POST /api/v1/admin/promo-codes/create/ — create a new promo code */
  create: async (payload: CreatePromoCodePayload): Promise<PromoCode> => {
    const res = await apiClient.post('/admin/promo-codes/create/', payload)
    return res.data.promo_code
  },

  /** PATCH /api/v1/admin/promo-codes/<id>/toggle/ — activate or deactivate */
  toggle: async (id: string): Promise<{ is_active: boolean; message: string }> => {
    const res = await apiClient.patch(`/admin/promo-codes/${id}/toggle/`)
    return res.data
  },

  /** DELETE /api/v1/admin/promo-codes/<id>/ — delete (only if never used) */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/promo-codes/${id}/`)
  },
}

// ─── Student API ──────────────────────────────────────────────────────────────

export const validatePromoCode = async (
  code: string,
  courseSlug: string
): Promise<ValidatePromoCodeResult> => {
  const res = await apiClient.post('/student/promo-codes/validate/', {
    code,
    course_slug: courseSlug,
  })
  return res.data
}
