import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string, refreshToken?: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token, refreshToken) => {
        localStorage.setItem('authToken', token)
        if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
        set({ user, token, isAuthenticated: true })
      },

      clearAuth: () => {
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'darco-auth',
      partialize: (state) => ({ user: state.user, token: state.token, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        // Re-sync localStorage.authToken from the persisted Zustand state on page reload
        if (state?.token) {
          localStorage.setItem('authToken', state.token)
        }
        // Note: refreshToken is stored only in localStorage (not Zustand) to avoid
        // it appearing in Zustand DevTools. It persists across reloads via localStorage.
      },
    }
  )
)
