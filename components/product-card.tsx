import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  id: string
  name: string
  slug: string
  price: number
  compareAtPrice?: number
  imageUrl: string
  isFeatured?: boolean
}

export function ProductCard({ id, name, slug, price, compareAtPrice, imageUrl, isFeatured }: ProductCardProps) {
  const discount = compareAtPrice ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/produtos/${slug}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          {isFeatured && <Badge className="absolute top-2 left-2 z-10">Destaque</Badge>}
          {discount > 0 && (
            <Badge variant="destructive" className="absolute top-2 right-2 z-10">
              -{discount}%
            </Badge>
          )}
          <Image
            src={imageUrl || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/produtos/${slug}`}>
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">{name}</h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-2xl font-bold">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(price)}
          </span>
          {compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(compareAtPrice)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" size="sm">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Adicionar ao Carrinho
        </Button>
      </CardFooter>
    </Card>
  )
}
