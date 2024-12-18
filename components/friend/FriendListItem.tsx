import Button from 'components/buttons/Button'
import Image from 'next/image'
import React from 'react'
import { IoPersonRemoveSharp } from 'react-icons/io5'

type Props = {id:string, nickname:string, photoURL:string}

function FriendListItem({id, nickname, photoURL}: Props) {
  return (
      <div className='flex transition-all w-full hover:scale-[0.97] hover:shadow-md cursor-pointer p-1 rounded-lg hover:bg-secondary-color/60 items-center gap-2 justify-between' key={id}>
          <div className="flex items-center gap-2">
               <Image alt='' src={photoURL} width={60} height={60} className='w-10 h-10 rounded-full' />
          <div>{nickname}</div>
          </div>
          <div className="flex gap-2 items-center">
              <Button type='transparent' additionalClasses='text-red-400 text-xl'>
                  <IoPersonRemoveSharp/>
              </Button>
          </div>
    </div>
  )
}

export default FriendListItem