import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { db } from "@/lib/firebase-server"
import { doc, onValue, query, orderByChild } from "firebase/firestore"

interface PricingPlan {
  id: string
  name: string
  price: string
  features: string[]
  popular?: boolean
}

export default function PricingPage({
  params,
}: {
  params: {}
}) {
  const [plans, setPlans] = useState<PricingPlan[]>([])
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

    // Fetch pricing plans
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => setPlans(data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-6">Loading...</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Pricing</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="p-6 border rounded shadow-lg transition-all duration-300 hover:shadow-xl ${
              plan.popular ? "bg-blue-100 border-blue-500" : "bg-white border-gray-200"
            }"
          >
            <h2 className="text-xl font-bold mb-4">{plan.name}</h2>
            <p className="text-3xl font-medium mb-6">${plan.price}/month</p>
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-500 flex-shrink-0 mt-1"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 18c-1 0-2-.03-3-.03s-2.01.03-3.01.03a3.32 3.32 0 0 0-.44 2.22 3.36 3.36 0 0 0 .88 4.44 3.32 3.32 0 0 0 4.43-.88 3.36 3.36 0 0 0 1.07-1.48 3.32 3.32 0 0 0 .43-2.23 3.32 3.32 0 0 0-.44-1.83ZM13.5 3c1.66 0 3.04 1.43 3.1 3.5H6.9c.06-2.07 1.43-3.5 3.1-3.5Zm-2.5 11h-5c-.83 0-1.5-1.08-1.38-2.1H7.58c.12 1.02 0.96 2.1 1.38 2.1Zm4.8-5.3l1.6 5.3H13l1.6-5.3Zm2.6 3.8l-1.6-5.2H16l1.6 5.2Zm4.1-1.6l-1.6-5.4H18l1.6 5.4Z"}
                  </svg>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => window.location.href="/api/create-checkout-session"}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}