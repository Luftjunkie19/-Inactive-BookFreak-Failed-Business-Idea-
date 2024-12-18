'use client';
import { useCheckPathname } from 'hooks/useCheckPathname'
import introJs from 'intro.js';
import useTourGuide from 'lib/TourGuideData';
import { InfoIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { FaLink, FaQuestion, FaUserFriends } from 'react-icons/fa';
import { GiWallet } from 'react-icons/gi';
import { IoSettings, IoStatsChart } from 'react-icons/io5';
import { MdOutlineQueryStats } from 'react-icons/md';
import "../../../../stylings/tourguide.css"

type Props = {}

function ProfileDashboardBar({ }: Props) {
    const { includesElements} = useCheckPathname();

    const { steps } = useTourGuide();
  return (
      <div
          className={`sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] 2xl:max-w-72 2xl:w-full sm:w-fit ${includesElements('settings') || includesElements('profile/dashboard') ? 'sm:hidden lg:flex' : 'hidden'} flex-col justify-between gap-6 bg-dark-gray p-4 border-r border-primary-color text-white`}>
          
          <div className="flex flex-col gap-2">
              <p className='text-2xl'>Dashboard</p>
              <div className="flex flex-col gap-2">
                  <Link className='flex gap-2 items-center' suppressHydrationWarning href={'/profile/dashboard'}>Overall</Link>
                  <Link className='flex gap-2 items-center' suppressHydrationWarning href={'/profile/dashboard/you&friends'}>You and Friends <FaUserFriends /></Link>
                                    <Link className='flex gap-2 items-center' suppressHydrationWarning href={'/profile/dashboard/fincances'}>Financial Data <GiWallet /></Link>
                  <Link className='flex gap-2 items-center' suppressHydrationWarning href={'/profile/dashboard/links'}>Links <FaLink /></Link>
                  <Link className='flex gap-2 items-center' suppressHydrationWarning href={'/profile/dashboard/book-progress'}>Your Progress <MdOutlineQueryStats /></Link>
                                                      <Link className='flex gap-2 items-center' suppressHydrationWarning href={'/profile/dashboard/reading-stats'}>Book Statistics <IoStatsChart />  </Link>
                  <Link className='flex gap-2 items-center' suppressHydrationWarning href={'/profile/settings'}>Settings <IoSettings /></Link>
              </div>
          </div>

          <div className="flex flex-col gap-1">
              <button onClick={() => {
                  introJs().setOptions({ 'steps': steps }).start();
              }} className='flex gap-2 items-center w-fit hover:text-primary-color transition-all'>Help <FaQuestion/></button>
              <Link href={'/'}>Back to home</Link>
          </div>

    </div>
  )
}

export default ProfileDashboardBar