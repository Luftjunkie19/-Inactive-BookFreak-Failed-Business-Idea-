import { LocalUser, RemoteUser, useRemoteUsers, useLocalAudioTrack, useLocalCameraTrack } from 'agora-rtc-react'
import React from 'react'

type Props = {}

function TilesView({ }: Props) {
    const remoteUsers = useRemoteUsers();

  const audioTrack = useLocalAudioTrack();
  const videoTrack = useLocalCameraTrack();


  return (
      <div className='max-w-7xl mx-auto w-full flex flex-wrap gap-4 items-center overflow-y-auto max-h-96 h-full justify-center p-3'>
              <LocalUser
      audioTrack={audioTrack}
      cameraOn
      cover={""}
      micOn
      playAudio
      playVideo
      videoTrack={videoTrack}
    />

           {remoteUsers.map(user => (
        <RemoteUser key={user.uid} user={user} />
      ))}
    </div>
  )
}

export default TilesView