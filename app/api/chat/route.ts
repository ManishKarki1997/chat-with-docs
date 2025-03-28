import { streamText, UIMessage } from 'ai'
import { createOpenAI } from '@ai-sdk/openai';
import { getContext } from '@/lib/context';
import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db/db';
import { chats, messages as messagesSchema } from '@/lib/db/schema';
import { and, eq } from 'drizzle-orm';

// export const runtime = "edge";
export const config = {
  runtime: 'edge',
  unstable_allowDynamic: [
    '**/node_modules/@pinecone-database/pinecone/**',
  ]
}

const openai = createOpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
  compatibility: 'strict', // strict mode, enable when using the OpenAI API
});

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json()

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

    const [chat] = await db
      .select()
      .from(chats)
      .where(
        and(
          eq(chats.userId, user.id),
          eq(chats.id, parseInt(chatId)),
        )
      )

    if (!chat) {
      return NextResponse.json({
        error: "Chat not found"
      }, {
        status: 404
      })
    }

    const fileKey = chat.fileKey

    const lastMessage = messages[messages.length - 1]
    const context = await getContext(lastMessage.content, fileKey)

    const prompt =
    {
      role: "system",
      content: `
         The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.
        `
    }


    await db.insert(messagesSchema).values({
      chatId: parseInt(chatId),
      userId: user.id,
      content: lastMessage.content,
      role: "user",
    })

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages: [
        prompt,
        ...messages.filter((message: UIMessage) => message.role === "user")
      ],
      onFinish: async (completion) => {

        if (completion?.text) {
          await db.insert(messagesSchema).values({
            chatId: parseInt(chatId),
            userId: user.id,
            content: completion?.text,
            role: "system",
          })
        }
      }
    })

    // const response = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages,
    //   stream: true
    // })

    // const stream = OpenAIStream(response)
    // return new StreamingTextResponse(stream)
    return result.toDataStreamResponse()
  } catch (error) {
    console.log("Error generating chat completion", error)
    return NextResponse.json({
      error: "Error generating chat completion"
    }, {
      status: 500
    })
  }
}