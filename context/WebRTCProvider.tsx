'use client';
import React from 'react'
import AgoraRTC from "agora-rtc-sdk-ng";
import { AgoraRTCProvider } from "agora-rtc-react";

type Props = { children: React.ReactNode }

function WebRTCProvider({children}: Props) {
  return (
      <AgoraRTCProvider client={AgoraRTC.createClient({ mode: "rtc", codec: "vp8" })}>
        {children}
    </AgoraRTCProvider>
  )
}

export default WebRTCProvider