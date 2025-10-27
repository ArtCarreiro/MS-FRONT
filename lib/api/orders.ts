import { apiClient } from "./client"

export interface OrderItem {
  id: string
  productId: string
  productName: string
  productPrice: number
  quantity: number
}

export interface Order {
  id: string
  userId: string
  status: "pending" | "processing" | "completed" | "cancelled"
  total: number
  shippingName: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  stripeSessionId?: string
  createdAt: string
  orderItems: OrderItem[]
}

export interface CreateOrderRequest {
  shippingName: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
}

export const ordersService = {
  async getMyOrders(): Promise<Order[]> {
    return apiClient.get<Order[]>("/orders", true)
  },

  async getOrderById(orderId: string): Promise<Order> {
    return apiClient.get<Order>(`/orders/${orderId}`, true)
  },

  async createOrder(data: CreateOrderRequest): Promise<Order> {
    return apiClient.post<Order>("/orders", data, true)
  },
}
