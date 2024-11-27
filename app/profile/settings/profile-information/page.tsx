'use client';
import { Popover, PopoverContent, PopoverTrigger, useDisclosure } from '@nextui-org/react';
import Button from 'components/buttons/Button';
import ModalComponent from 'components/modal/ModalComponent';
import ProfileDashboardBar from 'components/Sidebars/left/profile/ProfileDashboardBar'
import React from 'react'
import { FaBook, FaCheck } from 'react-icons/fa6';
import { IoIosFemale, IoIosMale } from 'react-icons/io';
import { PiGenderIntersexBold } from 'react-icons/pi'
import Select from 'react-tailwindcss-select'
import { SelectValue } from 'react-tailwindcss-select/dist/components/type'

type Props = {}

function ProfileInformationPage({}: Props) {

  const {isOpen, onOpenChange, onOpen, onClose}=useDisclosure();


  return (
    <div className='w-full h-full flex'>
           <ProfileDashboardBar/>
           <div className="sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] p-2 overflow-y-auto w-full">
            <p className='text-2xl text-white font-semibold'>Profile Information</p>
            <p className='text-white'>Manage Your Profile: Update Your Personal Details and Preferences</p>
           
           <div className="flex flex-col gap-2">
            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <PiGenderIntersexBold className='text-2xl' />  Gender</p>
                <Popover classNames={{
                    'content': 'bg-dark-gray rounded-lg text-white outline-none border border-primary-color ',
                    'arrow':'bg-primary-color text-primary-color',
                    "base":'outline-none'
                }} placement="bottom" showArrow offset={10}>
      <PopoverTrigger className='text-white cursor-pointer' as='button'>
   {'Select Gender'}
      </PopoverTrigger>
      <PopoverContent className="max-w-36 min-w-36 w-full">
        <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
        <p onClick={()=>{console.log('male')}} className='flex text-base gap-2 items-center hover:text-primary-color cursor-pointer transition-all'><IoIosMale className='text-base' /> Male</p>

            </div>
        <p onClick={()=>{console.log('female')}} className='flex text-base gap-2 items-center hover:text-primary-color cursor-pointer transition-all'><IoIosFemale className='text-base'/> Female</p>
        </div>
      </PopoverContent>
      </Popover>
            </div>

            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <FaBook  className='text-2xl text-primary-color' /> Favourite Book</p>
            <Button onClick={onOpen} type="blue">Select Book</Button>
            </div>

<ModalComponent isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} modalTitle='Favourited Books' modalSize='lg'/>

           </div>
           </div>
    </div>
  )
}

export default ProfileInformationPage