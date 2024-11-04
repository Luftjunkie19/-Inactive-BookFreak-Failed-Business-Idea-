import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    competitionInvitation?:{
     invitationMessageContent:string,
     invitationLinkToCompetition:string
    }
    competitionData?:any
    senderId:string
    clubData?:any
    clubInvitation?:{
      invitationMessageContent:string
      invitationLinkToClub:string
    }
}

function RequestNotification({}: Props) {
  return (
    <Link onClick={readNotification} href={linkPath} className=" transition-all duration-500 hover:bg-secondary-color cursor-pointer flex gap-3 items-center justify-between text-white w-full p-1 rounded-lg">
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

export default RequestNotification