'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Button from 'components/buttons/Button';
import { IoClose, IoVideocam } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import { useAuthContext } from 'hooks/useAuthContext';
import { CameraDeviceInfo, MicrophoneDeviceInfo, useMediaDevice, useMeeting } from '@videosdk.live/react-sdk';
import { Permission } from '@videosdk.live/react-sdk/dist/types/permission';
import { PlaybackDeviceInfo } from '@videosdk.live/react-sdk/dist/types/deviceInfo';
import { FaMicrophone } from 'react-icons/fa6';
import PreSetupDropDown from 'components/meeting/PreSetupDropDown';
import ModalPreSetup from 'components/meeting/ModalPreSetup';




type Props = {chatUsers:any[]}

export interface DevicesMap{
  cameras: Array<CameraDeviceInfo>,
  microphones: Array<MicrophoneDeviceInfo>,
  speakers: Array<PlaybackDeviceInfo>
}

function UserChatTopBar({chatUsers}: Props) {
  const {chatId}=useParams();
  const { user } = useAuthContext();
  const router = useRouter();


 





  return (<>
    <div className=' bg-dark-gray/70 w-full py-2 px-3 flex items-center'>
      <div className="flex-1 flex items-center gap-2">

     
        <Image src={chatUsers.find((chatUser)=> chatUser.id !== user!.id) && chatUsers.find((chatUser)=> chatUser.id !== user!.id).photoURL} alt='' height={50} className='w-8 h-8 border border-primary-color rounded-full' width={50}/>

        <div className="flex flex-col text-white">
            <p className='text-sm'>{chatUsers.find((chatUser)=> chatUser.id !== user!.id) && chatUsers.find((chatUser)=> chatUser.id !== user!.id).nickname}</p>
                  <p className='text-xs font-light'>Recent Activity time</p>
        </div>
    </div>
            <div className="flex items-center gap-3">
                <Button  additionalClasses='text-white text-2xl' type='transparent'>
                    <IoVideocam/>
                </Button>
                <Button additionalClasses='text-white text-2xl' type='transparent'>
                    <BsThreeDots />
                </Button>
            </div>
    </div>


    </>
  )
}

export default UserChatTopBar