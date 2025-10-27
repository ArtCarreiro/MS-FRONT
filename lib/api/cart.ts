import { apiClient } from "./client"

export interface CartItem {
  productId: string
  quantity: number
}

export interface CartResponse {
  items: CartItem[]
  total: number
}

export const cartService = {
  async getCart(): Promise<CartResponse> {
    return apiClient.get<CartResponse>("/cart", true)
  },

  async addItem(productId: string, quantity = 1): Promise<CartResponse> {
    return apiClient.post<CartResponse>("/cart/items", { productId, quantity }, true)
  },

  async updateItem(productId: string, quantity: number): Promise<CartResponse> {
    return apiClient.put<CartResponse>(`/cart/items/${productId}`, { quantity }, true)
  },

  async removeItem(productId: string): Promise<void> {
    return apiClient.delete<void>(`/cart/items/${productId}`, true)
  },

  async clearCart(): Promise<void> {
    return apiClient.delete<void>("/cart", true)
  },
}
