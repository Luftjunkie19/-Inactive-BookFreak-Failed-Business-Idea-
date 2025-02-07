
import {
  BiSolidBookHeart,
} from 'react-icons/bi';
import {
  FaBook,
  FaBookOpen,
  FaBookReader,
  FaFemale,
  FaMale,
  FaTrophy
} from 'react-icons/fa';




import Link from 'next/link';


import { User } from '@supabase/supabase-js'
import useVisibility from 'hooks/useVisibility'
import React from 'react'
import { MdReviews } from 'react-icons/md';

type Props = {
    document: { data: any | null, error: any | null },
    user: User | null,
    userId: string


}

function ProfileDetails({
    document,
    user,
    userId

}: Props) {

    
    const { allowedToSeeProperty } = useVisibility();


  return (
        <div className="flex sm:max-w-5xl 2xl:max-w-md w-full sm:flex-col xl:flex-row 2xl:flex-col gap-4">
               <div className="flex flex-col gap-2 rounded-lg border-2 p-2 border-primary-color bg-dark-gray w-full">
              <p className='text-xl text-white font-semibold'>Details</p>
                <div className="max-h-40 h-full text-white overflow-y-auto">{document.data.description}</div>
              <div className="flex gap-2 text-white items-center">
                  {document.data.gender && user && allowedToSeeProperty(document.data, [...document.data.blockedUsers, ...document.data.blockerUser].find((item) => item.blockedId === user.id), [...document.data.friendsStarted, ...document.data.friends].find((item) => item.inviterUserId === user.id || item.inviteeId === userId), 'gender') ? <>
           <FaMale className='text-2xl' />
           <p>Male</p>
                  </> : <>
                  <FaFemale className='text-2xl' />
                             <p>Female</p>
                  </> 
                  }
              </div>
                {document.data.favBookId  &&
                  <div className="flex gap-3 text-white items-center">
                    <BiSolidBookHeart className='text-2xl' />
                    <div className="flex flex-col ">
                      <p className='font-light'>Favourite Book</p>
                      <Link href={`/book/${document.data.favBookId}`} className='text-white hover:underline transition-all '>Link to Fav Book</Link>
                    </div>
                  </div>}
                
                
                  <div className="flex gap-3 text-white items-center">
                <FaBookOpen  className='text-2xl' />
         <div className="flex flex-col ">
                  <p className='font-light'>Currently Reading</p>
                  <Link href={`/book/${document.data.ReadingProgress.sort((a, b) => new Date(b.finishTime).getTime() - new Date(a.finishTime).getTime()).filter((item)=> !item.isBookFinished)[0].book.id}`} className='text-white hover:underline transition-all hover:text-primary-color'>{document.data.ReadingProgress.sort((a, b) => new Date(b.finishTime).getTime() - new Date(a.finishTime).getTime()).filter((item)=> !item.isBookFinished)[0].book.title}</Link>
                </div>
              </div>
              </div>
              
              <div className="flex flex-col gap-2 max-w-md rounded-lg border-2 p-2 border-primary-color bg-dark-gray w-full">
                <p className='text-xl text-white font-semibold'>Statistics</p>
                <div className="flex flex-col p-1 gap-6">
              <div className="flex gap-2 text-white items-center">
                <FaTrophy className='text-2xl text-yellow-600' />
                <p>2 Competitions won</p>
              </div>
              <div className="flex gap-3 text-white items-center">
                <FaBookReader className='text-2xl text-primary-color' />
               <p>{document.data.ReadingProgress.filter((item)=> new Date(item.finishTime).getFullYear() === new Date().getFullYear()).filter((item)=> item.isBookFinished).length} Books Read this year</p>
              </div>
                  <div className="flex gap-3 text-white items-center">
                <FaBook  className='text-2xl' />

                  <p className='font-light'>{document.data.ReadingProgress.filter((item)=> item.isBookFinished).length} Books read in total</p>
                  </div>
                  
                  <div className="flex gap-3 text-white items-center">
                  <MdReviews className='text-2xl text-primary-color'/>

                    <p className='font-light'>{document.data.recensions.length} Reviews Shared</p>
                  </div>


                </div>
            </div>
           </div>
  )
}

export default ProfileDetails