'use client';

import { useEffect, useRef, useState } from "react";
import { IoChatbubble, IoChatbubblesSharp } from "react-icons/io5";
import MeetingChatBar from "components/meeting/chat/MeetingChatBar";
import BottomMangementBar from "components/meeting/BottomMangementBar";
import ParticipantTile from "components/meeting/ParticipantTile";
import Peer from "peerjs";


export default function MeetingRoom({params}:{params:{peerId:string}}) {

  const [openChat, setOpenChat] = useState<boolean>(false);
  
    

  return (
    <div className="sm:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden flex ">
    <div className="w-full flex flex-col h-full justify-between">
    <div className="max-w-7xl mx-auto w-full flex flex-wrap gap-4 items-center overflow-y-auto max-h-96 h-full justify-center p-3">
       <ParticipantTile/>
      </div>

        

<BottomMangementBar toggleChat={setOpenChat} openChat={openChat}/>

    </div>
  <MeetingChatBar openChat={openChat}/>
    </div>
  );
}
