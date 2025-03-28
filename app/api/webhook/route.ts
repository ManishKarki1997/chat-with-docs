import { db } from "@/lib/db/db"
import { userSubscriptions } from "@/lib/db/schema"
import { stripe } from "@/lib/stripe"
import { eq } from "drizzle-orm"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import Stripe from 'stripe'

export async function POST(req: Request) {
  const body = await req.text()

  const _headers = await headers()
  const signature = _headers.get("Stripe-Signature") as string

  let event: Stripe.Event | null = null

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error("Error with stripe ", error)
    return new NextResponse("Webhook error", {
      status: 400,
    })
  }

  if (!event) {
    console.error("No event found ",)
    return new NextResponse("Invalid request", {
      status: 400,
    })
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === "checkout.session.completed") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

    if (!session.metadata?.userId) {
      console.error("No user id found ",)
      return new NextResponse("No userId", {
        status: 400,
      })
    }

    // new subscription created
    await db
      .insert(userSubscriptions)
      .values({
        userId: session.metadata?.userId as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeCustomerId: subscription.customer as string
      })
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

    if (!session.metadata?.userId) {
      console.error("No User Id ",)

      return new NextResponse("No userId", {
        status: 400,
      })
    }


    await db
      .update(userSubscriptions)
      .set({
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
        stripeCustomerId: subscription.customer as string
      })
      .where(
        eq(userSubscriptions.userId, session.metadata?.userId as string)
      )
  }


  return new NextResponse(null, { status: 200 })

}