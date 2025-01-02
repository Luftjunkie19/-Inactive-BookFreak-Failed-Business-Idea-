'use client';

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";
import LabeledInput from "components/input/LabeledInput";
import Button from "components/buttons/Button";
import { FaPaperPlane } from "react-icons/fa6";
import { MdChatBubble, MdScreenShare } from "react-icons/md";
import { TbUserShare } from "react-icons/tb";
import { FiCamera } from "react-icons/fi";
import { FaMicrophone } from "react-icons/fa";
import { PiPhoneDisconnectFill } from "react-icons/pi";
import { IoChatbubble, IoChatbubblesSharp } from "react-icons/io5";
import MeetingChatBar from "components/meeting/chat/MeetingChatBar";
import BottomMangementBar from "components/meeting/BottomMangementBar";
import socket, { io } from "socket.io-client";

export default function MeetingRoom() {

  const [openChat, setOpenChat]=useState<boolean>(false);

const clickCheck=()=>{
 const emitedEvent= io('http://localhost:3000').emit('check', 'hello');
}

  return (
    <div className="sm:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden flex ">
    <div className="w-full flex flex-col h-full justify-between">
    <div className="max-w-7xl mx-auto w-full flex flex-wrap gap-4 items-center overflow-y-auto max-h-96 h-full justify-center p-3">

<div className="bg-pink-400 cursor-pointer w-20 h-20 rounded-lg" onClick={clickCheck}>
  Hello!
  </div> 
       
      </div>


<BottomMangementBar toggleChat={setOpenChat} openChat={openChat}/>

    </div>
  <MeetingChatBar openChat={openChat}/>
    </div>
  );
}
