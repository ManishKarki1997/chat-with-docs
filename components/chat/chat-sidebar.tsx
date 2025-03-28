
import { ChatSchema } from '@/lib/db/schema';
import { cn } from '@/lib/utils';
import { DiamondIcon, DiamondPlus, MessageCircleIcon, PlusIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';
import React from 'react';
import axios from 'axios';
import Logo from '../logo';
import SubscriptionButton from '../subscription-button';

type Props = {
  chats: ChatSchema[];
  chatId: number;
  isPro: boolean;
}

async function ChatSidebar({ chats, chatId, isPro }: Props) {

  return (
    <div className='w-full h-screen p-4'>
      <Link href="/">
        <Logo />
      </Link>

      <div className='mt-8'>
        <Link href="/chats" className=''>
          <Button className='flex-1 w-full'>
            <PlusIcon className='mr-2 h-4 w-4' />
            New Chat
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-2 mt-8">
        {
          chats.map(chat => (
            <Link key={chat.id} href={`/chats/${chat.id}`}>
              <div className={cn("rounded-lg p-3 flex items-center", {
                "bg-blue-600 text-white": chat.id === chatId,
                "hover:text-white": chat.id !== chatId,
              })}>
                <MessageCircleIcon className='h-4 w-4 mr-2' />
                <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>{chat.fileName}</p>
              </div>
            </Link>
          ))
        }
      </div>

      <div className='absolute bottom-4 left-4'>


        <SubscriptionButton isPro={isPro} />
      </div>

    </div>
  )
}

export default ChatSidebar