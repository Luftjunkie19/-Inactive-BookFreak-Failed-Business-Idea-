import React, { useEffect, useRef, useState } from 'react'

type Props = {}

function ParticipantTile({}: Props) {

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        // Request access to the camera and microphone
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        // Attach the stream to the video element
        if (videoRef.current) {
          videoRef.current.srcObject = stream as MediaStream;
          videoRef.current.play();
        }
      } catch (err) {
        if (err instanceof Error) {
          setError("Unable to access camera and microphone. " + err.message);
        } else {
          setError("An unknown error occurred.");
        }
      }
    };

    startCamera();

    // Cleanup: Stop the stream when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="bg-secondary-color rounded-lg sm:max-w-40  lg:max-w-52 w-full sm:max-h-32 lg:max-h-36 h-full">
      <video playsInline autoPlay muted  ref={videoRef} className="w-full rounded-lg h-full"/>
    </div>
  )
}

export default ParticipantTile