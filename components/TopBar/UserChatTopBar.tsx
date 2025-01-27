import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Button from 'components/buttons/Button';
import { IoVideocam } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import { useAuthContext } from 'hooks/useAuthContext';
import { connect } from "twilio-video";
import { io, Socket } from 'socket.io-client';
const { isSupported } = require('twilio-video');


type Props = {chatUsers:any[]}

function UserChatTopBar({chatUsers}: Props) {
  const {chatId}=useParams();
  const { user } = useAuthContext();
  const router=useRouter();
  

  const handleCall = async () => {    
    try {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
    method: "POST",
    headers: {
      authorization: `${process.env.NEXT_PUBLIC_TOKEN_VIDEO_SDK}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  //Destructuring the roomId from the response
  const { roomId } = await res.json();

      console.log(roomId);
     
      router.push(`/meeting/${roomId}`);

     
     
   } catch (err) {
     console.log(err);
     }
  
  }
  




  return (
    <div className=' bg-dark-gray/70 w-full py-2 px-3 flex items-center'>
      <div className="flex-1 flex items-center gap-2">

     
        <Image src={chatUsers.find((chatUser)=> chatUser.id !== user!.id) && chatUsers.find((chatUser)=> chatUser.id !== user!.id).photoURL} alt='' height={50} className='w-8 h-8 rounded-full' width={50}/>

        <div className="flex flex-col text-white">
            <p className='text-sm'>{chatUsers.find((chatUser)=> chatUser.id !== user!.id) && chatUsers.find((chatUser)=> chatUser.id !== user!.id).nickname}</p>
                  <p className='text-xs font-light'>Recent Activity time</p>
        </div>
    </div>
            <div className="flex items-center gap-3">
                <Button onClick={handleCall}  additionalClasses='text-white text-2xl' type='transparent'>
                    <IoVideocam/>
                </Button>
                <Button additionalClasses='text-white text-2xl' type='transparent'>
                    <BsThreeDots />
                </Button>
            </div>
        </div>
  )
}

export default UserChatTopBar