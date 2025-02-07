'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'hooks/useAuthContext';
import React from 'react'
import Rankings from './Rankings';
import FriendsSection from './FriendsSection';
import BlockedUsers from './BlockedUsers';

type Props = {}

function FriendsDashboardDisplay({}: Props) {
const {user}=useAuthContext();

  const { data: document } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id:user!.id, include:{
        'recensions':{'include':{'book':true}},
        'ReadingProgress':{orderBy:{'startTime':'asc'}}, 
        'notifications': {
          'include': {
            sender: {
              include: {
               ReadingProgress:true,
            }},
            receiver:true,
          }
        },
        friendsStarted: {
          'include': {
            invitee: {
              'include': {
                ReadingProgress:true,

              }
            },
            Invitor: {
              'include': {
                ReadingProgress:true,

              }
            },
          }
        },
        friends: {
          'include': {
            invitee: {
              'include': {
                ReadingProgress:true,

              }
            },
            Invitor: {
              'include': {
                ReadingProgress:true,

              }
            },
          
          }
        },
        blockedUsers:{
          where:{
            blockedBy:user!.id
          },
          include:{
              blockedUser: true,
            blockerUser:true,
          }
        },
          blockerUser:{
          where:{
            blockedBy:user!.id
          },
          include:{
            blockedUser: true,
            blockerUser:true,
          }
        },

       }}),
    }).then((res) => res.json())
  });


  return (
      <div className='sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] flex flex-col gap-2 w-full overflow-y-auto'>
          <Rankings document={document} user={user} />
          <FriendsSection document={document} user={user} />
          <BlockedUsers user={user} document={document}  />
          
    </div>
  )
}

export default FriendsDashboardDisplay