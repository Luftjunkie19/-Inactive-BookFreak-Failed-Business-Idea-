import Button from 'components/buttons/Button'
import LabeledInput from 'components/input/LabeledInput'
import React from 'react'

type Props = {}

function FundsSection({}: Props) {
  return (
      <>
        <p className='text-white text-3xl'>Credits Management</p>
      <div id={`credits-management`} className="flex sm:flex-col lg:flex-row gap-4 items-center">
        <div className="bg-dark-gray max-w-md w-full flex flex-col gap-4 p-2 rounded-lg">
          <div className="flex gap-1 flex-col">
            <p className='text-white'>Your Owned Funds</p>
          <p className='text-green-400 font-bold text-3xl'>00.00 PLN</p>
          <p className='text-gray-400 text-xs'>0.00 PLN Pending</p>
          <p className='text-sm text-gray-600'>This amount is ready to payout</p>
          </div>
          
         <LabeledInput placeholder='Enter the amount...' label='Payout Amount' type='transparent' additionalClasses='p-2 border-b-2 rounded-none border-green-400 max-w-xs w-full' />
         <Button type='black' additionalClasses='w-fit bg-green-400 px-4'>Payout</Button>
        </div>

  <div className="bg-dark-gray max-w-md w-full min-h-[16.125rem] flex flex-col gap-4 p-2 rounded-lg">
          <div className="flex gap-1 flex-col">
            <p className='text-white text-xl'>Replenish your account</p>
          <p className='text-sm text-gray-600'>Topup your BookFreak Account and Feel Free to explore a BookFreakish World !</p>
          </div>
          
          <div className="self-center w-full flex flex-col justify-center items-center gap-6">
         <LabeledInput placeholder='Enter the amount...'  type='transparent' additionalClasses='p-2 rounded-none border-b-2 border-green-400 max-w-sm w-full' />
         <Button type='black' additionalClasses='max-w-36 w-full bg-green-400 px-4'>Topup</Button>
          </div>
        </div>
      
      </div>
      </>
  )
}

export default FundsSection