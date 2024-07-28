'use client';
import CreateBtn from '../../buttons/CreateBtn'
import React from 'react'
import SearchBtn from '../../buttons/SearchBtn'
import { Tooltip } from '@nextui-org/react'
import { GiBookCover, GiBookshelf, GiCheckedShield, GiPayMoney } from 'react-icons/gi'
import { RiRobot3Fill } from 'react-icons/ri'
import { usePathname } from 'next/navigation'
import Button from 'components/buttons/Button';
import { FaPeopleGroup, FaQuoteRight, FaTrophy, FaUsers } from 'react-icons/fa6';
import { MdEditDocument, MdWorkspacePremium } from 'react-icons/md';
import { BsFillCalendar2EventFill } from 'react-icons/bs';
import { WiStars} from 'react-icons/wi';
import Link from 'next/link';
import { GrDocumentPerformance } from 'react-icons/gr';
import { useAuthContext } from 'hooks/useAuthContext';

type Props = {}

function DefaultLeftBar({ }: Props) {
  const {user } = useAuthContext();
  const location = usePathname();
  return (
    <div className={`h-screen w-fit ${location.includes('search') || location.includes('/competition/') || location.includes('club') || location.includes('signup') || location.includes('login') ? 'hidden': 'sm:hidden lg:flex'} z-40 py-4 px-2 max-w-64 w-full  border-r-dark-gray  flex-col gap-2 rounded-r-xl border-r-2 `}>          
    
      <SearchBtn />
      <div className="flex flex-col gap-2">
        <Link href={'/search/books'}>      
        <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <GiBookshelf className='text-2xl'/> Books
        </Button>
        </Link>
        <Link href={'/search/users'}>   <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <FaUsers className='text-2xl'/> Users
        </Button></Link>
        <Link href={'/search/tests'}>        <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <MdEditDocument className='text-2xl'/> Tests
        </Button></Link>
        <Link href={'/search/clubs'}>      <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <GiCheckedShield className='text-2xl'/> Clubs
        </Button></Link>
        <Link href={'/search/competitions'}>         <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <FaTrophy className='text-2xl'/> Competitions
        </Button></Link>
        <Link href={'/search/quotes'}>
              <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
          <FaQuoteRight className='text-2xl'/> Quotes
        </Button></Link>
        <Link href={'/search/events'}>   
        <Button type='transparent' additionalClasses=' flex gap-4 items-center text-white font-light'>
              <BsFillCalendar2EventFill className='text-2xl'/> Events
          </Button>
        </Link>
       
     


      </div>
      
      <p className='text-white flex gap-4 text-lg items-center'>Premium Features <WiStars className=' text-primary-color text-2xl'/> </p>
      <div className="flex gap-2 flex-col">
          <Link href={'/aissistant'}>   
        <Button type='transparent' additionalClasses=' flex gap-2 items-center font-medium'>
              <RiRobot3Fill className='text-2xl text-gray-600'/> <p className=' text-gray-600'><span className=' text-primary-color'>B</span>ook<span className=' text-primary-color'>F</span>reak AIssistant</p>
          </Button>
        </Link>
          <Link href={'/ai-test-creator'}>   
        <Button type='transparent' additionalClasses=' flex gap-2 items-center font-medium'>
              <GrDocumentPerformance className='text-2xl text-gray-600'/> <p className=' text-gray-600'>AI-Test Creator</p>
          </Button>
        </Link>
          <Link href={'/aissistant'}>   
        <Button type='transparent' additionalClasses=' flex gap-2 items-center font-medium'>
              <GiBookCover  className='text-2xl text-gray-600'/> <p className=' text-gray-600'>BookCover Creator</p>
          </Button>
        </Link>
</div>
      <div className="flex flex-col gap-2">
        <p className="text-white font-semibold">Become Premium Freak !</p>
        <Button type='blue' additionalClasses='flex items-center gap-2 w-fit px-3'>Premium <MdWorkspacePremium className='' /></Button>
</div>
      

      <Tooltip classNames={{
        content:"text-white bg-dark-gray border border-primary-color"
       }} content="Replenish your account">
      <button className=' text-green-300 flex items-center gap-2'><GiPayMoney className=' text-2xl' /> Replenish account</button>
      </Tooltip>

        
    </div>
  )
}

export default DefaultLeftBar