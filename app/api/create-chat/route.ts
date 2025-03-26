import { db } from "@/lib/db/db"
import { chats } from "@/lib/db/schema"
import { loadS3IntoPinecone } from "@/lib/pinecone"
import { getS3Url } from "@/lib/s3"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

// /api/create-chat
export async function POST(req: Request, res: Response) {
  try {

    const supabaseClient = await createClient()
    const userData = await supabaseClient.auth.getUser()
    const user = userData.data.user

    if (!user?.id) {
      return NextResponse.json({
        error: "Unauthorized"
      },
        {
          status: 401
        })
    }

    const body = await req.json()
    const { fileKey, fileName } = body
    await loadS3IntoPinecone(fileKey)

    const chat = await db
      .insert(chats)
      .values({
        fileKey,
        fileName,
        url: getS3Url(fileKey),
        userId: user.id,
        createdAt: new Date()
      }).returning({
        insertedId: chats.id
      })

    const newChatId = chat[0].insertedId

    return NextResponse.json({
      message: "Chat created successfully",
      chatId: newChatId
    },
      {
        status: 201
      })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    )
  }
}