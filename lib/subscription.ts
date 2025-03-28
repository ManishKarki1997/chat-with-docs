import { createClient } from "@/utils/supabase/server"
import { db } from "./db/db"
import { userSubscriptions } from "./db/schema"
import { eq } from "drizzle-orm"

const DAY_IN_MS = 86_400

export async function checkSubscription() {
  const client = await createClient()
  const userData = await client.auth.getUser()
  const user = userData.data?.user
  if (!user) {
    return false
  }

  const [userSubscription] = await
    db
      .select()
      .from(userSubscriptions)
      .where(
        eq(userSubscriptions.userId, user.id)
      )

  if (!userSubscription) {
    return false
  }

  const isValid = userSubscription?.stripePriceId && userSubscription?.stripeCurrentPeriodEnd && userSubscription?.stripeCurrentPeriodEnd?.getTime() + DAY_IN_MS > Date.now()

  return !!isValid
}