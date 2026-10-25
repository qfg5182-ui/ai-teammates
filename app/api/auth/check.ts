import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Check if user is authenticated via Firebase token cookie
  const token = request.cookies.get("firebase_token")?.value
  
  if (!token) {
    return NextResponse.json({ authenticated: false })
  }
  
  // In a real app, you would verify the Firebase ID token here
  // using Firebase Admin SDK. For this demo, we'll just check if token exists.
  return NextResponse.json({ authenticated: true, userId: "user_123" })
}