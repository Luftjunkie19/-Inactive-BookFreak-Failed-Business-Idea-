import React, { useEffect } from 'react'
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import {Socket, io} from 'socket.io-client';
import { useRouter } from 'next/navigation';



function useMeeting() {
    const router = useRouter();
    const socket = io('http://localhost:9000');
    const peer = new Peer();


    const initiateMeeting = (peerId:string) => { 
   socket.emit('initiate-meeting', {peerId});
    }


    const executeCall = (peerId: string, mediaStream: MediaStream) => { 
        const peer = new Peer();
        const call = peer.call(peerId, mediaStream);
        console.log(call);
    }


  const joinMeeting = (peerId: string, metadata?:any, label?:string) => {

      
    };

    const leaveMeeting = (peerId: string) => {

    }

    const typeMessage = (peerId: string, message: string) => {
      
    }


   



    return {initiateMeeting, joinMeeting, leaveMeeting, typeMessage, executeCall}



}

export default useMeeting