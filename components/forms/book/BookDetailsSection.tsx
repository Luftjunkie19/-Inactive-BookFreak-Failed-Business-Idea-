'use client';
import LabeledInput from 'components/input/LabeledInput';
import React, { useCallback } from 'react'
import ReactFlagsSelect from 'react-flags-select';
import { useFormContext } from 'react-hook-form';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import 'react-tailwindcss-select/dist/index.css'
import Select from "react-tailwindcss-select";
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';
import { format } from 'date-fns';
type Props = {}

function BookDetailsSection({ }: Props) {
    
    const { register, setValue, watch } = useFormContext();


    const bookTypesOptions = [
    { value: "paperbook", label: "📖 Book" },
    { value: "ebook", label: "📱 Ebook" },
    { value: "audiobook", label: "🎧 Audiobook" }
  ];

    const insertItem = useCallback((values: SelectValue) => {
        setValue('bookFormat', values);
    }, []);

  return (
      <>
       <div className="flex w-full flex-col gap-2">
          <p className="text-xl text-white font-semibold">Detailed Book Information</p>
          <div className="grid xl:grid-cols-2 2xl:grid-cols-3 lg:max-w-2xl 2xl:max-w-6xl w-full gap-4">
          <div className="flex flex-col gap-1">
<p className="text-white">Version Language</p>
              <ReactFlagsSelect {...register('language', {
              required:'You have to pass the language, so there will be no duplicates !'
              })} searchable showOptionLabel selectButtonClassName='bg-dark-gray text-white border-primary-color font-inherit max-w-xs w-full' selected={watch('language')} onSelect={function (countryCode: string): void {
              setValue('language', countryCode);
     
            } }/>
          </div>
            <LabeledInput  {...register('publishingHouse', {
                           onChange: (e) => {
                  setValue('publishingHouse', e.target.value)
                },
            })} additionalClasses="max-w-xs p-2 w-full" label="Publishing House" type={"dark"} />
            
            <div className="flex flex-col gap-1">
              <p className="text-white text-base">Release Date</p>
            <Popover>
      <PopoverTrigger asChild>
        <div className="flex gap-2 cursor-pointer items-center text-white bg-dark-gray py-2 px-4 h-fit max-w-xs w-full rounded-lg border-2 border-primary-color"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {watch('releaseDate') ? format(watch('releaseDate'), "PPP") : <span>Pick a date</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                     {...register('releaseDate', {
                       valueAsDate: true,
                       validate: {
                         noValue: (value) => {
                           if (!value) {
                             return 'No appropriate Date has been passed !';
                           }
                         },
                         todaysDate: (value) => {
                           if (value && value.getTime() > new Date().getTime()) { 
                             return `You cannot select date greater than today's date.`
                           }
                         },
                       },
            })}
          mode="single"
                    selected={watch('releaseDate')}
                  
                    onSelect={(day, selectedDate) => {

                      setValue('releaseDate', selectedDate);
          }}
                
                  
        />
      </PopoverContent>
            </Popover>
</div>
            
   


            <LabeledInput {...register('pages', {
                                     onChange: (e) => {
                  setValue('pages', e.target.value)
                },
              valueAsNumber: true,
              required:'You have to pass the amount of pages, to allow users tracking their progress.'
                                  })} minNumber={1} inputType='number' additionalClasses="max-w-xs p-2 w-full" label="Pages" type={"dark"} />
          
            <div className="flex flex-col gap-1">
              <p className='text-white'>Accessible Book Types</p>
              <Select isMultiple {...register('bookFormat', {
                validate: {
                  noValues: (value) => {
                    if (!value) {
                      return 'You have not selected any book format !'
                    }
                  }
                },
              })} classNames={{
                'tagItemText': '',
                'tagItemIconContainer': '',
                'list': '',
                'menu': '',
                menuButton: (value)=>'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color'
                
              }} value={watch('bookFormat')} primaryColor='' onChange={(values) => {
                insertItem(values);
              }} options={bookTypesOptions} />
          </div>
          
         
         
          

        </div>
      </div>

           <label className="flex flex-col gap-1 py-2">
          <span className="text-xl text-white font-semibold">Book Description</span>
      <textarea {...register('bookDescription')}  className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
      </label>
  
      </>
  )
}

export default BookDetailsSection