"use client"

import React from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

type Props = {
  children: React.ReactNode;
}

const queryClient = new QueryClient()

export default function Providers({ children }: Props) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}