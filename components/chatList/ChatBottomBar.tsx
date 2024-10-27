import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from 'components/buttons/Button'
import React, { useState } from 'react'
import { FaImage, FaMicrophone, FaPaperPlane } from 'react-icons/fa6'

type Props = {isAllowedToType:boolean | any, userId?:string, chatId:string}

function ChatBottomBar({ isAllowedToType, userId, chatId}: Props) {
  const [messageContent, setMessageContent] = useState<string>();
  const queryClient = useQueryClient();

 const {mutateAsync} = useMutation({
    'mutationFn': async () => {
   await fetch('/api/supabase/message/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data:{sentAt: new Date(), senderId: userId, content: messageContent, chatId }}),
   });
     setMessageContent('');
   }, onSuccess: async () => {
     await queryClient.refetchQueries({ queryKey: ['userChat'], type: 'active' });
  }})

  return (
    <div className="w-full px-2 py-3 flex justify-between text-white items-center bg-primary-color ">
    <div className="flex gap-1 items-center text-xl">
      <Button disableState={Boolean(isAllowedToType) || typeof isAllowedToType !== 'undefined' ? true : false} type='transparent'><FaImage /></Button>
      <Button disableState={Boolean(isAllowedToType) ? true : false} type='transparent'><FaMicrophone /></Button>
    </div>
    <input onChange={(e)=>setMessageContent(e.target.value)} disabled={Boolean(isAllowedToType) ? true : false } className='max-w-3xl h-fit overflow-y-auto w-full bg-transparent text-white p-2 outline-none border-none' placeholder='Enter message...' />
      <Button onClick={mutateAsync} disableState={Boolean(isAllowedToType) ? true : false } type='transparent' additionalClasses='text-2xl text-white'><FaPaperPlane /></Button>
  </div>
  )
}

export default ChatBottomBar