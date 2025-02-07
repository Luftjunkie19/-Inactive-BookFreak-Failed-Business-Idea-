'use client';

import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import PhoneInput from 'components/input/PhoneInput';
import React, { useState } from 'react'

type Props = {}

function DataForm({ }: Props) {
    
    
      const [selectedCountry, setSelectedCountry] = useState<string>('');

  return (
      <>
            <p className='text-white text-xl'>Financial Data</p>
      <div id='personal-data' className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-5xl w-full">
        <LabeledInput label='First Name' type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Last Name' type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Email' type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <div className="flex flex-col gap-1">
          <p className='text-white'>Phone Number</p>
          <PhoneInput selectedCountry={selectedCountry} setSelectedCountry={(country)=>{setSelectedCountry(country)}}/>
          <div>
            
        </div>
        </div> 
      </div>
      
      <p className='text-white text-xl'>Address</p>
       <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-5xl w-full">
        <LabeledInput label='Address'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='City'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Zip Code'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
      </div>


         <p className='text-white text-xl'>Bank Account</p>
       <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 max-w-5xl w-full">
        <LabeledInput label='IBAN'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Currency'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
        <LabeledInput label='Confirm IBAN'  type='dark' additionalClasses='p-2 max-w-xs w-full' />
      </div>

      <Button type='blue' additionalClasses='w-fit px-4'>Submit</Button>
      </>
  )
}

export default DataForm