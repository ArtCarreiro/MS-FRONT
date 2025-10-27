"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { productsService, type Product } from "@/lib/api/products"

export default function ProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsService.getBySlug(slug)
        setProduct(data)
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center py-12 text-muted-foreground">Carregando produto...</div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Produto não encontrado</h2>
            <p className="text-muted-foreground">O produto que você procura não existe ou foi removido.</p>
          </div>
        </div>
      </div>
    )
  }

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-muted">
              {product.isFeatured && <Badge className="absolute top-4 left-4 z-10">Destaque</Badge>}
              {discount > 0 && (
                <Badge variant="destructive" className="absolute top-4 right-4 z-10">
                  -{discount}%
                </Badge>
              )}
              <Image
                src={product.imageUrl || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-muted border-2 border-transparent hover:border-primary cursor-pointer transition-colors"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Imagem ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-balance">{product.name}</h1>
              <div className="mt-4 flex items-center gap-4">
                <span className="text-4xl font-bold">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(product.compareAtPrice)}
                  </span>
                )}
              </div>
            </div>

            <div className="prose prose-sm max-w-none">
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Disponibilidade:</span>
                <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {product.stock > 0 ? `${product.stock} em estoque` : "Fora de estoque"}
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <AddToCartButton productId={product.id} className="flex-1" />
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
                <span className="sr-only">Adicionar aos favoritos</span>
              </Button>
            </div>

            <div className="border-t pt-6 space-y-4">
              <h3 className="font-semibold">Informações do Produto</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>✓ Entrega rápida e segura</li>
                <li>✓ Garantia de 30 dias</li>
                <li>✓ Pagamento seguro</li>
                <li>✓ Suporte ao cliente 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
