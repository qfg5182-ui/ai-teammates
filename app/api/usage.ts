import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Return mock usage stats
  const stats = {
    totalMessages: 1247,
    activeChats: 3,
    storageUsed: 512,
    storageLimit: 1024
  }
  
  return NextResponse.json(stats)
}