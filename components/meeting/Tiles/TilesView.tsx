'use client';

import { useMeeting } from '@videosdk.live/react-sdk';
import React from 'react'
import toast from 'react-hot-toast';
import ParticipantTile from '../ParticipantTile';

type Props = {}

function TilesView({ }: Props) {

  const { participants } = useMeeting();

  return (
      <div className='max-w-7xl mx-auto w-full flex flex-wrap gap-4 items-center overflow-y-auto max-h-96 h-full justify-center p-3'>
      {[...participants.keys()].map((participantId, index) => (
        <ParticipantTile key={index} participantId={participantId} />
      ))}
    </div>
  )
}

export default TilesView