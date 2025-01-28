'use client';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Button from 'components/buttons/Button';
import { IoClose, IoVideocam } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import { useAuthContext } from 'hooks/useAuthContext';
import { connect } from "twilio-video";
import { io, Socket } from 'socket.io-client';
import { CameraDeviceInfo, MicrophoneDeviceInfo, useMediaDevice } from '@videosdk.live/react-sdk';
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
  const [devices, setDevices] = useState<DevicesMap>({
    cameras: [],
    microphones: [],
    speakers: [],
  });
  const [isSetupOpen, setIsSetupOpen] = useState(false);
const { checkPermissions, requestPermission, getCameras, getMicrophones, getDevices, getPlaybackDevices } = useMediaDevice({onDeviceChanged(devices) {
  console.log(devices);
},});
  
  const checkMediaPermission = async () => {
    try {
     
      const permissionsAudioVideoCheck =await checkPermissions('audio_video' as Permission); //For getting video permissions

      return permissionsAudioVideoCheck;
    } catch (err) {
      console.log(err);
    }
  };

  const loadDevices = async () => {
    try {
      const permissions = await checkMediaPermission();
      
      if (!permissions?.get('audio') || !permissions?.get('video')) { 
       await requestPermission('audio_video' as Permission);
      }

      const promises = await Promise.all([getCameras(),
      getMicrophones(),
      getPlaybackDevices()]);
   
       setDevices({
         cameras: promises[0],
         microphones: promises[1],
         speakers: promises[2],
       });
      
    
  }catch(err){
      console.log(err);
  }
    
  }



  const requestPermissions = async () => {
    try {

      await Promise.all([
      requestPermission('audio' as Permission),
   requestPermission('video' as Permission)
   ]);

    }catch(err){
      console.log(err);
    }
  }

  const openSetup = async () => {
    
    await loadDevices();
    setIsSetupOpen(true);
}

  const handleCall = async () => {    
    try {

      const hasPermissions = await checkMediaPermission();
    
      if(!hasPermissions?.get('audio') || !hasPermissions?.get('video')){
        await requestPermissions();
      }
      
    
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

      await checkMediaPermission();
      
      router.push(`/meeting/${roomId}`);

     
     
   } catch (err) {
     console.log(err);
     }
  
  }







  return (<>
    <div className=' bg-dark-gray/70 w-full py-2 px-3 flex items-center'>
      <div className="flex-1 flex items-center gap-2">

     
        <Image src={chatUsers.find((chatUser)=> chatUser.id !== user!.id) && chatUsers.find((chatUser)=> chatUser.id !== user!.id).photoURL} alt='' height={50} className='w-8 h-8 rounded-full' width={50}/>

        <div className="flex flex-col text-white">
            <p className='text-sm'>{chatUsers.find((chatUser)=> chatUser.id !== user!.id) && chatUsers.find((chatUser)=> chatUser.id !== user!.id).nickname}</p>
                  <p className='text-xs font-light'>Recent Activity time</p>
        </div>
    </div>
            <div className="flex items-center gap-3">
                <Button onClick={openSetup}  additionalClasses='text-white text-2xl' type='transparent'>
                    <IoVideocam/>
                </Button>
                <Button additionalClasses='text-white text-2xl' type='transparent'>
                    <BsThreeDots />
                </Button>
            </div>
    </div>


    <ModalPreSetup handleCall={handleCall} onClose={() => {
      setIsSetupOpen(false);
    }} isSetupOpen={isSetupOpen} devices={devices}  />
    </>
  )
}

export default UserChatTopBar