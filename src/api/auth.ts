import { apiClient } from './client'
import type { ApiResponse, User } from '@/types'

export interface LoginRequest { email: string; password: string }
export interface RegisterRequest { email: string; password: string; name: string }
export interface LoginResponse { token: string; refresh_token?: string; user: User }

export const authApi = {
  login: async (data: LoginRequest) => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login/', data)
    return res.data.data
  },

  register: async (data: RegisterRequest) => {
    const res = await apiClient.post<ApiResponse<{ user_id: number; email: string }>>('/auth/register/', data)
    return res.data.data
  },

  logout: async () => {
    await apiClient.post('/auth/logout/')
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  },

  refresh: async (token: string) => {
    const res = await apiClient.post<ApiResponse<{ token: string }>>('/auth/refresh/', { token })
    return res.data.data.token
  },
}
