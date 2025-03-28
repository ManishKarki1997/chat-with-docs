import React from 'react'
import Logo from './logo'
import Link from 'next/link'
import { Button } from './ui/button'
import { createClient } from '@/utils/supabase/server'

type Props = {}

async function Header({ }: Props) {

  const client = await createClient()
  const userData = await client.auth.getUser()
  const user = userData.data?.user



  return (
    <header className='flex items-center justify-between shadow-sm w-full flex-1 py-6'>
      <Link href="/">
        <Logo />
      </Link>

      <div className="flex items-center gap-2">
        {
          !user ?
            <>
              <Link href="/sign-up">
                <Button variant="ghost" >Signup</Button>
              </Link>

              <Link href="/sign-in">
                <Button variant="default" >Get Started</Button>
              </Link>
            </>
            :
            <>
              <Link href="/chats">
                <Button variant="default">View Chats</Button>
              </Link>

            </>
        }

      </div>
    </header>
  )
}

export default Header