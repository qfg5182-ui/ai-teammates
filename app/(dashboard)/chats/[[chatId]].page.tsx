import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { db } from "@/lib/firebase-server"
import { doc, onValue, query, orderByChild } from "firebase/firestore"

interface ChatMessage {
  id: string
  text: string
  user: string
  createdAt: Date
}

export default function ChatsPage({
  params,
}: {
  params: { chatId: string }
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const chatId = params.chatId

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

    // Fetch messages from Firebase
    const messagesRef = doc(db, "chats", chatId)
    const messagesQuery = query(messagesRef, orderByChild("createdAt"))

    const unsub = onValue(messagesQuery, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        setMessages(Object.values(data) as ChatMessage[])
      }
    })

    return () => unsub()
  }, [chatId])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    await fetch("/api/chats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, chatId }),
      credentials: "include",
    })

    setInput("")
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chat: {chatId}</h1>

      <div className="h-[500px] overflow-y-auto mb-6">
        {messages.map((msg) => (
          <div key={msg.id} className="p-3 mb-2 rounded bg-blue-100 max-w-lg">
            <p className="font-medium">{msg.user}</p>
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Send
        </button>
      </form>
    </div>
  )
}