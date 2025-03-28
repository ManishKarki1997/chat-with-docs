"use client"

import React from 'react'
import { useChat } from "ai/react"
import { Input } from '../ui/input'
import { SendIcon } from 'lucide-react'
import { Button } from '../ui/button'
import ChatMessages from './chat-messages'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

type Props = {
  chatId: number;
}

function ChatComponent({ chatId }: Props) {

  const { data, isLoading } = useQuery({
    queryKey: ['chat-messages', chatId],
    queryFn: async () => {
      const response = await axios.post(`/api/get-chat-messages`, {
        chatId
      })

      return response.data
    }
  })


  const { input, handleInputChange, handleSubmit, messages } = useChat({
    body: {
      chatId,
    },
    initialMessages: data || []
  })

  React.useEffect(() => {
    const messagesContainer = document.getElementById("messages-container")
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
    }
  }, [messages])

  return (
    <div className='relative max-h-screen overflow-auto' id={"messages-container"}>
      <div className='sticky top-0 left-0 w-full h-fit mb-4'>
        <h3 className='text-xl font-bold'>Chat</h3>
      </div>

      {/* messages */}
      <ChatMessages messages={messages} isLoading={isLoading} />

      <form
        onSubmit={handleSubmit}
        className='sticky bottom-0 inset-x-0 px-2 py-2 space-y-2 mt-4'
      >
        <Input
          placeholder='Ask your question'
          className='w-full'
          value={input}
          onChange={handleInputChange}
        />

        <Button>
          <SendIcon className='h-4 w-4 mr-2' />
          Send
        </Button>

      </form>

    </div>
  )
}

export default ChatComponent