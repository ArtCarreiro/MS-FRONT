import { apiClient } from "./client"

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name?: string
}

export interface AuthResponse {
  token: string
  user: {
    id: string
    email: string
    name?: string
    createdAt: string
  }
}

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", credentials)

    // Store token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }

    return response
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/register", data)

    // Store token in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", response.token)
      localStorage.setItem("user", JSON.stringify(response.user))
    }

    return response
  },

  async logout(): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user")
    }
  },

  getCurrentUser(): AuthResponse["user"] | null {
    if (typeof window === "undefined") return null

    const userStr = localStorage.getItem("user")
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("auth_token")
  },
}
