import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  // Check if user is authenticated via Firebase token cookie
  const token = request.cookies.get("firebase_token")?.value
  
  if (!token) {
    return NextResponse.json({ authenticated: false })
  }
  
  // Verify the token with Firebase
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
      credentials: "include",
    })
    const result = await res.json()
    return NextResponse.json({ authenticated: result.valid })
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ authenticated: false })
  }
}

export async function POST(request: NextRequest) {
  const { text, chatId } = await request.json()
  
  // In a real app, you would validate auth and save to Firestore
  // For now, just return success
  return NextResponse.json({ success: true, messageId: Date.now() })
}