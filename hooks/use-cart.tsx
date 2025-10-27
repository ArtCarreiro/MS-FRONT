"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import { cartService } from "@/lib/api/cart"
import { authService } from "@/lib/api/auth"

interface CartItem {
  productId: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  itemCount: number
  addItem: (productId: string) => Promise<void>
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  syncWithServer: () => Promise<void>
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,

      addItem: async (productId: string) => {
        const items = get().items
        const existingItem = items.find((item) => item.productId === productId)

        if (existingItem) {
          set({
            items: items.map((item) =>
              item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
            ),
            itemCount: get().itemCount + 1,
          })
        } else {
          set({
            items: [...items, { productId, quantity: 1 }],
            itemCount: get().itemCount + 1,
          })
        }

        // Sync with backend if user is logged in
        if (authService.isAuthenticated()) {
          try {
            await cartService.addItem(productId, 1)
          } catch (error) {
            console.error("Failed to sync cart with server:", error)
          }
        }
      },

      removeItem: (productId: string) => {
        const items = get().items
        const item = items.find((i) => i.productId === productId)

        set({
          items: items.filter((item) => item.productId !== productId),
          itemCount: get().itemCount - (item?.quantity || 0),
        })

        // Sync with backend if user is logged in
        if (authService.isAuthenticated()) {
          cartService.removeItem(productId).catch(console.error)
        }
      },

      updateQuantity: (productId: string, quantity: number) => {
        const items = get().items
        const oldItem = items.find((i) => i.productId === productId)
        const oldQuantity = oldItem?.quantity || 0

        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: items.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
          itemCount: get().itemCount - oldQuantity + quantity,
        })

        // Sync with backend if user is logged in
        if (authService.isAuthenticated()) {
          cartService.updateItem(productId, quantity).catch(console.error)
        }
      },

      clearCart: () => {
        set({ items: [], itemCount: 0 })

        // Sync with backend if user is logged in
        if (authService.isAuthenticated()) {
          cartService.clearCart().catch(console.error)
        }
      },

      syncWithServer: async () => {
        if (!authService.isAuthenticated()) return

        try {
          const response = await cartService.getCart()
          set({
            items: response.items,
            itemCount: response.items.reduce((sum, item) => sum + item.quantity, 0),
          })
        } catch (error) {
          console.error("Failed to sync cart with server:", error)
        }
      },
    }),
    {
      name: "cart-storage",
    },
  ),
)
