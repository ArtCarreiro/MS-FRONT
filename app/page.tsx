"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { productsService, type Product, type Category } from "@/lib/api/products"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, cats] = await Promise.all([productsService.getFeatured(), productsService.getCategories()])
        setFeaturedProducts(products.slice(0, 4))
        setCategories(cats.slice(0, 4))
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-background to-background py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance mb-6">
              Encontre os Melhores Produtos com os Melhores Preços
            </h1>
            <p className="text-xl text-muted-foreground text-pretty mb-8">
              Milhares de produtos com entrega rápida e segura. Aproveite nossas ofertas exclusivas!
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/produtos">
                  Ver Produtos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/categorias">Ver Categorias</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Produtos em Destaque</h2>
              <p className="text-muted-foreground mt-2">Os produtos mais populares da nossa loja</p>
            </div>
            <Button variant="ghost" asChild>
              <Link href="/produtos">
                Ver Todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Carregando produtos...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
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
      </section>

      {/* Categories */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Categorias</h2>
            <p className="text-muted-foreground mt-2">Explore nossos produtos por categoria</p>
          </div>
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Carregando categorias...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categorias/${category.slug}`}
                  className="group relative aspect-square rounded-lg overflow-hidden bg-background border hover:shadow-lg transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-white font-semibold text-lg">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 md:py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-primary" />
                <span className="text-xl font-bold">Miranda Store</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sua loja online de confiança com os melhores produtos e preços.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/categorias/eletronicos" className="hover:text-foreground">
                    Eletrônicos
                  </Link>
                </li>
                <li>
                  <Link href="/categorias/moda" className="hover:text-foreground">
                    Moda
                  </Link>
                </li>
                <li>
                  <Link href="/categorias/casa-decoracao" className="hover:text-foreground">
                    Casa e Decoração
                  </Link>
                </li>
                <li>
                  <Link href="/categorias/esportes" className="hover:text-foreground">
                    Esportes
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ajuda</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/sobre" className="hover:text-foreground">
                    Sobre Nós
                  </Link>
                </li>
                <li>
                  <Link href="/contato" className="hover:text-foreground">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-foreground">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/termos" className="hover:text-foreground">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link href="/privacidade" className="hover:text-foreground">
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Miranda Store. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
