import { db } from "@/lib/db/db"
import { userSubscriptions } from "@/lib/db/schema"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/utils/supabase/server"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"


const ReturnUrl = process.env.NEXT_PUBLIC_BASE_URL + "/"

export async function GET() {
  try {
    const client = await createClient()
    const userData = await client.auth.getUser()
    const user = userData.data?.user
    if (!user) {
      return NextResponse.json({
        error: "Unauthorized"
      }, {
        status: 401
      })
    }

    const [userSubscription] = await
      db
        .select()
        .from(userSubscriptions)
        .where(
          eq(userSubscriptions.userId, user.id)
        )

    if (userSubscription && userSubscription.stripeCustomerId) {
      // cancel their billing portal
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: ReturnUrl
      })

      return NextResponse.json({ url: stripeSession.url })
    }

    // user's first time trying to subscribe
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: ReturnUrl,
      cancel_url: ReturnUrl,
      payment_method_types: ['card'],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Chat with Docs Pro",
              description: "Unlimited chats with your documents",
            },
            unit_amount: 2000,
            recurring: {
              interval: "month"
            }
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id
      }
    })

    return NextResponse.json({ url: stripeSession.url })

  } catch (error) {
    console.log("Error with stripe ", error)
    return NextResponse.json({
      error: "Error with stripe"
    }, {
      status: 500
    })
  }
}