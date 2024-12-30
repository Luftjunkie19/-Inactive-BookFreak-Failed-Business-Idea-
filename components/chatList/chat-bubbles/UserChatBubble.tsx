import { User } from '@supabase/supabase-js'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import React from 'react'
import AudioMessageCompontent from './AudioMessage'

type Props = {
    item:any,
  user: User,
    usersObjects:any[],
  condition: boolean,
    images?:any[]
}

function UserChatBubble({item, user,usersObjects, condition, images}: Props) {
  return (
    <div key={item.id} className={`chat ${condition ? 'chat-start' : 'chat-end'}`}>
         <div className="chat-image avatar">
           <div className="w-10 rounded-full">
            <Image  width={40} height={60} src={usersObjects.find((userObj)=>userObj.id === item.senderId)?.photoURL} alt='' className='w-10 h-10 rounded-full'/>
           </div>
         </div>
         <div className="chat-header gap-2">
        {JSON.stringify(item)}
           <time className="text-xs opacity-50 text-white">{formatDistanceToNow(new Date(item.sentAt))}</time>
      </div>

  
      
      {item.audioMessagePath ? <>
      <AudioMessageCompontent  audioUrl={item.audioMessagePath} isAudioChatMesage={true} />
      </> : <div className="chat-bubble bg-primary-color max-w-xl w-fit text-white">
        <div className="grid grid-cols-2 gap-1 items-center">
          {images && images.slice(0, 4).map((item, index) => (<div key={item.id}  className='relative object-cover cursor-pointer  w-24 h-24 rounded-lg top-0 left-0'>
            <Image key={new Date(item.date).getTime()} src={item.url} alt='' width={50} height={50} className={`object-cover border border-secondary-color w-24 h-24 rounded-lg`} />
            {index === 3 && images.length > 4 && <div className='w-full h-full rounded-lg absolute top-0 left-0 bg-secondary-color/65 flex flex-col justify-center items-center'>
              <p className='text-white text-lg'>
              +{images.length - 4}
              
              </p>
            </div>}
          </div>))}
        </div>
              
        {item.content}
      </div> }     
     
       </div>
  )
}

export default UserChatBubble