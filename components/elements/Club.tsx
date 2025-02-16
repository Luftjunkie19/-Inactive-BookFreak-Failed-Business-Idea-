'use client';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import image from '../../assets/Logo.png'
import Button from 'components/buttons/Button';
import { IoAlertCircle } from 'react-icons/io5';
import { useAuthContext } from 'hooks/useAuthContext';
import { useQuery } from '@tanstack/react-query';
export type clubProps = {
  clubLogo: string, clubName: string, hasRequirements: boolean, membersAmount: number,
  clubData: any, type: 'transparent' | 'blue' | 'black' | 'dark' | 'white'
}

function Club({ clubData, clubLogo, clubName, hasRequirements, membersAmount, type }: clubProps) {
  const { user } = useAuthContext();
  
  const { data:userData } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: user?.id }),
    }).then((res) => res.json()),
    enabled:!!user
  })


  return (
    <div className={`max-w-64 w-full ${type === 'transparent' ? 'bg-transparent text-white' : type === 'blue' ? 'bg-primary-color text-white' : type === 'dark' ? 'bg-dark-gray text-white' : type === 'black' ? 'bg-transparent text-dark-gray' : 'bg-white text-dark-gray'} rounded-lg flex flex-col gap-1`}>
      <Link href={`/club/${clubData.id}`}>
      <Image width={50} height={60}  src={clubLogo} alt='' className='w-full max-h-44 h-full rounded-t-lg object-cover' />
      </Link>
      <div className="p-2 flex flex-col justify-between h-full gap-2">
        <div className="flex gap-2 flex-col   ">

          <p className=' font-bold text-lg line-clamp-1'>{clubData.clubName}</p>
        <p>{membersAmount} Members</p>
        <div className="flex gap-2 items-center"><IoAlertCircle className=' text-yellow-700 text-lg'/> <p className=' text-sm font-light'>{hasRequirements ? `${clubData.requirements.length} Requirements` : 'Free to Join'}</p></div>
        </div>
        {user &&
          <Button disableState={clubData.members.find((item) => item.userId === user?.id) || !user} additionalClasses={`${clubData.members.find((item) => item.userId === user?.id) ? 'opacity-90 cursor-default' : ''}`} type={`${clubData.members.find((item) => item.userId === user?.id) ? 'dark-blue' : type === 'transparent' ? 'blue' : type === 'blue' ? 'dark-blue' : type === 'dark' ? 'blue' : type === 'black' ? 'blue' : 'blue'}`}>
            {!clubData.members.find((item) => item.userId === user?.id) && hasRequirements ? 'Request' : clubData.members.find((item) => item.userId === user?.id) ? 'Joined' : 'Join'}

          </Button>  
}
      </div>
    </div>
  )
}

export default Club