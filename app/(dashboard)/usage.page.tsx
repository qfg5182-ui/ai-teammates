import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { db } from "@/lib/firebase-server"
import { doc, onValue, query, orderByChild, collection } from "firebase/firestore"

interface UsageStats {
  id: string
  totalMessages: number
  activeChats: number
  storageUsed: number
  storageLimit: number
}

export default function UsagePage({
  params,
}: {
  params: {}
}) {
  const [stats, setStats] = useState<UsageStats | null>(null)
  const [loading, setLoading] = useState(true)
  const userId = params.userId

  useEffect(() => {
    // Check authentication - redirect to sign-in if not authenticated
    const checkAuth = async () => {
      const res = await fetch("/api/auth/check", {
        credentials: "include",
      })
      const authResult = await res.json()
      if (!authResult.authenticated) {
        return redirect("/sign-in")
      }
    }

    checkAuth()

    // Fetch usage stats
    fetch("/api/usage")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  if (!stats) {
    return <div className="p-6">No stats available</div>
  }

  const { totalMessages, activeChats, storageUsed, storageLimit } = stats
  const usagePercent = Math.round((storageUsed / storageLimit) * 100)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Usage Stats</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border rounded bg-blue-50">
          <p className="text-3xl font-bold">{totalMessages}</p>
          <p className="text-sm text-gray-600">Total Messages</p>
        </div>
        <div className="p-4 border rounded bg-blue-50">
          <p className="text-3xl font-bold">{activeChats}</p>
          <p className="text-sm text-gray-600">Active Chats</p>
        </div>
      </div>

      <div className="mt-6">
        <p className="text-lg font-medium mb-2">Storage Usage</p>
        <div className="bg-gray-200 rounded h-4 w-full">
          <div
            className="bg-blue-500 h-4 rounded w-{{ usagePercent }}%"
            style={{ width: `${usagePercent}%` }}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={usagePercent}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {storageUsed}/{storageLimit} MB ({usagePercent}%)
        </p>
      </div>
    </div>
  )
}