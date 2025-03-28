import React from 'react'

type Props = {}

function Logo({ }: Props) {
  return (
    <div className='flex items-center px-2  text-lg'>
      <h2 className='text-orange-500 '>Chat</h2>
      <h2 className='font-bold text-purple-600 uppercase'>Docs</h2>
    </div>
  )
}

export default Logo