"use client"

import axios from 'axios';
import React from 'react'
import { Button } from './ui/button';
import { DiamondIcon } from 'lucide-react';

type Props = {
  isPro: boolean;
}

function SubscriptionButton({ isPro }: Props) {

  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubscription = async () => {
    if (isLoading) return


    try {
      setIsLoading(true)

      const response = await axios.get("/api/stripe")
      window.location.href = response.data.url

    } catch (err) {
      console.error("Error", err)
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      disabled={isLoading}
      onClick={handleSubscription}
    >
      <DiamondIcon className='mr-2 h-4 w-4' />
      {
        isPro ? "Manage Subscriptions" : "Get Pro"
      }
    </Button>
  )
}

export default SubscriptionButton