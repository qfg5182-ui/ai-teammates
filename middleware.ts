import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Middleware for Firebase authentication
// Protects routes that require authentication

// Protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/chats",
  "/usage",
  "/pricing",
]

// Public routes (no auth required)
const publicRoutes = [
  "/sign-in",
  "/sign-up",
  "/api/health",
  "/api/auth/check",
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip auth check for public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    // If already authenticated and trying to access sign-in, redirect to home
    const token = request.cookies.get("firebase_token")?.value
    if (token && protectedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url))
    }
    return NextResponse.next()
  }

  // Check for authentication token
  const token = request.cookies.get("firebase_token")?.value

  if (token) {
    // Authenticated user - allow access
    return NextResponse.next()
  }

  // Not authenticated - redirect to sign-in (unless it's an API route)
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/check")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Not authenticated - redirect to sign-in
  const url = new URL("/sign-in", request.url)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/auth/check).*)",
  ],
}
