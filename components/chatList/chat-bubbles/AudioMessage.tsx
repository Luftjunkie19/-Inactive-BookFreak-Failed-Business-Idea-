import React, { useCallback, useRef, useEffect } from 'react';
import { useWavesurfer } from '@wavesurfer/react';
import { FaPause, FaPlay, FaTrash } from 'react-icons/fa6';

type Props = {
  audioUrl: string,
  isAudioChatMesage: boolean,
  isEditable?: boolean,
  onClick?:()=>void | Promise<void>
};

function AudioMessageComponent({ audioUrl, isAudioChatMesage,isEditable, onClick}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Wavesurfer
  const { wavesurfer, isPlaying} = useWavesurfer({
    container: containerRef,
    height: 32,
    width:256,
    waveColor: '#4477FF',
    progressColor: 'white',
    barGap: 2,
    barWidth: 4,
    barRadius: 8,
   url: audioUrl

  });


  useEffect(() => {
    if (wavesurfer) {
      const handleFinish = () => {
        wavesurfer.setTime(0);
      };
      wavesurfer.on('finish', handleFinish);

      return () => {
        wavesurfer.un('finish', handleFinish);
      };
    }
  }, [wavesurfer]);

  const onPlayPause = useCallback( async () => {
    if (wavesurfer) {


  
      wavesurfer.playPause();
    }
  }, [wavesurfer]);

  return (
 isEditable ?   <div className='max-w-md w-full flex items-center gap-2'>
    <div className="flex gap-4 items-center justify-between max-w-sm w-full bg-dark-gray p-2 rounded-lg">
      <button
        onClick={onPlayPause}
        className="w-10 h-10 text-xl rounded-full text-primary-color bg-white justify-center items-center flex"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <div ref={containerRef}></div>

      
    </div>
      {isEditable && <button onClick={onClick}><FaTrash className='text-red-500'/></button>}
   </div>:  <div className="flex gap-4 items-center justify-between max-w-sm w-full bg-dark-gray p-2 rounded-lg">
      <button
        onClick={onPlayPause}
        className="w-10 h-10 text-xl rounded-full text-primary-color bg-white justify-center items-center flex"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <div ref={containerRef}></div>

      
    </div>
  );
}

export default AudioMessageComponent;
