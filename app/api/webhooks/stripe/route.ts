import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import type Stripe from "stripe"

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.error("[v0] Webhook signature verification failed:", err.message)
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
  }

  const supabase = await getSupabaseServerClient()

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session

      // Update order status
      if (session.metadata?.order_id) {
        await supabase
          .from("orders")
          .update({
            status: "processing",
            stripe_payment_intent_id: session.payment_intent as string,
          })
          .eq("id", session.metadata.order_id)

        console.log("[v0] Order updated:", session.metadata.order_id)
      }
      break

    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      console.log("[v0] Payment succeeded:", paymentIntent.id)
      break

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent
      console.log("[v0] Payment failed:", failedPayment.id)
      break

    default:
      console.log("[v0] Unhandled event type:", event.type)
  }

  return NextResponse.json({ received: true })
}
