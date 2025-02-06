'use client';
import Image from 'next/image'
import React, { use } from 'react'
import image from '../../../assets/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
import { FaUser, FaUsers } from 'react-icons/fa6'
import { useAuthContext } from 'hooks/useAuthContext'
import { useCheckPathname } from 'hooks/useCheckPathname';
import BarFriendOverview from '../content-elements/BarFriendOverview';
import { useQuery } from '@tanstack/react-query'
import { FaRegFrownOpen } from 'react-icons/fa';
import FriendSkeleton from 'components/skeletons/right-bar/default/FriendSkeleton';

type Props = {}

 function DefaultRightBar({ }: Props) {
    const { includesElements } = useCheckPathname();
  const { user } = useAuthContext();
  
    const { data:document, isLoading } = useQuery({
    queryKey: ['friendsSideBar'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user!.id, include: {
          friends: {
            'where':{'inviteeId':user!.id},
            include: {
              Invitor: true,
              invitee:true,
            }
          }, friendsStarted: {
        'where':{'inviterUserId':user!.id},
            include: {
              Invitor: true,
              invitee:true,
      }}}}),
    }).then((res)=>res.json())
  })

   //sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)]


    return (
        <div className={` ${!user || includesElements('/meeting') || includesElements('/search') ||  includesElements('/competition/') || includesElements('/club') || includesElements('/signup') || includesElements('/login') || includesElements('form/') || includesElements('/chat') || includesElements('/test/') || includesElements('/settings') || includesElements('/profile/dashboard') ? 'hidden' : 'sm:hidden lg:flex flex-col'}   min-w-32 lg:max-w-40 xl:max-w-52 2xl:max-w-72  w-full gap-3 border-l-2  border-primary-color`}>
          <p className='text-xl p-2 text-white flex items-center gap-2'><FaUsers className='text-2xl text-primary-color' />  Friends </p>
        <div className="flex flex-col gap-3 overflow-y-auto">
     {isLoading && <>
        <FriendSkeleton />
        <FriendSkeleton />
        <FriendSkeleton />
        <FriendSkeleton />
        <FriendSkeleton />
             <FriendSkeleton/>
      </>}

          {document && !isLoading && user && document.data && [...document.data.friends, ...document.data.friendsStarted].length > 0 ? [...document.data.friends, ...document.data.friendsStarted].map((item) => (
              <BarFriendOverview userId={item.inviteeId === user.id ? item.Invitor.id : item.invitee.id} key={item.id} image={item.inviteeId === user.id ? item.Invitor.photoURL : item.invitee.photoURL} username={item.inviteeId === user.id ? item.Invitor.nickname : item.invitee.nickname} />
          )) : <div className={`flex flex-col p-2 items-center gap-2 ${isLoading && 'hidden'}`}>
              <FaRegFrownOpen className='text-primary-color text-7xl' />
              <p className='text-white text-center 2xl:text-base xl:text-sm font-light'>You have no friends yet !</p>
              
          </div>}
          
          </div>
    </div>
  )
}

export default DefaultRightBar