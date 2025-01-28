'use client';
import React, { useState } from 'react'
import MeetingChatBar from './chat/MeetingChatBar'
import BottomMangementBar from './BottomMangementBar';
import TilesView from './Tiles/TilesView';

type Props = {participantId:string, }

function MeetingPartcipantView({ participantId}: Props) {
      const [openChat, setOpenChat] = useState<boolean>(false);
  return (
      <>
         <div className="sm:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] w-full flex flex-col justify-between">
              <TilesView/>
      
      <BottomMangementBar participantId={participantId} toggleChat={setOpenChat} openChat={openChat}/>
      
          </div>
                    <MeetingChatBar openChat={openChat} />
      </>
  )
}

export default MeetingPartcipantView