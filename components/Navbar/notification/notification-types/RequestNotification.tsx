import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaImage } from 'react-icons/fa6'

type Props = {
    competitionInvitation?:{
     invitationMessageContent:string,
     invitationLinkToCompetition:string
    }
    competitionData?:any
    isRead:boolean
    senderId:string
    senderNickname?:string
    sentAt:Date
    clubData?:any
    clubInvitation?:{
      invitationMessageContent:string
      invitationLinkToClub:string
    }
}

function RequestNotification({competitionData, clubData,isRead, sentAt, competitionInvitation, clubInvitation, senderId, senderNickname }: Props) {
  return (
    <Link href={''} className=" transition-all duration-500 hover:bg-secondary-color cursor-pointer flex gap-3 items-center justify-between text-white w-full p-1 rounded-lg">
    <Image src={competitionData.competitionLogo || clubData.clubLogo} alt='' width={50} height={50} className='w-12 h-12 object-cover rounded-full'/>
    <div className="flex flex-col self-start flex-1 gap-1">
  
            <span className='font-bold'>{senderNickname}</span>
<div className="flex justify-between w-full items-center">
            <p className={`line-clamp-1 ${!isRead ? 'font-bold' : ''} text-sm items-center flex gap-2`}>{clubInvitation?.invitationMessageContent || competitionInvitation?.invitationMessageContent}</p>
            <p className="text-xs self-end">{formatDistanceToNow(sentAt, {addSuffix: true})}</p>
</div>
     
    </div>
  </Link>
  )
}

export default RequestNotification