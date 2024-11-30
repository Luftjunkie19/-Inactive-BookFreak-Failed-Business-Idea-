
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { formatDistanceToNow } from 'date-fns'
import { useAuthContext } from 'hooks/useAuthContext'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaImage, FaRankingStar, FaUserShield } from 'react-icons/fa6'

type Props = {
    competitionInvitation?:{
     invitationMessageContent:string,
     invitationLinkToCompetition:string,
    }, notificationId:string,
    readNotification:()=>void | Promise<void>,
    requestToJoin?:any
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

function RequestNotification({competitionData, readNotification, notificationId, requestToJoin, clubData,isRead, sentAt, competitionInvitation, clubInvitation, senderId, senderNickname }: Props) {

 
  return (
    <Link onClick={readNotification} href={requestToJoin.competition ? `/competition/${requestToJoin.competition.id}/settings/participants` : requestToJoin.club ? `/club/${requestToJoin.club.id}/settings/participants` : ''} className=" transition-all duration-500 hover:bg-secondary-color cursor-pointer flex gap-3 items-center justify-between text-white w-full p-1 rounded-lg">
  {competitionData || clubData &&  <Image src={competitionData.competitionLogo || clubData.clubLogo} alt='' width={50} height={50} className='w-12 h-12 object-cover rounded-full'/>}
  {requestToJoin && requestToJoin.competition &&   <Image src={requestToJoin.competition.competitionLogo} alt='' width={50} height={50} className='w-12 h-12 object-cover rounded-full'/>}
    <div className="flex flex-col self-start flex-1 gap-1">
      <div className="flex gap-2 w-full justify-between  items-center py-1">
            <span className='font-bold'>{senderNickname}</span>
            {requestToJoin.competition &&  <>
              <p className=' text-xs text-nowrap p-1 rounded-full bg-primary-color flex items-center'><FaRankingStar /> Request</p>
            </>}
            {requestToJoin.club && <>
              <p className=' text-xs text-nowrap flex items-center gap-1'><FaUserShield className='text-primary-color' /> Request</p>
            </>}
           
      </div>
            
<div className="flex flex-col w-full ">
            <p className={`line-clamp-1 ${!isRead ? 'font-bold' : ''} text-xs text-nowrap items-center flex gap-2`}>{clubInvitation?.invitationMessageContent || competitionInvitation?.invitationMessageContent || requestToJoin ? `${`Request to ${requestToJoin.club ? requestToJoin.club.clubName : requestToJoin.competition ? requestToJoin.competition.competitionName : ''}`.slice(0, 30)}...` : ''  }</p>
            <p className="text-xs self-end">{formatDistanceToNow(sentAt, {addSuffix: true})}</p>
</div>
     
    </div>
  </Link>
  )
}

export default RequestNotification