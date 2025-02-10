'use client';
import React from 'react'
import { Checkbox, DatePicker, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { useFormContext } from 'react-hook-form';
import LabeledInput from 'components/input/LabeledInput';
type Props = {}

function AdditionalSection({ }: Props) {
    
    const { register, setValue, watch } = useFormContext();

  return (
      <>
         <div className="flex w-full flex-col gap-1">
          <p className="text-2xl text-white font-bold">Detailed Book Information</p>
          <div className="grid xl:grid-cols-2 2xl:grid-cols-3 max-w-6xl w-full gap-2">
            <LabeledInput {...register('isbn', {
                       onChange: (e) => {
                  setValue('isbn', e.target.value)
                },
              valueAsNumber:true
            })} inputType="number" minNumber={0} additionalClasses="max-w-xs p-2 w-full" label="ISBN" type={"dark"}  />
            <LabeledInput  {...register('publishingCycle')} additionalClasses="max-w-xs p-2 w-full" label="Publishing Cycle" type={"dark"}  />
            <LabeledInput  {...register('serie', {
                          onChange: (e) => {
                  setValue('serie', e.target.value)
                },
                        })} additionalClasses="max-w-xs p-2 w-full" label="Serie" type={"dark"}  />
            <LabeledInput {...register('volume', {
                                onChange: (e) => {
                  setValue('volume', e.target.value)
                },
                        })} additionalClasses="max-w-xs p-2 w-full" label="Volume" type={"dark"}/>

            <LabeledInput inputType="number"  {...register('volumeNumber', {
               onChange: (e) => {
                  setValue('volumeNumber', e.target.value)
                },
              valueAsNumber: true,
              
                                  })} additionalClasses="max-w-xs p-2 w-full" label="Volume Number" type={"dark"}  />
          
        </div>
      </div>

      <div className="flex items-center gap-2 py-3">
              <Checkbox
              value={watch('termsConsent')}
                  {...register('termsConsent', {
        
          validate: () => {
            return watch('termsConsent') || 'You must agreee for the terms';
          }
        })}/>
        <p className="text-sm text-white max-w-5xl w-full">By clicking this button, you admit BookFreak admnisitration to insert remaining information of the book, in case of lack of those. You allow to
        delete the book from the database if the information will contain obscenities or will be faked or untrue.</p>
          </div>
      </>
  )
}

export default AdditionalSection