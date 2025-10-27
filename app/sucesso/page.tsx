import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container py-16">
        <Card className="max-w-2xl mx-auto text-center py-12">
          <CardContent className="space-y-6">
            <CheckCircle className="h-20 w-20 mx-auto text-green-600" />
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">Pedido Confirmado!</h1>
              <p className="text-xl text-muted-foreground">Obrigado pela sua compra</p>
            </div>
            <p className="text-muted-foreground max-w-md mx-auto">
              Seu pedido foi processado com sucesso. Você receberá um email de confirmação em breve com os detalhes do
              seu pedido e informações de rastreamento.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild>
                <Link href="/perfil/pedidos">Ver Meus Pedidos</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/produtos">Continuar Comprando</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
