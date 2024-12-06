'use client';

import { useQuery } from '@tanstack/react-query';
import { useCheckPathname } from 'hooks/useCheckPathname';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation'
import { useRouter } from 'next/router';
import React, { Suspense, useMemo } from 'react'

type Props = {}

function ClubBar() {
    const { clubId } = useParams(); 
    const { includesElements} = useCheckPathname();

  const { data: document } = useQuery({
    queryKey: ['club'],
    queryFn: () => fetch('/api/supabase/club/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: clubId, include: { members: {
        include: { user: true }
      }, rules: true } })
    }).then((res) => res.json())
  });



  return (
      <div className={` members ${!includesElements('settings') ? 'sm:hidden lg:flex' : 'hidden'} sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] bg-dark-gray border-l-2 border-primary-color flex flex-col lg:max-w-32 xl:max-w-52  gap-4 pt-3 px-3 w-full`}>
         <p className='text-white font-bold text-xl'>Members</p>
          {document && document.data && document.data.members.map((userObj) => (<Suspense key={userObj.id} fallback={<p>Loading....</p>}>
              <div className='text-white flex items-center gap-3'>
              <Image src={userObj.user.photoURL} alt="" width={60} height={60} className="w-8 h-8 rounded-full" />
<p>{userObj.user.nickname}</p>
          </div>
          </Suspense>))} 

            </div>
  )
}

export default ClubBar