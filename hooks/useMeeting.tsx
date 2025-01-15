import React, { useEffect } from 'react'
import Peer, { DataConnection, MediaConnection } from 'peerjs';
import {Socket, io} from 'socket.io-client';
import { useRouter } from 'next/navigation';



function useMeeting() {
    const router = useRouter();

    const initiateMeeting = (peerId:string) => { 
        const peer = new Peer();
       const emitedPeer = peer.emit('open', peerId);
        console.log(emitedPeer);
    }


    const executeCall = (peerId: string, mediaStream: MediaStream) => { 
        const peer = new Peer();
        const call = peer.call(peerId, mediaStream);
        console.log(call);
    }


  const joinMeeting = (peerId: string, metadata?:any, label?:string) => {
        const peer = new Peer();
      const peerConnection = peer.connect(peerId, {
          metadata,
          label,
      });
    
      console.log(peerConnection);
      
    };

    const leaveMeeting = (peerId: string) => {
        const peer = new Peer();
        peer.emit('disconnected', peerId);
    }

    const typeMessage = (peerId: string, message: string) => {
        io().emit('message', { peerId, message });
    }


    const peer = new Peer();

    useEffect(() => {
    
        peer.on('open', (id) => {
            console.log('My peer ID is: ' + id);
            router.push(`/meeting/${id}`);
        });

        peer.on('connection', (conn) => {
            console.log('New peer connected', conn);
        });

        peer.on('call', (call) => { 
            console.log(call);
        })
        

    

    },[])




    return {initiateMeeting, joinMeeting, leaveMeeting, typeMessage, executeCall}



}

export default useMeeting