"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function LogoutButton() {
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Sair
    </Button>
  )
}
