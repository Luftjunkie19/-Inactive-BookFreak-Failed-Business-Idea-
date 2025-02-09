'use client';
import Button from 'components/buttons/Button';
import { useRouter } from 'next/navigation';
import React from 'react'
import { IoLockClosed, IoNotifications, IoPerson } from 'react-icons/io5';

type Props = {}

function SettingsOption({ }: Props) {
    
         const navigate = useRouter();
  return (
    <div className="flex flex-col gap-2 p-2">
            <p className='text-white text-2xl font-semibold'>Change also other settings like:</p>
            <div className="flex overflow-x-auto gap-3 items-center">
            <Button onClick={()=>{
              navigate.push('/profile/settings/profile-information');
            }} additionalClasses='flex  gap-2 items-center' type="blue">Profile Information <IoPerson className='text-white'/> </Button>
            <Button onClick={()=>{
              navigate.push('/profile/settings/privacy-settings');
            }} additionalClasses='flex  gap-2 items-center' type="blue">Privacy Settings <IoLockClosed className='text-white'/> </Button>
            <Button  onClick={()=>{
              navigate.push('/profile/settings/notifications');
            }} additionalClasses='flex group hover:bg-white hover:text-primary-color transition-all duration-500  gap-2 items-center' type="blue">Notifications <IoNotifications className='text-white group-hover:text-yellow-400 group-hover:animate-ping duration-300 transition-all'/> </Button>

            </div>
          </div>
  )
}

export default SettingsOption