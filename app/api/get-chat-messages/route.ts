import { db } from "@/lib/db/db"
import { messages } from "@/lib/db/schema"
import { createClient } from "@/utils/supabase/server"
import { and, eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
  const { chatId } = await req.json()

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

  const chatMessages = await db
    .select()
    .from(messages)
    .where(
      and(
        eq(messages.chatId, parseInt(chatId)),
        eq(messages.userId, user.id),
      )
    )

  return NextResponse.json(chatMessages)
}