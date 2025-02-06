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
import '../../../stylings/tourguide.css';
import introJs from 'intro.js';
import { IntroStep } from 'intro.js/src/core/steps';



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
 

const steps:Partial<IntroStep>[]= includesElements('/competition') && !includesElements('chat') ? [
  {
    'title':'Competition Guide', 
    'intro':'This Guide will introduce you to the main features of the competition. We will cover the main points of the competition and explain what is something suited for.', 
    'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
  },
  {
    'title':'1. Competition Dashboard',
    'intro':'This is the main dashboard of the competition. Here you can see all the important information about the competition and its members. Rankings, Charts, etc.',
    'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
    element:".main-page"
  },
  {
    'title': '2. Competition Details',
    element:".details",
    'intro':'Here you can see the details of the competition, such as who created this competition, the type of the competition, administration and most importantly rules and requirements you have to fulfill, joining this club.',
    'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
  },{
    'title': '3. Competition Members',
    element:".members",
    'intro':'Here you can see some small amount of the members of the competition. You can also see their profile.',
    'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',

  }, {
    'title':'4. Competition Charts',
    'intro':'Here you can see the charts of the competition. These charts show the rankings of the competition.',
    'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
    element:'.charts-section'
  }, {
    'title':'5. Competition Rankings',
    'intro':'Here you can see the rankings of the competition. These rankings show the current position of the members in the competition.',
    'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      element:'.rankings'
  },
  {
    title:'6. Competition Prize',
    intro:'Here you can see the prize of the competition. The prize is set by the creator of the competition and is handed in by the time the competition ends. The potenial or final winner of the competition will be displayed in the box next to the prize.',
    tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
    element:".prize"
  },
  {
    title: '7. Competition Activity',
    intro: 'Here you can see the activity of the competition. Here you can find all the information about members engagement in the competition.',
    element: ".activity-section",
    tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full'
  },
  {
    title: '8. Competition Chat',
    intro: 'By clicking this button, you will be redirected to the chat assigned to this community. Share your opinion, chat with others.',
    element: ".comp-chat-btn",
    tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full'
  }
] : [
  {
    'title':'1. Chat Guide', 
    'intro':'In this guide, we will walk you through the main features of the chat. We will cover the main points of the chat and explain what is something suited for.', 
    'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
  },
  {
    'title':'2. Chat Navbar',
    'intro':'Here you can see the navbar of the chat. You can see to which community you are connected, you can call others, etc.',
    'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full', 
    element:".chat-navbar"
  }, {
    title: '3 Chat Messages',
    element:'.chat-view',
    intro:'Here you can see the messages of the chat. You can send messages, delete messages, etc. Or respond to certain message.',
    tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
    },
    {
      title: '4. Chat Bottom Bar',
      intro: 'Here you can see the bottom bar of the chat. You can write a message, upload a file, record a voice message.',
      element: ".chat-bottom-bar",
      tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full'
  }
];
  
  return (
 <div className={`sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] 2xl:max-w-72 2xl:w-full sm:w-fit ${isMemberCheck && !includesElements('settings') ? 'sm:hidden lg:flex' : 'hidden'} flex-col justify-between gap-6 bg-dark-gray/40 p-4 border-r border-primary-color text-white`}>
      <div className="flex  flex-col gap-4">
        <Link className='flex items-center gap-2' href={`/competition/${competitionId}`}>
        <MdSpaceDashboard size={24} /> 
        <p>Dashboard</p>
          </Link>
          <Link className='flex items-center gap-2 comp-chat-btn' href={`/competition/${competitionId}/chat`}>
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
              <DropdownItem onClick={()=>{
  introJs().setOptions({steps}).start();
}} description="If you need help, check our guide !" classNames={{'base':'hover:bg-none text-white'}} startContent={<FaQuestion className='text-primary-color' size={24}/>} className='text-white' data-hover={false} >
Guide  
</DropdownItem>
<DropdownItem description="Leave the competition" classNames={{'base':'hover:bg-none text-white'}} startContent={<GiExitDoor className='text-red-400' size={24}/>} className='text-white' data-hover={false} >
Exit  
</DropdownItem>

          </DropdownMenu>
        </Dropdown>
          </div>
        }
       
        </div>

    
  )
}

export default CompetitionLeftBar