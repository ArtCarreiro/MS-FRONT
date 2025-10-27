import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // For Java backend, authentication is handled via JWT tokens
  // The backend will validate tokens on protected endpoints
  // Client-side auth check happens in components using useAuth hook

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}
