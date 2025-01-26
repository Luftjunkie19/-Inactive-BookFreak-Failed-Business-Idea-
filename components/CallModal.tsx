'use client';

import { PhoneCall } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { io, Socket } from 'socket.io-client';

type Props = {}

function CallModal({ }: Props) {
    const [isCalling, setIsCalling] = useState<boolean>(false);
  const socketRef = useRef<Socket | null>(null);
  

  useEffect(() => {
    if(!socketRef.current){
      socketRef.current = io('http://localhost:9000');
      }
      
      socketRef.current.on('initiate-meeting', (data) => {
          if (data.userId) {
              setIsCalling(true);
          }
      });

    return () => {
      if(socketRef.current){
        socketRef.current.disconnect();
      }
    }
  },[socketRef])

    const userCalledModal = isCalling ? <div className='absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col justify-center items-center'>
        <div className="w-12 h-12 rounded-full bg-green-400">  
        <PhoneCall className='w-8 h-8' />
        </div>
        <p>Calling</p>
    </div> : <></>
    

  return (
userCalledModal
  )
}

export default CallModal