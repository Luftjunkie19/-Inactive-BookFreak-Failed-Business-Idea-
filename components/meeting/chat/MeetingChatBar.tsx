import Button from 'components/buttons/Button'
import LabeledInput from 'components/input/LabeledInput'
import React from 'react'
import { FaPaperPlane } from 'react-icons/fa6'

type Props = {
    openChat: boolean
}

function MeetingChatBar({openChat}: Props) {
  return (
    <div className={`max-w-[19rem] w-full bg-dark-gray ${openChat ? 'sm:hidden lg:flex flex-col' : 'hidden'}  justify-between h-full`}>
    <div className="w-full h-full overflow-y-auto p-2">
   
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