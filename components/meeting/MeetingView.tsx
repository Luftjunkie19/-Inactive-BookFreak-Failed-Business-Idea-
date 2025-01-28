'use client';

import React, { useEffect, useState } from 'react'
import TilesView from './Tiles/TilesView'
import BottomMangementBar from './BottomMangementBar';
import MeetingChatBar from './chat/MeetingChatBar';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
  useMediaDevice,
} from "@videosdk.live/react-sdk";
import { useAuthContext } from 'hooks/useAuthContext';
import { useQuery } from '@tanstack/react-query';
import { Permission } from '@videosdk.live/react-sdk/dist/types/permission';
import { DevicesMap } from 'components/TopBar/UserChatTopBar';
import ModalPreSetup from './ModalPreSetup';
import MeetingPartcipantView from './MeetingPartcipantView';

type Props = {peerId:string}

function MeetingView({peerId }: Props) {

  const router = useRouter();

const [micState, setMicState] = useState<boolean>(false);
    const [isScreenShareOn, setIsScreenShareOn] = useState<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false);

  const [isSetupOpen, setIsSetupOpen] = useState(true);

  const [hasJoined, setHasJoined] = useState<boolean>(false);
  

  

    const searchParams = useSearchParams();

  
    const { user } = useAuthContext();

    const { data: document, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user!.id, include: {
          recensions: { include: { user: true, book: true } },
          notifications: true,
          'BookLover': true,
          'Comment': true,
          'Result': true,
          'addedBooks': true,
          'bookShelfs': true,
          'ReadingProgress': {
            include: {
            book:true,
            }
          },
         blockerUser:true,
          blockedUsers:true,
          friendsStarted: true,
          'chats':{include:{'users':{include:true}}},
          friends: true,
          'Post':{ 'include': {
                        'owner': true,
                        'lovers': true,
                        hashtags: true,
            'comments': true,
                        viewers:true,
                        
            }},
          Member: {
            include: {  
              'Club': {
                include: {
                  'members': true,
                  requirements: true,
                },
              },
              Competition: {
                include: {
                  'members': true,
                  rules: true,
                }
              }
            }
          },
        }
      })
    }).then((res) => res.json())
    });
    




    


  return (

      <>
          {user && peerId && document && document.data && !isLoading &&
                <MeetingProvider config={{
          name: document.data.nickname,
          'meetingId': peerId,
        
          'metaData': {
              nickname: document.data.nickname,
              userId: document.data.id,
              photoURL:document.data.photoURL
          },
          'webcamEnabled': isCameraOn,
          'micEnabled': micState,
          'debugMode': true,
          'participantId': document.data.id,
        }} token={process.env.NEXT_PUBLIC_TOKEN_VIDEO_SDK as string} joinWithoutUserInteraction={false}>
          
          {!hasJoined ? <ModalPreSetup isCameraOn={isCameraOn} setIsCameraOn={setIsCameraOn} micState={micState} handleCall={ () => {
            setHasJoined(true);

}} setMicState={setMicState} isSetupOpen={isSetupOpen} /> : <MeetingPartcipantView participantId={user.id} />}



        
          </MeetingProvider>
              
           
          }
          
          
    
      </>
       
  )
}

export default MeetingView