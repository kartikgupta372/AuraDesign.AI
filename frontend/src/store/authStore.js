import { create } from 'zustand'
import { authApi } from '../api/auth.api'

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  checkAuth: async () => {
    try {
      const res = await authApi.me()
      set({ user: res.data.data.user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  login: async (email, password) => {
    const res = await authApi.login({ email, password })
    set({ user: res.data.data.user, isAuthenticated: true })
    return res.data.data.user
  },

  register: async (name, email, password) => {
    const res = await authApi.register({ name, email, password })
    set({ user: res.data.data.user, isAuthenticated: true })
    return res.data.data.user
  },

  logout: async () => {
    await authApi.logout().catch(() => {})
    set({ user: null, isAuthenticated: false })
  },
}))
