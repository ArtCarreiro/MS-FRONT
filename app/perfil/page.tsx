"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Package } from "lucide-react"
import Link from "next/link"
import { LogoutButton } from "@/components/logout-button"
import { useAuth } from "@/hooks/use-auth"
import { ordersService, type Order } from "@/lib/api/orders"

export default function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, checkAuth } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push("/login")
      return
    }

    const fetchOrders = async () => {
      if (!isAuthenticated) return

      try {
        const data = await ordersService.getMyOrders()
        setOrders(data)
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [isAuthenticated, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center py-12 text-muted-foreground">Carregando...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Meu Perfil</h1>
            <LogoutButton />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="orders">Meus Pedidos</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Email</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-balance break-all">{user.email}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Pedidos</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalOrders}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(totalSpent)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Informações da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Membro desde</p>
                      <p className="font-medium">
                        {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg">Pedido #{order.id.slice(0, 8)}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(order.createdAt).toLocaleDateString("pt-BR", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold">
                              {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              }).format(order.total)}
                            </p>
                            <span
                              className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 ${
                                order.status === "completed"
                                  ? "bg-green-100 text-green-800"
                                  : order.status === "processing"
                                    ? "bg-blue-100 text-blue-800"
                                    : order.status === "cancelled"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status === "completed"
                                ? "Concluído"
                                : order.status === "processing"
                                  ? "Processando"
                                  : order.status === "cancelled"
                                    ? "Cancelado"
                                    : "Pendente"}
                            </span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="font-medium">Itens do Pedido:</p>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {order.orderItems.map((item) => (
                              <li key={item.id}>
                                {item.quantity}x {item.productName} -{" "}
                                {new Intl.NumberFormat("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                }).format(item.productPrice)}
                              </li>
                            ))}
                          </ul>
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium">Endereço de Entrega:</p>
                            <p className="text-sm text-muted-foreground">
                              {order.shippingName}
                              <br />
                              {order.shippingAddress}
                              <br />
                              {order.shippingCity}, {order.shippingState} - {order.shippingZip}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
                    <p className="text-muted-foreground mb-4">Você ainda não fez nenhum pedido</p>
                    <Button asChild>
                      <Link href="/produtos">Começar a Comprar</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
