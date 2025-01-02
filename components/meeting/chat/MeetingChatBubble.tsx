import { getTime } from 'date-fns'
import Image from 'next/image'
import React from 'react'

type Props = {
    isOwner:boolean,
    content:string,
    nickname:string,
    ownerId:string,
    ownerPhotoURL:string,
    timeAdded:Date
}

function MeetingChatBubble({isOwner, content, nickname, ownerId, ownerPhotoURL, timeAdded}: Props) {
  return (
   isOwner ?     <div className="chat chat-start">
   <div className="chat-image avatar">
     <div className="w-10 rounded-full">
       <Image
         width={40}
         height={40}
         alt={ownerId}
         src={ownerPhotoURL} />
     </div>
   </div>
   <div className="chat-header gap-1 flex text-xs line-clamp-1 text-white items-center">
     {nickname}, 
     <time className="text-xs opacity-50">{getTime(timeAdded)}</time>
   </div>
   <div className="chat-bubble bg-primary-color text-sm text-white">{content}</div>
 </div>
 :    <div className="chat chat-end">
 <div className="chat-image avatar">
   <div className="w-10 rounded-full">
     <Image
       width={40}
       height={40}
       alt={ownerId}
       src={ownerPhotoURL} />
   </div>
 </div>
 <div className="chat-header gap-1 flex text-xs line-clamp-1 text-white items-center">
   {nickname}, 
   <time className="text-xs opacity-50">{getTime(timeAdded)}</time>
 </div>
 <div className="chat-bubble bg-primary-color text-sm text-white">{content}</div>
</div>
  )
}

export default MeetingChatBubble