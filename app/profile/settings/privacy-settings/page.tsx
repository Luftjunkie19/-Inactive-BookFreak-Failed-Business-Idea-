"use client";
import { Popover, PopoverContent, PopoverTrigger, useDisclosure } from '@nextui-org/react';
import Button from 'components/buttons/Button';
import ProfileDashboardBar from 'components/Sidebars/left/profile/ProfileDashboardBar'
import React from 'react'
import { BiWorld } from 'react-icons/bi';
import { BsPersonArmsUp } from 'react-icons/bs';
import { FaBookOpen, FaLock, FaUserFriends } from 'react-icons/fa';
import { FaBaby, FaBook } from 'react-icons/fa6';
import { FiActivity } from 'react-icons/fi';
import { MdLocationCity, MdPrivacyTip } from 'react-icons/md'
import { PiGenderIntersexBold } from 'react-icons/pi'

type Props = {}

function PrivacySettingsPage({}: Props) {

  const visibilityPopover=       <Popover classNames={{
    'content': 'bg-dark-gray rounded-lg text-white outline-none border border-primary-color ',
    'arrow':'bg-primary-color text-primary-color',
    "base":'outline-none'
}} placement="bottom" showArrow offset={10}>
<PopoverTrigger className='text-white cursor-pointer' as='button'>
Visibility
</PopoverTrigger>
<PopoverContent className="max-w-56 min-w-44 w-full">
<div className="w-full flex flex-col gap-2">
<div className="flex cursor-pointer group p-2 justify-between items-center gap-2">
<p className='text-white transition-all group-hover:text-primary-color'>Public</p>
<BiWorld className='group-hover:text-primary-color transition-all text-lg' />
</div>
<div className="flex cursor-pointer group p-2 justify-between items-center gap-2">
<p className='text-white group-hover:text-primary-color transition-all'>Only Friends</p>
<FaUserFriends className='group-hover:text-primary-color transition-all text-lg' />
</div>
<div className="flex cursor-pointer group p-2 justify-between items-center gap-2">
<p className='text-white transition-all group-hover:text-primary-color'>Only Me</p>
<FaLock className='group-hover:text-primary-color transition-all text-lg' />
</div>
</div>
</PopoverContent>
</Popover>;


  return (
    <div className='flex'>
      <ProfileDashboardBar/>
      <div className="sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] px-3 py-2 overflow-y-auto w-full">
        <p className='text-white text-2xl font-semibold flex items-center gap-2'>Privacy Settings <MdPrivacyTip className='text-2xl text-primary-color' /></p>
        <p className='text-white'>Handle your privacy settings, including who can see your profile </p>

        <div className="flex flex-col max-h-80 overflow-y-auto gap-2">
        <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <PiGenderIntersexBold className='text-2xl' />  Gender</p>
         {visibilityPopover}
        </div>

        <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
            <p className='text-white flex text-lg items-center gap-2'> <FaBook  className='text-2xl text-primary-color' /> Favourite Book</p>
         {visibilityPopover}
        </div>

        <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
            <p className='text-white flex text-lg items-center gap-2'> <FaBookOpen  className='text-2xl text-primary-color' /> Currently Reading</p>
         {visibilityPopover}
        </div>

        <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
           <div className="flex flex-col gap-2">
           <p className='text-white flex text-lg items-center gap-2'> <FiActivity  className='text-2xl text-primary-color' /> User Activity</p>
           <p className='text-white text-xs'>(Posts, Comments, Reactions, Recensions)</p>
           </div>
         {visibilityPopover}
        </div>

        <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <MdLocationCity  className='text-2xl text-primary-color' /> Living Town</p>
                {visibilityPopover}
            </div>

            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <FaBaby  className='text-2xl text-primary-color' /> Birth Place</p>
       {visibilityPopover}
            </div>

            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <BsPersonArmsUp  className='text-2xl text-primary-color' /> Hobbies List</p>
           {visibilityPopover}
            </div>



        </div>
      
      <Button type='blue' additionalClasses='px-4 mt-4'>Update</Button>
      </div>
    </div>
  )
}

export default PrivacySettingsPage