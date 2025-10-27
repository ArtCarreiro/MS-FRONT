import { apiClient } from "./client"

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compareAtPrice?: number
  imageUrl: string
  images?: string[]
  stock: number
  categoryId: string
  isFeatured: boolean
  isActive: boolean
  createdAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
}

export const productsService = {
  async getAll(): Promise<Product[]> {
    return apiClient.get<Product[]>("/products")
  },

  async getFeatured(): Promise<Product[]> {
    return apiClient.get<Product[]>("/products/featured")
  },

  async getBySlug(slug: string): Promise<Product> {
    return apiClient.get<Product>(`/products/${slug}`)
  },

  async getByCategory(categorySlug: string): Promise<Product[]> {
    return apiClient.get<Product[]>(`/products/category/${categorySlug}`)
  },

  async getCategories(): Promise<Category[]> {
    return apiClient.get<Category[]>("/categories")
  },
}
