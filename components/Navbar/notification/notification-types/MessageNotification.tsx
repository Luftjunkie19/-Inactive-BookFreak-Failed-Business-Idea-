import { formatDistanceToNow } from 'date-fns'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaImage } from 'react-icons/fa6'

type Props = {
    image:string | StaticImageData
    notificationContent?:string
    senderId:string
    linkPath:string
    isDirectMessage:boolean
    messageContent?:string
    senderNickname?:string
    isRead:boolean
    sentAt:Date,
    notificationId:string
    messageObject: {
      chatId:string,
      content:string,
      isSentImages:boolean,
      linkToChat?:string
    },
    readNotification: ()=>void | Promise<void>,
}

function MessageNotification({linkPath, readNotification, notificationId, messageObject, sentAt, isRead, image, senderNickname, notificationContent, isDirectMessage, senderId, messageContent}: Props) {



  return (
    <Link onClick={readNotification} href={messageObject.linkToChat || linkPath} className=" transition-all duration-500 hover:bg-secondary-color cursor-pointer flex gap-3 items-center justify-between text-white w-full p-1 rounded-lg">
    <Image src={image} alt='' width={50} height={50} className='w-12 h-12 object-cover rounded-full'/>
    <div className="flex flex-col self-start flex-1 gap-1">
        {isDirectMessage ? <>
          
            <span className='font-bold'>{senderNickname}</span>
<div className="flex justify-between w-full items-center">
            <p className={`line-clamp-1 ${!isRead ? 'font-bold' : ''} text-sm items-center flex gap-2`}>{messageObject.isSentImages ? <FaImage className='text-primary-color '/> : ''} {messageContent} {messageObject.isSentImages ? `${messageObject.content === '1' ? 'image' : 'images'}` : ''}</p>
            <p className="text-xs self-end">{formatDistanceToNow(sentAt, {addSuffix: true})}</p>
</div>
        </> :  <p className='line-clamp-3 text-sm'>{notificationContent && notificationContent}</p>}
       
    </div>
  </Link>
  )
}

export default MessageNotification