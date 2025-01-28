'use client';

import React, { useState } from 'react'
import TilesView from './Tiles/TilesView'
import BottomMangementBar from './BottomMangementBar';
import MeetingChatBar from './chat/MeetingChatBar';
import { useSearchParams } from 'next/navigation';
import {
  MeetingProvider,
  MeetingConsumer,
  useMeeting,
  useParticipant,
} from "@videosdk.live/react-sdk";
import { useAuthContext } from 'hooks/useAuthContext';
import { useQuery } from '@tanstack/react-query';

type Props = {peerId:string}

function MeetingView({peerId }: Props) {
    const [openChat, setOpenChat] = useState<boolean>(false);

const [micState, setMicState] = useState<boolean>(false);
    const [isScreenShareOn, setIsScreenShareOn] = useState<boolean>(false);
    const [isCameraOn, setIsCameraOn] = useState<boolean>(true);

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
    
      const { join, participants } = useMeeting({
    //callback for when meeting is joined successfully
    onMeetingJoined: () => {
   
    },
    //callback for when meeting is left
    onMeetingLeft: () => {
      
    },
  });

    


  return (

      <>
          {user && document && document.data && !isLoading ?
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
              }} token={process.env.NEXT_PUBLIC_TOKEN_VIDEO_SDK as string}>
                    <div className="w-full flex flex-col h-full justify-between">
        <TilesView/>

<BottomMangementBar participantId={user.id} toggleChat={setOpenChat} openChat={openChat}/>

    </div>
              <MeetingChatBar openChat={openChat} />
          </MeetingProvider>
              : <div>Loading...</div>
          }
          
          
    
      </>
       
  )
}

export default MeetingView