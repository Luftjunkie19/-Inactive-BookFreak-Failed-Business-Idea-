import React, { useCallback, useRef, useEffect } from 'react';
import { useWavesurfer } from '@wavesurfer/react';
import { FaPause, FaPlay } from 'react-icons/fa6';

type Props = {
  audioUrl: string;
};

function AudioMessageComponent({ audioUrl }: Props) {
  const containerRef = useRef<HTMLAudioElement>(null);

  // Initialize Wavesurfer
  const { wavesurfer, isPlaying } = useWavesurfer({
    container: containerRef,
    height: 24,
    waveColor: '#4477FF',
    progressColor: '#d9d9d9',
    barGap: 2,
    barWidth: 4,
    barRadius: 8,
    url: audioUrl
  });


  // Attach "finish" event listener once
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

  const onPlayPause = useCallback(() => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  }, [wavesurfer]);

  return (
    <div className="flex gap-4 items-center justify-between max-w-sm w-full bg-dark-gray p-2 rounded-lg">
      <button
        onClick={onPlayPause}
        className="w-10 h-10 text-xl rounded-full text-primary-color bg-white justify-center items-center flex"
      >
        {isPlaying ? <FaPause /> : <FaPlay />}
      </button>

      <audio src={audioUrl} ref={containerRef}></audio>

    </div>
  );
}

export default AudioMessageComponent;
