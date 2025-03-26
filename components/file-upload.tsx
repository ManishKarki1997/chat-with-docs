"use client"

import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Input } from './ui/input'
import { Inbox, Loader2Icon } from 'lucide-react'
import { uploadToS3 } from '@/lib/s3'
import { toast } from 'sonner'
import { config } from '@/config/config'
import { useMutation } from '@tanstack/react-query'
import axios from "axios"
import { useRouter } from 'next/navigation'

function FileUpload() {

  const [isUploading, setIsUploading] = React.useState(false)

  const router = useRouter()

  const createChatMutation = useMutation({
    mutationFn: async (payload: { fileName: string, fileKey: string }) => {
      const response = await axios.post('/api/create-chat', payload)
      return response.data
    },
    onSuccess: ({ chatId }: { chatId: number }) => {
      toast.success("Chat created successfully", { id: "creating-chat" })
      setIsUploading(false)

      if (chatId) {
        router.push(`/chats/${chatId}`)
      }
    },
    onError: () => {
      toast.error("Couldn't create chat", { id: "creating-chat" })
      setIsUploading(false)
    },
  })

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: async (files) => {
      if (createChatMutation.isPending || isUploading) {
        return toast.error("Please wait while the previous action completes")
      }

      setIsUploading(true)

      const file = files[0]
      if (!file || file.size > config.maxFileSizeMB * 1024 * 1024) {
        setIsUploading(false)
        return toast.error(`Max file size is ${config.maxFileSizeMB} mb`)
      }

      try {
        const data = await uploadToS3(file)
        if (!data?.fileKey || !data?.fileName) {
          setIsUploading(false)
          toast.error("Couldn't upload your document")
          return
        }

        toast.loading("Creating chat", { id: "creating-chat" })
        createChatMutation.mutate(data)

      } catch (error) {
        setIsUploading(false)
        console.error("@@Debug error uploading to s3", error)
      }
    }
  })

  return (
    <div className='w-full'>
      {
        isUploading ?
          <div className='flex items-center gap-2 border border-dashed border-primary rounded px-8 py-8 cursor-pointer'>
            <Loader2Icon className='animate-spin' />
            <p>Uploading Document</p>
          </div>
          :
          <div
            {...getRootProps({
              className: "border border-dashed border-primary rounded px-8 py-8 cursor-pointer"
            })}>
            <input  {...getInputProps()} />

            <div className='text-center flex flex-col items-center gap-2'>
              <Inbox className='w-8 h-8' />
              <p className='text-sm font-medium'>Drop your pdf files here</p>
            </div>
          </div>
      }
    </div>
  )
}

export default FileUpload