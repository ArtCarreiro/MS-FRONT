"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCart } from "@/hooks/use-cart"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface CartProduct {
  id: string
  name: string
  price: number
  image_url: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, clearCart } = useCart()
  const [products, setProducts] = useState<CartProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  })

  useEffect(() => {
    const init = async () => {
      if (items.length === 0) {
        router.push("/carrinho")
        return
      }

      const supabase = getSupabaseBrowserClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      setUser(user)
      setFormData((prev) => ({ ...prev, email: user.email || "" }))

      const productIds = items.map((item) => item.productId)
      const { data } = await supabase.from("products").select("*").in("id", productIds)

      if (data) {
        setProducts(data)
      }
      setLoading(false)
    }

    init()
  }, [items, router])

  const getCartItemQuantity = (productId: string) => {
    return items.find((item) => item.productId === productId)?.quantity || 0
  }

  const subtotal = products.reduce((total, product) => {
    const quantity = getCartItemQuantity(product.id)
    return total + product.price * quantity
  }, 0)

  const shipping = subtotal > 200 ? 0 : 15
  const total = subtotal + shipping

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setProcessing(true)

    try {
      // Create order in database
      const orderItems = products.map((product) => ({
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        quantity: getCartItemQuantity(product.id),
      }))

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          total,
          shipping: formData,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao processar pagamento")
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        clearCart()
        window.location.href = data.url
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar pagamento")
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <h1 className="text-4xl font-bold tracking-tight mb-8">Finalizar Compra</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Shipping Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações de Entrega</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                        disabled={processing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                        disabled={processing}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      required
                      disabled={processing}
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                        disabled={processing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                        disabled={processing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">CEP</Label>
                      <Input
                        id="zip"
                        value={formData.zip}
                        onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                        required
                        disabled={processing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Resumo do Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {products.map((product) => {
                      const quantity = getCartItemQuantity(product.id)
                      return (
                        <div key={product.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {product.name} x{quantity}
                          </span>
                          <span className="font-medium">
                            {new Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(product.price * quantity)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <Separator />
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
                  <Button type="submit" className="w-full" size="lg" disabled={processing}>
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Pagar com Stripe"
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">Pagamento seguro processado pelo Stripe</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
