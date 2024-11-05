import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'
import FriendshipNotification from './notification-types/FriendshipNotification'
import MessageNotification from './notification-types/MessageNotification'
import RequestNotification from './notification-types/RequestNotification'

type Props = {
    image:string | StaticImageData,
    isFriendshipRequest:boolean,
    senderId:string,
    sentAt:Date,
    notificationId:string,
    senderNickname?:string,
    receiverId:string,
    isRead:boolean,
    messageObject?: {
    chatId:string,
    content:string,
    isSentImages:boolean,
    },
    competitionInvitation?:{
      invitationMessageContent:string,
      invitationLinkToCompetition:string
     },
     competitionData?:any
     clubData?:any
     clubInvitation?:{
       invitationMessageContent:string
       invitationLinkToClub:string
     }
}

function Notification({image, competitionInvitation, competitionData, clubData, clubInvitation, messageObject,notificationId, isRead, receiverId,senderNickname, sentAt, isFriendshipRequest, senderId}: Props) {
  return (
   <>
   {isFriendshipRequest && senderNickname && <FriendshipNotification isRead={isRead} receiverId={receiverId} notificationId={notificationId} sentAt={sentAt} image={image} nickname={senderNickname} senderId={senderId} />}
   {!isFriendshipRequest && messageObject && <MessageNotification notificationId={notificationId} messageObject={messageObject}  isRead={isRead} sentAt={sentAt} messageContent={messageObject.content} senderNickname={senderNickname} image={image} senderId={senderId} linkPath={`/chat/${messageObject.chatId}`} isDirectMessage={!competitionInvitation && !clubInvitation} />}
   {(clubInvitation || competitionInvitation)  && <RequestNotification clubInvitation={clubInvitation} competitionInvitation={competitionInvitation} clubData={clubData} competitionData={competitionData} senderId={senderId} isRead={false} senderNickname={senderNickname} sentAt={sentAt}/> }
   </>
  )
}

export default Notification