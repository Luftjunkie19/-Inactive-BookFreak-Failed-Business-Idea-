'use client';
import { useDisclosure } from '@nextui-org/react'
import Button from 'components/buttons/Button';
import DatePicker from 'components/datepicker/DatePicker';
import ModalComponent from 'components/modal/ModalComponent';
import { LucideMilestone } from 'lucide-react'
import React, { useState } from 'react'

type Props = {}

function MilestoneIncentive({}: Props) {

    const { isOpen, onOpen, onClose, onOpenChange, } = useDisclosure();
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());


  return (
      <div className='flex flex-col gap-2 max-w-5xl w-full p-2'>
          <div className="w-full flex justify-evenly items-center gap-2 flex-wrap">
                  <div  className="h-24 w-24 bg-primary-color  self-center group transition-all duration-300  rounded-full flex items-center p-2 gap-2">
  <LucideMilestone className="w-20 h-20 text-white" />
 
</div>


          <div className="max-w-xl w-full flex flex-col gap-2">
              <p className="text-white text-2xl font-bold">Set a goal for future you !</p>
              <p className='text-white text-sm font-light'>What have you always wanted to achieve? Set your goal now and let us help you make it happen. With personalized plans, progress tracking, and a supportive community, you'll stay motivated every step of the way. Start today and unlock your potential!</p>
           
          </div>
          </div>
          <div className="max-w-60 w-full self-end">
                    <Button additionalClasses=' max-w-32 self-end w-full' onClick={onOpen} type='blue'>Let's go !</Button>
          </div>
      

          <ModalComponent modalBodyContent={<div>
              
 <DatePicker selectedDate={selectedDate} triggerClassName={''} setSelectedDate={(date) => setSelectedDate(date)} triggerContentClassName={'text-white flex items-center gap-2 cursor-pointer border-primary-color border-2 bg-secondary-color rounded-lg p-2'} />
             
            
          </div>} modalFooterContent={<div>
              <Button type='blue'>Set A Goal</Button>
              
</div>}  modalSize='md' modalTitle='One goal set, 2 steps forward' onClose={onClose} isOpen={isOpen} onOpenChange={onOpenChange} />
      </div>
  )
}

export default MilestoneIncentive