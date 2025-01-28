import { useMeeting, useParticipant } from '@videosdk.live/react-sdk'
import { useRouter } from 'next/navigation'
import React from 'react'
import { FaMicrophone } from 'react-icons/fa'
import { FiCamera } from 'react-icons/fi'
import { IoChatbubblesSharp } from 'react-icons/io5'
import { MdScreenShare } from 'react-icons/md'
import { PiPhoneDisconnectFill } from 'react-icons/pi'
import { TbUserShare } from 'react-icons/tb'

type Props = {
  toggleChat: (param: boolean) => void,
  openChat: boolean,
  participantId:string,
}

export default function BottomMangementBar({ toggleChat, participantId, openChat }: Props) {
  const router = useRouter();

  const handleChatToggle = () => {
    toggleChat(!openChat);
  };

  const handleDisconnect = () => {
    router.push('/');
  };

  const { webcamOn, micOn, screenShareOn } = useParticipant(participantId);



  return (
    <div className="flex justify-evenly items-center gap-3 bg-dark-gray border-1 border-primary-color rounded-lg max-w-xl mx-auto my-8 w-full p-2">
      <div className="flex items-center gap-3">
        <button onClick={handleChatToggle} className={`bg-primary-color p-2 rounded-full transition-all hover:bg-secondary-color hover:scale-90`}>
          <IoChatbubblesSharp className="text-2xl text-white" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <button className="bg-primary-color transition-all hover:bg-secondary-color hover:scale-90 p-2 rounded-full">
          <FiCamera className="text-2xl text-white" />
        </button>

        <button onClick={handleDisconnect} className="bg-red-500 transition-all hover:bg-red-600 hover:scale-90 p-2 rounded-full">
          <PiPhoneDisconnectFill className="text-2xl text-white" />
        </button>

        <button className="bg-primary-color transition-all hover:bg-secondary-color hover:scale-90 p-2 rounded-full">
          <FaMicrophone className="text-2xl text-white" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button className="bg-primary-color p-2 rounded-full transition-all hover:bg-secondary-color hover:scale-90">
          <MdScreenShare className="text-2xl text-white" />
        </button>
        <button className="bg-primary-color p-2 rounded-full transition-all hover:bg-secondary-color hover:scale-90">
          <TbUserShare className="text-2xl text-white" />
        </button>
      </div>
    </div>
  );
}

