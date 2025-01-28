'use client';

import { useMeeting } from '@videosdk.live/react-sdk';
import React from 'react'

type Props = {}

function TilesView({ }: Props) {

const {participants}=useMeeting();

  return (
      <div className='max-w-7xl mx-auto w-full flex flex-wrap gap-4 items-center overflow-y-auto max-h-96 h-full justify-center p-3'>
      <p>{JSON.stringify(participants.keys())}</p>
    </div>
  )
}

export default TilesView