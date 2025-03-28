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
    requestToJoin?:any,
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
     },
     readNotification: ()=>void | Promise<void>,
}

function Notification({image, readNotification, requestToJoin, competitionInvitation, competitionData, clubData, clubInvitation, messageObject,notificationId, isRead, receiverId,senderNickname, sentAt, isFriendshipRequest, senderId}: Props) {
 
 
 
  return (
    <>
   {isFriendshipRequest && senderNickname && <FriendshipNotification readNotification={readNotification} isRead={isRead} receiverId={receiverId} notificationId={notificationId} sentAt={sentAt} image={image} nickname={senderNickname} senderId={senderId} />}
   {!isFriendshipRequest && messageObject && <MessageNotification readNotification={readNotification} notificationId={notificationId} messageObject={messageObject}  isRead={isRead} sentAt={sentAt} messageContent={messageObject.content} senderNickname={senderNickname} image={image} senderId={senderId} linkPath={`/chat/${messageObject.chatId}`} isDirectMessage={!competitionInvitation && !clubInvitation} />}
   {clubInvitation && <RequestNotification image={image as string} readNotification={readNotification} notificationId={notificationId} requestToJoin={requestToJoin} clubInvitation={clubInvitation} competitionInvitation={competitionInvitation} clubData={clubData} competitionData={competitionData} senderId={senderId} isRead={isRead} senderNickname={senderNickname} sentAt={sentAt}/> }
      {competitionInvitation && <RequestNotification image={image as string} readNotification={readNotification} notificationId={notificationId} requestToJoin={requestToJoin} clubInvitation={clubInvitation} competitionInvitation={competitionInvitation} clubData={clubData} competitionData={competitionData} senderId={senderId} isRead={isRead} senderNickname={senderNickname} sentAt={sentAt} />}
      {requestToJoin && <RequestNotification image={image as string} readNotification={readNotification} notificationId={notificationId} requestToJoin={requestToJoin} clubInvitation={clubInvitation} competitionInvitation={competitionInvitation} clubData={clubData} competitionData={competitionData} senderId={senderId} isRead={isRead} senderNickname={senderNickname} sentAt={sentAt} />}
    </>
  )
}

export default Notification