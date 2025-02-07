import Button from 'components/buttons/Button'
import React from 'react'
import { FaPauseCircle } from 'react-icons/fa'
import { IoMdSwap } from 'react-icons/io'
import { MdCancel } from 'react-icons/md'
import Card from 'react-credit-cards-2';
import LabeledInput from 'components/input/LabeledInput'
type Props = {}

function SubscriptionManagement({}: Props) {
  return (
      <>
        <p className='text-white text-3xl'>Subscription Management</p>
            <div id={'subscription-management'} className=" flex gap-3 sm:flex-wrap xl:flex-row  items-center w-full ">
      
          <div className="bg-dark-gray xl:min-h-[20.125rem] sm:max-h-64 h-full p-2 flex flex-col justify-between rounded-lg border-2 max-w-md w-full border-primary-color">
                <div className="">
                <p className='text-white font-thin'>Current Plan</p>
                <p className='text-green-400 text-4xl font-bold'>FOTM PLAN</p>
                 <p className='text-white'>Next Payment on 25th of December</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className='text-white'>Manage Plan</p>
                  <div className="flex gap-3 items-center">
                    <Button type='blue' additionalClasses='w-fit flex gap-2 items-center px-4'>Switch <IoMdSwap /></Button>
                    <Button type='black' additionalClasses='w-fit flex gap-2 items-center bg-orange-400 px-4'>Pause <FaPauseCircle /></Button>
                    <Button type='black' additionalClasses='w-fit flex gap-2 items-center bg-red-400 px-4'>Cancel <MdCancel /> </Button>
                  </div>
                </div>
              </div>
      
              <div className="bg-dark-gray max-w-3xl w-full py-6 px-3 border-2 border-primary-color rounded-lg flex flex-col gap-2">
            <div className="flex sm:flex-col lg:flex-wrap 2xl:flex-row gap-2 items-center max-w-3xl w-full justify-between">
                  <div className=" max-w-56 w-full p-2">    
              <Card 
              
              number={''}
              expiry={''}
              cvc={''}
                      name={''}
                      preview={true}
            />
                </div>
                <div className="flex sm:self-start flex-col gap-4">
                  <LabeledInput label='Card Number'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
                  <div className="flex justify-between gap-2 items-center"
                  >
       <LabeledInput placeholder='MM/YY'  type='dark' additionalClasses='p-2 max-w-36 w-full' />
                   <LabeledInput placeholder='CVC'  type='dark' additionalClasses='p-2 max-w-36 w-full' />
                  </div>
                   <LabeledInput label='Card Holder'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
                </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button type='blue' additionalClasses='w-fit px-4'>Update</Button>
                   <Button type='white-blue' additionalClasses='w-fit px-4'>Add Card</Button>
                </div>
      
              </div>
        
      
          
      
            </div>
      </>
  )
}

export default SubscriptionManagement