'use client';

import Button from 'components/buttons/Button'
import Image from 'next/image'
import React, { useEffect } from 'react'
import { BsThreeDots } from 'react-icons/bs'
import logoImg from '../../assets/Logo.png'
import { IoVideocam } from 'react-icons/io5'
import { io } from 'socket.io-client'


type Props = {competitionData:any}

function CompetitionTopBar({competitionData}: Props) {


       const socket = io('http://localhost:9000');

    useEffect(() => {
        socket.on('initiate-meeting', (data) => {
            console.log(data);
        })
    }, [])
    

  return (
    <div className='chat-navbar bg-dark-gray/70 w-full max-h-16 h-full p-2 flex items-center'>
    <div className="flex-1 flex items-center gap-2">
        <Image src={competitionData.competitionLogo} alt='' height={50} className='w-8 h-8 rounded-full' width={50}/>
        <div className="flex flex-col text-white">
                  <p className='text-sm line-clamp-1'>{competitionData.competitionName}</p>
            <p className='text-xs font-light'>{competitionData.members.length} Members</p>
        </div>
    </div>
            <div className="flex items-center gap-3">
              <Button onClick={() => {
                  const meetingId = crypto.randomUUID();
                  initiateMeeting(meetingId);
                }}  additionalClasses='text-white text-2xl' type='transparent'>
                    <IoVideocam/>
                </Button>
                <Button additionalClasses='text-white text-2xl' type='transparent'>
                    <BsThreeDots />
                </Button>
            </div>
        </div>
  )
}

export default CompetitionTopBar