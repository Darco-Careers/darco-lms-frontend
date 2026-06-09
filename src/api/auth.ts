import { apiClient } from './client'
import type { ApiResponse, User } from '@/types'

export interface LoginRequest { email: string; password: string }
export interface RegisterRequest { email: string; password: string; name: string }

// Backend login returns { access, refresh, user, tenant } directly (no ApiResponse wrapper)
interface LoginBackendResponse { access: string; refresh: string; user: User; tenant?: Record<string, unknown> }
export interface LoginResponse { token: string; refresh_token?: string; user: User }
export interface RegisterResponse { token: string; refresh_token: string; user: User }

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginBackendResponse>('/auth/login/', data)
    const d = res.data
    return { token: d.access, refresh_token: d.refresh, user: d.user }
  },

  register: async (data: RegisterRequest) => {
    const res = await apiClient.post<ApiResponse<RegisterResponse>>('/auth/register/', data)
    return res.data.data
  },

  logout: async () => {
    await apiClient.post('/auth/logout/')
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  },

  refresh: async (token: string) => {
    // simplejwt TokenRefreshView expects { refresh: '...' } and returns { access: '...' }
    const res = await apiClient.post<{ access: string }>('/auth/refresh/', { refresh: token })
    return res.data.access
  },
}
