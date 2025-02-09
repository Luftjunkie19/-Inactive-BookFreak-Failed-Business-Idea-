'use client';
import { Switch } from '@nextui-org/react'
import Button from 'components/buttons/Button';
import ProfileDashboardBar from 'components/Sidebars/left/profile/ProfileDashboardBar'
import React from 'react'
import { FaBookOpen, FaShieldAlt, FaUserFriends } from 'react-icons/fa'
import { FaMessage, FaRankingStar } from 'react-icons/fa6';
import { FiActivity } from 'react-icons/fi';
import { IoChatbubbles } from 'react-icons/io5';


type Props = {}

function NotificationSettingsPanel({}: Props) {
  return (
      <div className="sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] p-2 overflow-y-auto w-full">
            <p className='text-white text-2xl font-bold'>Notifications</p>
            <p className='text-white'>Adjust your notification settings, to get notified about new activities on your profile</p>
    
         <div className="flex flex-col gap-2 overflow-y-auto max-h-80">
         
         <div className="w-full flex justify-between mt-2 gap-2 bg-dark-gray p-2 rounded-lg max-w-xl">
              <div className="flex flex-col gap-2">
              <p className='text-white text-lg flex gap-2 items-center'> <FaRankingStar className='text-2xl text-primary-color' /> Competitions</p>
              <p className='text-white text-xs'>Enable notifications for competitions</p>
              </div>
            
              <Switch color="success" size="md"/> 
            </div>
           
            <div className="w-full flex justify-between mt-2 gap-2 bg-dark-gray p-2 rounded-lg max-w-xl">
              <div className="flex flex-col gap-2">
              <p className='text-white text-lg flex gap-2 items-center'> <FaShieldAlt className='text-2xl text-primary-color' /> Clubs</p>
              <p className='text-white text-xs'>Enable notifications for clubs</p>
              </div>
            
              <Switch color="success" size="md"/> 
            </div>
    
            <div className="w-full flex justify-between mt-2 gap-2 bg-dark-gray p-2 rounded-lg max-w-xl">
              <div className="flex flex-col gap-2">
              <p className='text-white text-lg flex gap-2 items-center'> <IoChatbubbles className='text-2xl text-primary-color' /> Messages</p>
              <p className='text-white text-xs'>Enable notifications for messages</p>
              </div>
            
              <Switch color="success" size="md"/> 
            </div>
            <div className="w-full flex justify-between mt-2 gap-2 bg-dark-gray p-2 rounded-lg max-w-xl">
              <div className="flex flex-col gap-2">
              <p className='text-white text-lg flex gap-2 items-center'> <FaUserFriends className='text-2xl text-primary-color' /> Friends Activity</p>
              <p className='text-white text-xs'>Enable notifications for Friends&apos; activity</p>
              </div>
            
              <Switch color="success" size="md"/> 
            </div>
            <div className="w-full flex justify-between mt-2 gap-2 bg-dark-gray p-2 rounded-lg max-w-xl">
              <div className="flex flex-col gap-2">
              <p className='text-white text-lg flex gap-2 items-center'> <FiActivity className='text-2xl text-primary-color' /> Posts&apos; Activity</p>
              <p className='text-white text-xs'>Enable notifications for posts&apos; activity</p>
              </div>
            
              <Switch color="success" size="md"/> 
            </div>
         </div>
    
         <Button type='blue' additionalClasses='px-6 mt-4'>Save</Button>
           
           </div>
  )
}

export default NotificationSettingsPanel