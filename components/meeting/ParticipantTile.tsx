import React, { useEffect, useRef, useState } from 'react'

type Props = {}

function ParticipantTile({}: Props) {

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);


  return (
    <div className="bg-dark-gray relative top-0 left-0 rounded-lg sm:max-w-40 sm:max-h-32 overflow-hidden  lg:max-w-52 lg:max-h-36 2xl:max-w-72 2xl:max-h-48 w-full h-full">
      <video playsInline autoPlay muted ref={videoRef} className="w-full rounded-lg h-full" />
      <div className="bg-primary-color flex items-center justify-center px-2  absolute bottom-0 left-0 max-h-8 h-full w-full">
        <p className='text-white font-semibold '>Nickname</p>
      </div>
    </div>
  )
}

export default ParticipantTile