import React from 'react'
import Peer from "peerjs";
type Props = {}

function usePeerJS({}: Props) {
    const peer = new Peer();

    const call = async () => {
        const getUserMedia = await navigator.mediaDevices.getUserMedia({ 'audio': true, 'video': true });

  const call = peer.call('another-peers-id', getUserMedia);
  call.on('stream', (remoteStream)=> {
      console.log(remoteStream);
  });
    }

    const connect = async (peerId:string) => {
        var conn = peer.connect(peerId);
// on open will be launch when you successfully connect to PeerServer
        conn.on('open', () => {
    conn.send({name: 'Robert'});
        });
    }

    const answerOnCall = async () => {
         const getUserMedia = await navigator.mediaDevices.getUserMedia({ 'audio': true, 'video': true });
peer.on('call', function(call) {
    call.answer(getUserMedia);
       call.on('stream', function(remoteStream) {
           // Show stream in some video/canvas element.
           console.log(remoteStream);
    });
});
    }



    return {
        call,
        connect,
        answerOnCall    
    }

}

export default usePeerJS