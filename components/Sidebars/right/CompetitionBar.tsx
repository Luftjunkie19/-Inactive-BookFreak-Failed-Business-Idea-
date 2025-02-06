"use client";
import { useQuery } from '@tanstack/react-query';
import { useCheckPathname } from 'hooks/useCheckPathname';
import Image from 'next/image';
import { useParams, usePathname } from 'next/navigation'
import { useRouter } from 'next/router';
import React, { Suspense, useMemo } from 'react'
import '../../../stylings/tourguide.css';
import { FaUsers } from 'react-icons/fa6';
type Props = {}

function CompetitionBar() {
  const { competitionId } = useParams();
  const { includesElements} = useCheckPathname();
    
    const { data: document } = useQuery({
    queryKey: ['competition'],
    queryFn: () => fetch('/api/supabase/competition/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: competitionId, include: { members: {include:{
        user:true,
      }}, rules: true } })
    }).then((res) => res.json())
  });


  return (
      <Suspense fallback={<p>Loading...</p>}>   
      <div className={`sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] flex flex-col members gap-4 bg-dark-gray/40 ${!includesElements('settings') ? 'sm:hidden lg:flex' : 'hidden'} border-l-2 border-primary-color flex-col sm:max-w-40 w-full 2xl:max-w-xs p-2 2xl:w-full`}>
        <div className="flex items-center gap-2">
          <FaUsers className='text-white text-xl'/>
          <p className='text-white text-xl font-semibold'>Members</p>
       </div>
       {document && document.data && document.data.members.map((item)=>(<Suspense key={item.id} fallback={<p>Loading....</p>}>
              <div className='text-white flex items-center gap-3'>
              <Image src={item.user.photoURL} alt="" width={60} height={60} className="2xl:w-10 2xl:h-10 lg:w-8 lg:h-8 rounded-full" />
<p className='line-clamp-1'>{item.user.nickname}</p>
          </div>
          </Suspense>))}
      
            </div>
      </Suspense>
  )
}

export default CompetitionBar