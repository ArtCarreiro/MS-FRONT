"use client"

import { create } from "zustand"
import { authService, type AuthResponse } from "@/lib/api/auth"

interface AuthStore {
  user: AuthResponse["user"] | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => void
}

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email: string, password: string) => {
    const response = await authService.login({ email, password })
    set({ user: response.user, isAuthenticated: true })
  },

  register: async (email: string, password: string, name?: string) => {
    const response = await authService.register({ email, password, name })
    set({ user: response.user, isAuthenticated: true })
  },

  logout: async () => {
    await authService.logout()
    set({ user: null, isAuthenticated: false })
  },

  checkAuth: () => {
    const user = authService.getCurrentUser()
    const isAuthenticated = authService.isAuthenticated()
    set({ user, isAuthenticated, isLoading: false })
  },
}))
