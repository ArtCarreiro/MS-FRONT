"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

interface AddToCartButtonProps {
  productId: string
  className?: string
}

export function AddToCartButton({ productId, className }: AddToCartButtonProps) {
  const [loading, setLoading] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await addItem(productId)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleAddToCart} disabled={loading} className={cn(className)} size="lg">
      <ShoppingCart className="mr-2 h-5 w-5" />
      {loading ? "Adicionando..." : "Adicionar ao Carrinho"}
    </Button>
  )
}
