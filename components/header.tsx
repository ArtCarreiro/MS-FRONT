"use client"

import Link from "next/link"
import { ShoppingCart, User, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"

export function Header() {
  const { itemCount } = useCart()
  const { user, isAuthenticated, checkAuth } = useAuth()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary" > 
          <img
                src="/logo.png"
                alt="Logo"
                className="w-full h-full object-cover"
          />
          </div>
          <span className="text-xl font-bold">Miranda Store</span>
        </Link>

        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar produtos..." className="pl-10" />
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href={isAuthenticated ? "/perfil" : "/login"}>
              <User className="h-5 w-5" />
              <span className="sr-only">{isAuthenticated ? "Perfil" : "Login"}</span>
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/carrinho">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {itemCount}
                </Badge>
              )}
              <span className="sr-only">Carrinho</span>
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
