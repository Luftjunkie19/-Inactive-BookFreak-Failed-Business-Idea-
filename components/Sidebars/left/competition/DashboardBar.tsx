'use client';
import React from 'react'
import Link from "next/link";
import { FaQuestion, FaUserGear } from "react-icons/fa6";
import { IoGitPullRequestSharp } from 'react-icons/io5';
import { MdAdminPanelSettings } from 'react-icons/md';
import { FaInfoCircle, FaUsers } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri';
import { useParams, usePathname } from 'next/navigation';
import Button from 'components/buttons/Button';
import introJs from 'intro.js';
import { useCheckPathname } from 'hooks/useCheckPathname';
import { IntroStep } from 'intro.js/src/core/steps';
type Props = {}

function DashboardBar({ }: Props) {
  const { competitionId } = useParams();
  
  const { includesElements } = useCheckPathname();
  const steps:Partial<IntroStep>[] = includesElements('/settings') && !includesElements('/participants') ?  [
    {
      'title': 'Info Page Guide', 
      'intro':'This is the page where you can find all the details about the Competition, like rules, description, etc.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
    },{
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      intro:'You can edit logo or the fields of description, name, rules of counting points or expiration date.',
      title: '1. Fields to edit',
      'element':'#first-form-section'
    }, 
    {
      'title': '2. Manage the prize',
      'intro':'You can change the name, description, and amount of the prize. Alternatively, you can change the prize entirely.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      'element':'#second-form-section'
    },
    {
      'title': '3. Manage the competition existence',
      'intro':'If anything happened, that has to be fixed, you can remove the competition from the list or terminate the competition.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      'element':'#third-form-section'
    }
  ] :[
    {
      'title': 'Participants Management Guide',
      'intro':'This is the page where you can manage all the participants of the competition.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
    },
    {
      'title': '1. Accept a participance request',
      'intro':'You can accept or reject a participant request to join the competition. The participant will be added to the list of participants.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      'element':'#first-particpant-form-section'
    },
    {
      'title': '2. Adminitstration',
      'intro':'Here you can see or manage the admins of the competition',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      'element':'#second-particpant-form-section'
    }, 
    {
      'title': '3. Manage the participants',
      'intro':'You can change the name, description, and amount of the prize. Alternatively, you can change the prize entirely.',
      'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
      'element':'#third-particpant-form-section'
    }
  ];
  return (
       <div className="lg:flex flex-col gap-3 p-2 justify-between text-white bg-dark-gray sm:hidden sm:max-w-fit lg:max-w-52 2xl:max-w-xs sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] w-full">
                <div className="flex flex-col gap-4 py-2 px-1">
                <p className='flex items-center text-2xl font-bold gap-2'><FaUserGear  /> Settings</p>
                    <Link href={`/competition/${competitionId}/settings`} className='flex gap-2 items-center'><FaInfoCircle className='text-xl' /> General Info</Link>
                    <Link href={`/competition/${competitionId}/settings/participants`} className='flex gap-2 items-center'><FaUsers className='text-xl'  /> Participants Management</Link>
                </div>

      <div className="flex flex-col gap-1">
        <button className='flex gap-2 items-center' onClick={() => {
          introJs().setOptions({
            steps
          }).start();
      }}><FaQuestion className="text-xl text-primary-color"/> Tour Guide</button>
                 <Link href={`/competition/${competitionId}/chat`} className='text-white flex items-center gap-2'><RiArrowGoBackFill className="text-xl text-primary-color" /> Back to competition</Link>
      </div>
          </div>
  )
}

export default DashboardBar