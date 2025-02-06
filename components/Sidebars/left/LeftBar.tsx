'use client';
import CreateBtn from '../../buttons/CreateBtn'
import React from 'react'
import SearchBtn from '../../buttons/SearchBtn'
import { Tooltip } from '@nextui-org/react'
import { GiBookCover, GiBookshelf, GiCheckedShield, GiPayMoney } from 'react-icons/gi'
import { RiRobot3Fill } from 'react-icons/ri'
import { usePathname } from 'next/navigation'
import Button from 'components/buttons/Button';
import { FaPeopleGroup, FaQuoteRight, FaTrophy, FaUsers, FaXTwitter } from 'react-icons/fa6';
import { MdEditDocument, MdWorkspacePremium } from 'react-icons/md';
import { BsFillCalendar2EventFill } from 'react-icons/bs';
import { WiStars} from 'react-icons/wi';
import Link from 'next/link';

import { useAuthContext } from 'hooks/useAuthContext';
import { FaDiscord, FaTiktok, FaYoutube } from 'react-icons/fa';

import classes from '../../../stylings/gradient.module.css'
import UserDropDown from 'components/Navbar/User-Dropdown/UserDropDown';
import { ConnectButton } from 'thirdweb/react';
import { client } from 'lib/thirdClient';

type Props = {}

function DefaultLeftBar({ }: Props) {
  const {user } = useAuthContext();
  const location = usePathname();
  return (
    <div className={`overflow-y-auto sm:justify-center xl:justify-normal ${ location.includes('/test/') || location.includes('/competition/') || location.includes('/club/') || location.includes('form/test') || location.includes('/signup') || location.includes('/login') || location.includes('/profile/') || (location.includes('/chat') && !location.includes('aissistant')) || location.includes('/meeting/') ? 'hidden': 'sm:hidden lg:flex'} z-40 py-4 px-2  lg:max-w-fit xl:max-w-52 2xl:max-w-72 w-full  border-r-dark-gray  flex-col gap-2  border-r-2 `}>          
      <div id='left-bar' className="flex flex-col flex-grow gap-2">
        
      <SearchBtn />
      <div className="flex flex-col gap-1">
        <Link href={'/search/books'}>      
        <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <GiBookshelf className='text-2xl'/> <span className='sm:hidden xl:block'>Books</span> 
        </Button>
        </Link>
        <Link href={'/search/users'}>   <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <FaUsers className='text-2xl'/> <span className='sm:hidden xl:block'>Users</span> 
        </Button></Link>
        <Link href={'/search/tests'}>        <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <MdEditDocument className='text-2xl'/> <span className='sm:hidden xl:block'>Tests</span> 
        </Button></Link>
        <Link href={'/search/clubs'}>      <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <GiCheckedShield className='text-2xl'/>  <span className='sm:hidden xl:block'>Clubs</span>
        </Button></Link>
        <Link href={'/search/competitions'}>         <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <FaTrophy className='text-2xl'/>  <span className='sm:hidden xl:block'>Competitions</span> 
        </Button></Link>
        <Link href={'/search/quotes'}>
              <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <FaQuoteRight className='text-2xl'/> <span className='sm:hidden xl:block'>Quotes</span> 
        </Button></Link>
        <Link href={'/search/events'}>   
        <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
              <BsFillCalendar2EventFill className='text-2xl'/> <span className='sm:hidden xl:block'>Events</span> 
          </Button>
        </Link>
       
     


      </div>
   
    </div>
        
      {/* <div className="flex flex-col gap-2">
        <Link href={'/premium'}>
        <Button type='blue' additionalClasses='flex sm:rounded-full xl:rounded-lg items-center gap-2 w-fit sm:p-2 xl:px-3'><span className='sm:hidden xl:block'>Premium</span> <MdWorkspacePremium className='' /></Button>
        </Link>
      </div> */}
      

      <div className="self-start w-fit">
        { user && <UserDropDown userId={user.id}/>}
      </div>
 
      

        
    </div>
  )
}

export default DefaultLeftBar