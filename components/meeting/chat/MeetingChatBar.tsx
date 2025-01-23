import Button from 'components/buttons/Button'
import LabeledInput from 'components/input/LabeledInput'
import useCryptoConnect from 'hooks/useCryptoConnect'
import React from 'react'
import { FaPaperPlane } from 'react-icons/fa6'
import { MdMessage } from 'react-icons/md'

type Props = {
    openChat: boolean
}

function MeetingChatBar({openChat}: Props) {

  const {connectWallet } = useCryptoConnect();
  
  return (
    <div className={`lg:max-w-72 2xl:max-w-sm w-full bg-dark-gray ${openChat ? 'sm:hidden lg:flex flex-col' : 'hidden'}  justify-between h-full`}>
      
      <div className="w-full h-full overflow-y-auto p-2">
        <div className="flex gap-2 items-center">
          <MdMessage className="text-3xl text-primary-color" />
          <p className="text-white text-xl font-bold">Chat</p>
        </div>
   

        
      </div> 
    <div className="w-full h-20 bg-secondary-color px-2 flex justify-between items-center">
      <LabeledInput type='dark' additionalClasses="w-full text-sm rounded-sm border-none py-3 px-2 "/>
      <Button type="transparent">
        <FaPaperPlane className="text-primary-color text-2xl"/>
      </Button>
    </div>
  </div>
  )
}

export default MeetingChatBar