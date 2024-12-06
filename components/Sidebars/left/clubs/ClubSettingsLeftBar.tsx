'use client';
import { IoGitPullRequestSharp } from 'react-icons/io5';
import { MdAdminPanelSettings } from 'react-icons/md';
import { FaInfoCircle, FaUsers } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useMemo } from 'react'
import { FaQuestion, FaUserGear } from 'react-icons/fa6';
import { useCheckPathname } from 'hooks/useCheckPathname';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'hooks/useAuthContext';
import { IntroStep } from 'intro.js/src/core/steps';
import introJs from 'intro.js';

type Props = {}

function ClubSettingsLeftBar({}: Props) {
    const { clubId } = useParams();
    const { includesElements } = useCheckPathname();

  const { user } = useAuthContext();

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

  const isMemberCheck = useMemo(() => {
      return user && document && document.data && document.data.members.find((item) => item.user.id === user.id);
  }, [user, document]);


  const steps:Partial<IntroStep>[] = includesElements('/settings') && !includesElements('/participants') ?  [
    {
      'title': 'Info Page Guide', 
      'intro':'This is the page where you can find all the details about the Club, like rules, description, etc.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
    },{
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      intro:'You can edit logo or the fields of description, name or requirements.',
      title: '1. Fields to edit',
      'element':'#first-form-section'
    }, 
    {
      'title': '2. Manage the club existence',
      'intro':'If anything happened, that has to be fixed, you can remove the club.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      'element':'#second-form-section'
    }
  ] :[
    {
      'title': 'Participants Management Guide',
      'intro':'This is the page where you can manage all the participants of the club.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
    },
    {
      'title': '1. Accept a participance request',
      'intro':'You can accept or reject a participant request to join the club. The participant will be added to the list of participants.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      'element':'#first-particpant-form-section'
    },
    {
      'title': '2. Adminitstration',
      'intro':'Here you can see or manage the admins of the club.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      'element':'#second-particpant-form-section'
    }, 
    {
      'title': '3. Manage the participants',
      'intro':'From this panel you can remove, warn or ban a participant of the club.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      'element':'#third-particpant-form-section'
    }
  ];


  return (
      <div className={` ${ isMemberCheck && includesElements('settings') ? 'sm:hidden lg:flex' : 'hidden'} flex-col gap-3 p-2 justify-between text-white bg-dark-gray sm:max-w-40 2xl:max-w-xs sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] w-full`}>
          
          <div className="flex flex-col gap-4">
                <p className='flex items-center text-2xl font-bold gap-2'><FaUserGear  /> Settings</p>
                    <Link href={`/club/${clubId}/settings`} className='flex gap-2 items-center'><FaInfoCircle className='text-xl' /> General Info</Link>
                    <Link href={`/club/${clubId}/settings/participants`} className='flex gap-2 items-center'><FaUsers className='text-xl' /> Members</Link>
      </div>
      
      <div className="flex flex-col gap-2">
      <button className='flex gap-2 items-center' onClick={() => {
          introJs().setOptions({
            steps
          }).start();
      }}><FaQuestion className="text-xl text-primary-color"/> Tour Guide</button>

{document && document.data && document.data.members.find((member)=>member.userId === user!.id && (member.isCreator || member.isAdmin || member.isOwner)) && 
                 <Link href={`/club/${clubId}/chat`} className='text-white flex items-center gap-2'><RiArrowGoBackFill className="text-xl text-primary-color" /> Back to club</Link>
}
      </div>
      </div>
  )
}

export default ClubSettingsLeftBar