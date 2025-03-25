"use client"

import React from 'react'
import { useDropzone } from 'react-dropzone'
import { Input } from './ui/input'
import { Inbox } from 'lucide-react'
import { uploadToS3 } from '@/lib/s3'
import { toast } from 'sonner'
import { config } from '@/config/config'

function FileUpload() {

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    onDrop: async (files) => {
      const file = files[0]
      if (!file || file.size > config.maxFileSizeMB * 1024 * 1024) {
        return toast.error(`Max file size is ${config.maxFileSizeMB} mb`)
      }

      try {
        const data = await uploadToS3(file)

      } catch (error) {
        console.error("@@Debug error uploading to s3", error)
      }
    }
  })

  return (
    <div className='w-full'>
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
    </div>
  )
}

export default FileUpload