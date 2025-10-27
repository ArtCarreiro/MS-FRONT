import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await getSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { items, total, shipping } = await request.json()

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total,
        status: "pending",
        shipping_name: shipping.name,
        shipping_email: shipping.email,
        shipping_address: shipping.address,
        shipping_city: shipping.city,
        shipping_state: shipping.state,
        shipping_zip: shipping.zip,
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_price: item.product_price,
      quantity: item.quantity,
    }))

    await supabase.from("order_items").insert(orderItems)

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item: any) => ({
        price_data: {
          currency: "brl",
          product_data: {
            name: item.product_name,
          },
          unit_amount: Math.round(item.product_price * 100),
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${request.nextUrl.origin}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/carrinho`,
      metadata: {
        order_id: order.id,
        user_id: user.id,
      },
    })

    // Update order with Stripe payment intent
    await supabase.from("orders").update({ stripe_payment_intent_id: session.id }).eq("id", order.id)

    return NextResponse.json({ url: session.url })
  } catch (error: any) {
    console.error("[v0] Checkout error:", error)
    return NextResponse.json({ error: error.message || "Erro ao processar checkout" }, { status: 500 })
  }
}
