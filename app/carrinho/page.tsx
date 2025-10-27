"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface CartProduct {
  id: string
  name: string
  slug: string
  price: number
  image_url: string
  stock: number
}

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem } = useCart()
  const [products, setProducts] = useState<CartProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      if (items.length === 0) {
        setLoading(false)
        return
      }

      const supabase = getSupabaseBrowserClient()
      const productIds = items.map((item) => item.productId)

      const { data } = await supabase.from("products").select("*").in("id", productIds)

      if (data) {
        setProducts(data)
      }
      setLoading(false)
    }

    fetchProducts()
  }, [items])

  const getCartItemQuantity = (productId: string) => {
    return items.find((item) => item.productId === productId)?.quantity || 0
  }

  const subtotal = products.reduce((total, product) => {
    const quantity = getCartItemQuantity(product.id)
    return total + product.price * quantity
  }, 0)

  const shipping = subtotal > 200 ? 0 : 15
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground">Carregando carrinho...</p>
          </div>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <Card className="max-w-md mx-auto text-center py-12">
            <CardContent className="space-y-4">
              <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
              <h2 className="text-2xl font-bold">Seu carrinho está vazio</h2>
              <p className="text-muted-foreground">Adicione produtos ao carrinho para continuar comprando</p>
              <Button asChild className="mt-4">
                <Link href="/produtos">Ver Produtos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Carrinho de Compras</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {products.map((product) => {
              const quantity = getCartItemQuantity(product.id)
              return (
                <Card key={product.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/produtos/${product.slug}`} className="hover:text-primary">
                          <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
                        </Link>
                        <p className="text-2xl font-bold mt-2">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(product.price)}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(product.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remover</span>
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            disabled={quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-12 text-center font-medium">{quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Frete</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Grátis</span>
                    ) : (
                      new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(shipping)
                    )}
                  </span>
                </div>
                {subtotal < 200 && (
                  <p className="text-xs text-muted-foreground">Frete grátis em compras acima de R$ 200,00</p>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(total)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button className="w-full" size="lg" asChild>
                  <Link href="/checkout">Finalizar Compra</Link>
                </Button>
                <Button variant="outline" className="w-full bg-transparent" asChild>
                  <Link href="/produtos">Continuar Comprando</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
