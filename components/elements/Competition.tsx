import { useAuthContext } from 'hooks/useAuthContext'

import Image from 'next/image'
import Link from 'next/link'
import React, { useMemo } from 'react'
import Button from 'components/buttons/Button'
export type competitionProps = {
    competitionLogo: string,
    competitionName: string,
    membersAmount: number,
  comeptitionRemainingTime: Date,
  competitionId: string,
  members:any[],
  type: 'transparent' | 'blue' | 'black' | 'dark' | 'white',

}


function Competition({ comeptitionRemainingTime, competitionLogo, competitionName, membersAmount,members, competitionId, type }: competitionProps){
  
  const { user } = useAuthContext();
  
  const isMember = useMemo(() => {
    return members.find((member) => member.userId === user?.id);
  }, [user]);
  
   const expiresIn = (expirationTime:Date) => {
        return Math.floor((new Date(expirationTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) < 0 ? <span className='text-red-400 font-semibold'><span className='text-white font-normal'>Expired</span> {Math.abs(Math.floor((new Date(expirationTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days ago</span> : <span className='text-red-400 font-semibold'> <span className='text-white font-normal'>Expires in</span> {Math.floor((new Date(expirationTime).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</span>; 
    };
  
  const remainedTime = expiresIn(comeptitionRemainingTime);


  
  return (
    <Link href={`/competition/${competitionId}`} className={`max-w-60 w-full rounded-lg flex flex-col gap-1 ${type === 'transparent' ? 'bg-transparent text-white' : type === 'blue' ? 'bg-primary-color text-white' : type === 'dark' ? 'bg-dark-gray text-white' : type === 'black' ? 'bg-transparent text-dark-gray' : 'bg-white text-dark-gray'}`}>
      <Image unoptimized loading='lazy' width={50} height={60} src={competitionLogo} alt='' className='w-full max-h-52 h-full rounded-t-lg object-cover' />
      <div className="flex flex-col gap-1 p-2">
        <p className='text-lg font-bold line-clamp-1'>{competitionName}</p>
        <p>{membersAmount} Members</p>
        {remainedTime}
        
        <Button disableState={isMember || !user} additionalClasses={`${isMember ? ' opacity-80' : ''}`} type={`${isMember ? 'white' :  type === 'transparent' ? 'blue' : type === 'blue' ? 'white-blue' : type === 'dark' ? 'blue' : type === 'black' ? 'white-blue' : 'dark-blue'}`}>{user && !isMember ? 'Request' : 'Joined' }</Button>
        
      </div>
    </Link>
  )
}

export default Competition