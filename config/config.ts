import dotenv from 'dotenv'

dotenv.config()

export const config = {
  maxFileSizeMB: process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB ? Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB) : 10
}