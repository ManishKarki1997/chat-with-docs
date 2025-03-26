import { cn } from '@/lib/utils';
import { UIMessage } from 'ai'
import React from 'react'

type Props = {
  messages: UIMessage[];
}

function ChatMessages({ messages }: Props) {

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