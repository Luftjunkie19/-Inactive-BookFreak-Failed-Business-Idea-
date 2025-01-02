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
    openChat:boolean,
}

function BottomMangementBar({toggleChat, openChat}: Props) {

  


  const router= useRouter();
  return (
  <div className="flex justify-between items-center gap-3 bg-dark-gray border-x-1 border-primary-color rounded-t-lg border-t-1 w-full h-[4.5rem] px-4">
  
  <div className="flex items-center gap-3">
        <button onClick={() => toggleChat(!openChat)} className={`bg-primary-color p-2 rounded-full transition-all hover:bg-secondary-color hover:scale-90`}>
          <IoChatbubblesSharp className="text-2xl text-white" />
        </button>
      </div>
  
      <div className="flex items-center gap-3 self-center">
        <button className="bg-primary-color transition-all hover:bg-secondary-color hover:scale-90 p-2 rounded-full">
          <FiCamera className="text-2xl text-white" /> 
      {/* <FiCameraOff className="text-2xl text-white" /> */}
        </button>
        
        <button onClick={() => {
          router.push('/');
        }} className="bg-red-500 transition-all hover:bg-red-600 hover:scale-90 p-2 rounded-full">
          <PiPhoneDisconnectFill className="text-2xl text-white" />
        </button>
        
        <button className="bg-primary-color transition-all hover:bg-secondary-color hover:scale-90 p-2 rounded-full">
          <FaMicrophone className="text-2xl text-white" />
          {/* <FaMicrophoneOff className="text-2xl text-white" /> */}
        </button>
  
      </div>
  
      <div className="flex items-center gap-3 ">
        <button className="bg-primary-color p-2 rounded-full transition-all hover:bg-secondary-color hover:scale-90">
          <MdScreenShare className="text-2xl text-white" />
        </button>
        <button className="bg-primary-color p-2 rounded-full transition-all hover:bg-secondary-color hover:scale-90">
          <TbUserShare className="text-2xl text-white" />
        </button>
      </div>
  
  </div>
  )
}

export default BottomMangementBar