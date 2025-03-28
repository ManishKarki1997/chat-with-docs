import ChatComponent from '@/components/chat/chat-component';
import ChatSidebar from '@/components/chat/chat-sidebar';
import PDFViewer from '@/components/chat/pdf-viewer';
import FileUpload from '@/components/file-upload';
import { db } from '@/lib/db/db';
import { chats } from '@/lib/db/schema';
import { checkSubscription } from '@/lib/subscription';
import { createClient } from '@/utils/supabase/server';
import { and, eq } from 'drizzle-orm';
import { RocketIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

type Props = {
  params: {
    chatId: string;
  }
}

async function ChatPage({ params }: Props) {
  const { chatId } = await params

  const client = await createClient()
  const userData = await client.auth.getUser()
  const user = userData.data?.user
  if (!user) {
    return redirect("/sign-in")
  }

  const isPro = await checkSubscription()

  const _chats = await db
    .select()
    .from(chats)
    .where(
      and(
        eq(chats.userId, user.id),
      )
    )




  if (!_chats) {
    return redirect("/")
  }


  return (
    <div className='flex max-h-screen overscroll-auto' >
      <div className="flex w-full max-h-screen overscroll-auto">
        <div className="flex-[1] max-w-xs">
          <ChatSidebar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
        </div>

        <div className="max-h-screen p-4 overscroll-auto flex-[5] flex items-center justify-center">
          <div className='w-full flex-1 max-w-lg mx-auto text-center flex flex-col items-center'>
            <RocketIcon className='h-10 w-10 mb-2' />
            <h3 className='font-medium text-lg mb-4'>Ready to chat with your documents?</h3>
            <FileUpload />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage