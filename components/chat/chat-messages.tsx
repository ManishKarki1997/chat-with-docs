import { cn } from '@/lib/utils';
import { UIMessage } from 'ai'
import React from 'react'
import { Skeleton } from '../ui/skeleton';

type Props = {
  isLoading: boolean;
  messages: UIMessage[];
}

function ChatMessages({ messages, isLoading }: Props) {


  if (isLoading) {

    return <div className='space-y-4 mt-4'>
      {
        Array.from(Array(8).keys()).map(sk => (
          <Skeleton key={sk} className='w-full h-16' />
        ))
      }
    </div>
  }

  if (!messages) {
    return null
  }

  return (
    <div className='flex flex-col gap-2 px-4'>
      {
        messages.map(message => {
          return (
            <div
              key={message.id}
              className={cn("flex", {
                "justify-end pl-10": message.role === "user",
                "justify-start pr-10": message.role === "system",
              })}
            >
              <div className={cn('rounded-lg px-3 py-1 text-sm shadow-sm ring-1', {
                "bg-blue-600 text-white": message.role === "user"
              })}>
                <p >{message.content}</p>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}

export default ChatMessages