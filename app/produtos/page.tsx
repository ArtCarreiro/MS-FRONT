"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { productsService, type Product } from "@/lib/api/products"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsService.getAll()
        setProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Todos os Produtos</h1>
          <p className="text-muted-foreground mt-2">Navegue por nossa coleção completa de produtos</p>
        </div>
        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Carregando produtos...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                price={product.price}
                compareAtPrice={product.compareAtPrice}
                imageUrl={product.imageUrl}
                isFeatured={product.isFeatured}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
