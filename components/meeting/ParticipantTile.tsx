import { useMeeting, useParticipant } from '@videosdk.live/react-sdk';
import Image from 'next/image';
import React, { useEffect, useRef } from 'react'
import { FaMicrophoneAltSlash } from 'react-icons/fa';
import { FaPhone } from 'react-icons/fa6';

type Props = {participantId:string}

function ParticipantTile({participantId}: Props) {

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const {participants, localParticipant,} = useMeeting();
  const { displayName, webcamOn, webcamStream, micOn, micStream, isLocal, metaData} = useParticipant(participantId);
 useEffect(() => {
    if (videoRef.current) {
      if (webcamOn && webcamStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(webcamStream.track);

        videoRef.current.srcObject = mediaStream;
        videoRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [webcamStream, webcamOn]);

  useEffect(() => {
    if (audioRef.current) {
      if (micOn && micStream) {
        const mediaStream = new MediaStream();
        mediaStream.addTrack(micStream.track);

        audioRef.current.srcObject = mediaStream;
        audioRef.current
          .play()
          .catch((error) =>
            console.error("videoElem.current.play() failed", error)
          );
      } else {
        audioRef.current.srcObject = null;
      }
    }
  }, [micStream, micOn]);


  return (
    <div className="bg-dark-gray relative top-0 left-0 rounded-lg sm:max-w-40 sm:max-h-32 overflow-hidden  lg:max-w-52 lg:max-h-36 2xl:max-w-72 2xl:max-h-48 w-full h-full">
      <div className="w-full h-full relative top-0 left-0">
        {!micOn ? <div className="absolute top-0 right-0 bg-dark-gray/90 flex flex-col justify-center items-center w-full h-full">
        <FaMicrophoneAltSlash className="text-red-500 text-4xl"/>
        </div> : null}
      {webcamOn ? <video playsInline autoPlay muted ref={videoRef} className="w-full rounded-lg h-full" /> : <Image className='w-full object-cover h-full' width={50} height={60} src={metaData.photoURL} alt='' />}
    </div>
    
      <audio ref={audioRef} autoPlay muted={isLocal} />
      <div className="bg-primary-color flex items-center justify-center px-2  absolute bottom-0 left-0 max-h-8 h-full w-full">
        <p className='text-white font-semibold '>{displayName}</p>
      </div>
    </div>
  )
}

export default ParticipantTile