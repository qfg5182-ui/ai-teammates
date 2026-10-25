import { NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Return mock pricing plans
  const plans = [
    {
      id: "free",
      name: "Free",
      price: "0",
      features: [
        "10 messages per month",
        "1 active chat",
        "100MB storage"
      ],
      popular: false
    },
    {
      id: "pro",
      name: "Pro",
      price: "9",
      features: [
        "Unlimited messages",
        "Unlimited chats",
        "1GB storage",
        "Priority support"
      ],
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "49",
      features: [
        "Everything in Pro",
        "Unlimited storage",
        "Dedicated support",
        "Custom integrations"
      ],
      popular: false
    }
  ]
  
  return NextResponse.json(plans)
}