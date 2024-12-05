"use client";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'hooks/useAuthContext';
import { useCheckPathname } from 'hooks/useCheckPathname';
import Image from 'next/image';
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useMemo } from 'react'
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaQuestion } from 'react-icons/fa';
import { FaGear, FaVideo } from 'react-icons/fa6'
import { GiExitDoor } from 'react-icons/gi'
import { IoIosChatbubbles } from 'react-icons/io';
import { MdEdit, MdSpaceDashboard } from 'react-icons/md'
import { TbListDetails } from 'react-icons/tb'

import introJs from 'intro.js';



function CompetitionLeftBar() {
  const { competitionId } = useParams();
  const { user } = useAuthContext();
  const { includesElements } = useCheckPathname();
  
  const { data: document } = useQuery({
    queryKey: ['competition'],
    queryFn: () => fetch('/api/supabase/competition/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: competitionId, include: { members: {
        include: { user: true }
      }, rules: true } })
    }).then((res) => res.json())
  });

  const {data:userObject}=useQuery({
    queryKey: ['userData'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: user!.id, include:{
        'Member':{
                'include':{'Club':true, Competition:true, user:true},
            }
      } })
    }).then((res) => res.json())
  })

  const isMemberCheck = useMemo(() => {
    return user && document && document.data && document.data.members.find((item) => item.user.id === user.id)
  }, [user, document]);
 
  return (
 <div className={`sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] 2xl:max-w-72 2xl:w-full sm:w-fit ${isMemberCheck && !includesElements('settings') ? 'sm:hidden lg:flex' : 'hidden'} flex-col justify-between gap-6 bg-dark-gray p-4 border-r border-primary-color text-white`}>
      <div className="flex flex-col gap-4">
        <Link className='flex items-center gap-2' href={`/competition/${competitionId}`}>
        <MdSpaceDashboard size={24} /> 
        <p>Dashboard</p>
          </Link>
          <Link className='flex items-center gap-2' href={`/competition/${competitionId}/chat`}>
        <IoIosChatbubbles size={24} /> 
          <p>Chat</p>
          </Link>
          {isMemberCheck && userObject && userObject.data.Member.find((member)=>member.competitionId === competitionId && (member.isCreator || member.isAdmin || member.isOwner)) && 
          <Link className='flex items-center gap-2' href={`/competition/${competitionId}/settings`} >
              <FaGear size={24} /> Settings 
          </Link>
          }
        </div>
        {isMemberCheck && userObject && userObject.data &&
          <div className='flex justify-between items-center gap-2'>
          <div className=" flex gap-2 items-center">
          <Image src={userObject.data.photoURL} alt='' width={60} height={60} className='w-8 h-8 rounded-full' />
          <p className='sm:hidden 2xl:block'>{userObject.data.nickname}</p>
        </div>
        <Dropdown placement='right-end' classNames={{'content':'bg-dark-gray border-2 border-primary-color'}}>
<DropdownTrigger>
<button className='text-white text-xl'><BsThreeDotsVertical size={24}/></button>
</DropdownTrigger>
          <DropdownMenu>
<DropdownItem description="Leave the competition" classNames={{'base':'hover:bg-none text-white'}} startContent={<GiExitDoor className='text-red-400' size={24}/>} className='text-white' data-hover={false} >
Exit  
</DropdownItem>
<DropdownItem onClick={()=>{
  introJs().setOptions({steps:[{'title':'Guide', 'intro':'If you need help, check our guide !'}]}).start();
}} description="If you need help, check our guide !" classNames={{'base':'hover:bg-none text-white'}} startContent={<FaQuestion className='text-primary-color' size={24}/>} className='text-white' data-hover={false} >
Guide  
</DropdownItem>
          </DropdownMenu>
        </Dropdown>
          </div>
        }
       
        </div>

    
  )
}

export default CompetitionLeftBar