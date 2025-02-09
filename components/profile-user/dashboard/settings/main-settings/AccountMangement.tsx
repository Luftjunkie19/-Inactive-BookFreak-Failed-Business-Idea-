import Button from 'components/buttons/Button'
import React from 'react'
import { AiOutlineUserDelete } from 'react-icons/ai'

type Props = {}

function AccountManagement({}: Props) {
  return (
      <div className="flex flex-col gap-1 p-2">
            <p className='text-white text-2xl flex gap-2 items-center'>Delete Account <AiOutlineUserDelete className='text-red-400' /></p>
            <p className='text-gray-400 text-sm max-w-3xl'>You can delete your account, if you don&apros;t feel comfortable anymore to be a member of BookFreak. Your all data, progress, chats will be removed permanently by clicking this button below.</p>
            <Button type='black' additionalClasses='bg-red-400 my-2 w-fit px-2'>Delete Account</Button>
          </div>
  )
}

export default AccountManagement