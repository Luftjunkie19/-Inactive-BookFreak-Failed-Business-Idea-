import { useQueryClient } from '@tanstack/react-query'
import Button from 'components/buttons/Button'
import { formatDistanceToNow } from 'date-fns'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaUserFriends } from 'react-icons/fa'
import { FaCheck } from 'react-icons/fa6'
import { MdCancel } from 'react-icons/md'

type Props = {
    image:string | StaticImageData,
    nickname:string,
    senderId:string,
    sentAt:Date,
    notificationId:string,
    receiverId:string,
    isRead:boolean,
    readNotification: ()=>void | Promise<void>,
}


function FriendshipNotification({ image, isRead, notificationId, sentAt, receiverId, nickname, senderId, readNotification }: Props) {
  const queryClient=useQueryClient();

  const acceptFriendShipRequest = async () => {
    console.log(notificationId);
    try {
    await readNotification();
      
      const promise2 = await fetch('/api/supabase/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          where: {
            id: senderId
          },
          data: {
            friendsStarted: { create: { 'inviteeId': receiverId } },
          }
        })
      })

      console.log(await promise2.json());
      

      await Promise.all([
        queryClient.invalidateQueries({ 'queryKey': ['profile', senderId], type: 'all' }),
        queryClient.invalidateQueries({ 'queryKey': ['profile', receiverId], type: 'all' }),
           queryClient.invalidateQueries({ queryKey: ['userFriends'], type: 'all' })
      ]);
    
    }catch(err){
      console.log(err);
    }
   
  };

  const rejectFriendshipRequest = async () => {
try{

  await readNotification();

}catch(err){
  console.log(err);
}

 
  };


  return (
    <Link className={`${!isRead ? 'bg-primary-color/20' : ''} transition-all duration-500 hover:bg-secondary-color cursor-pointer flex gap-3 items-center justify-between text-white w-full p-1 rounded-lg`} href={`/profile/${senderId}`}>
    <Image src={image} alt='' width={50} height={50} className='w-12 h-12 object-cover rounded-full'/>
    <div className="flex flex-col self-start flex-1 gap-1">
      <p className='line-clamp-1 text-sm flex w-full justify-between items-center'>{nickname} <span className='text-xs bg-primary-color/40 text-opacity-50 py-1 px-2  rounded-full flex gap-1 items-center'>Request <FaUserFriends /></span></p>    
  <div className="flex justify-between w-full">
    {!isRead && 
  <div className="flex items-center gap-2">
      <Button onClick={acceptFriendShipRequest} type='black' additionalClasses='text-sm hover:bg-green-400 transition-all duration-500 p-0 bg-primary-color'>Confirm</Button>
        <Button onClick={rejectFriendshipRequest} type='black' additionalClasses='text-sm hover:bg-red-400 transition-all duration-500 bg-secondary-color p-0'>Reject</Button>
      </div>
    }
      <p className="text-xs self-end">{formatDistanceToNow(sentAt, {addSuffix: true})}</p>
  </div>
    </div>
  </Link>
  )
}

export default FriendshipNotification