import { User } from '@supabase/supabase-js'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import React from 'react'

type Props = {
    item:any,
  user: User,
    usersObjects:any[],
    condition:boolean
}

function UserChatBubble({item, user,usersObjects, condition}: Props) {
  return (
    <div className={`chat ${condition ? 'chat-start' : 'chat-end'}`}>
         <div className="chat-image avatar">
           <div className="w-10 rounded-full">
            <Image width={40} height={60} src={usersObjects.find((userObj)=>userObj.id === item.senderId)?.photoURL} alt='' className='w-10 h-10 rounded-full'/>
           </div>
         </div>
         <div className="chat-header gap-2">
           {usersObjects.find((userObj)=>userObj.id === item.senderId)!.nickname}, {' '}
           <time className="text-xs opacity-50 text-white">{formatDistanceToNow(new Date(item.sentAt))}</time>
         </div>
         <div className="chat-bubble bg-primary-color text-white">{item.content.startsWith('https://firebasestorage.') ? <Image src={item.content} className='max-w-sm w-full min-h-32 max-h-48 rounded-lg' width={60} height={60} alt=''/>: item.content}</div>      
       </div>
  )
}

export default UserChatBubble