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

type Props = {}

 function DefaultRightBar({ }: Props) {
    const { includesElements } = useCheckPathname();
  const { user } = useAuthContext();
  
    const { data:document } = useQuery({
    queryKey: ['friendsSideBar'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user!.id, include: {
          friends: true, friendsStarted: {
            include: {
              Invitor: true,
              invitee:true,
      }}}}),
    }).then((res)=>res.json())
  })



    return (
        <div className={` ${!user || includesElements('/search') || includesElements('/post/') || includesElements('/competition/') || includesElements('/club') || includesElements('/signup') || includesElements('/login') || includesElements('form/') || includesElements('/chat') || includesElements('/test/') || includesElements('/settings') || includesElements('/profile/dashboard') ? 'hidden' : 'sm:hidden lg:flex flex-col'} sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)]  min-w-32 lg:max-w-40 2xl:max-w-64 w-full gap-3 border-l-2 border-dark-gray`}>
          <p className='text-xl p-2 text-white flex items-center gap-2'>Friends <FaUsers className='text-2xl' /></p>
        <div className="flex flex-col gap-3 px-2 overflow-y-auto">
          {document && user && document.data && [...document.data.friends, ...document.data.friendsStarted].length > 0 ? [...document.data.friends, ...document.data.friendsStarted].map((item) => (
            <BarFriendOverview key={item.id} image={item.Invitee.id !== user.id ? item.Invitor.photoURL : item.Invitee.photoURL} username={item.Invitee.id !== user.id ? item.Invitor.nickname : item.Invitee.nickname} />
          )) : <div className='flex flex-col items-center gap-2'>
              <FaRegFrownOpen className='text-primary-color text-7xl' />
              <p className='text-white text-lg font-semibold'>You have no friends yet !</p>
              
          </div>}
          
          </div>
    </div>
  )
}

export default DefaultRightBar