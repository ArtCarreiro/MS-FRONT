const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

interface RequestConfig extends RequestInit {
  requiresAuth?: boolean
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private getAuthToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token")
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { requiresAuth = false, headers = {}, ...restConfig } = config

    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    }

    if (requiresAuth) {
      const token = this.getAuthToken()
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`
      }
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...restConfig,
      headers: requestHeaders,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Erro na requisição" }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async get<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", requiresAuth })
  }

  async post<T>(endpoint: string, data?: any, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    })
  }

  async put<T>(endpoint: string, data?: any, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      requiresAuth,
    })
  }

  async delete<T>(endpoint: string, requiresAuth = false): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", requiresAuth })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
