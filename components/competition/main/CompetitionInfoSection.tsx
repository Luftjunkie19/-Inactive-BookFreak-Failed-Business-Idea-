import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import React from 'react'
import { BiShieldQuarter } from 'react-icons/bi'
import { FaLock, FaLockOpen, FaUserFriends } from 'react-icons/fa'
import { FaClockRotateLeft } from 'react-icons/fa6'
import { GiCrane } from 'react-icons/gi'
import { IoChatbubbles } from 'react-icons/io5'
import { TbClockExclamation, TbListDetails } from 'react-icons/tb'
import { SwiperSlide } from 'swiper/react'

type Props = { document: any}

function CompetitionInfoSection({document}: Props) {
  return (
   <>
           <div className="w-full sm:block xl:hidden">
          <BaseSwiper  slidesOnSmallScreen={2} slidesOnLargeScreen={2} slidesOnLargeScreen2={2} slidesOnXlScreen={2} slidesOn2XlScreen={2} additionalClasses='w-full'>
            <SwiperSlide className='max-w-sm w-full'>
                <div className="w-full h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TbListDetails className=' text-2xl'/>
                <p className='text-2xl font-bold text-white'> Details</p>
                  </div>
                <div className="flex items-center gap-4">
                  {document.data.members.find((item) => item.isCreator) && <Image alt='' width={60} height={60} className='w-10 h-10 rounded-full' src={document.data.members.find((item) => item.isCreator).user.photoURL} />}
                  <div className="flex flex-col gap-1 text-white">
                    <p>Estimated By</p>
                    <p className='text-sm font-extralight'>{document.data.members.find((item) => item.isCreator).user.nickname}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {document.data.isFreeToJoin ? <FaLockOpen className="text-primary-color text-2xl" /> : <FaLock className="text-primary-color text-2xl" />}
                  <div className="flex flex-col gap-1 text-white">
                    <p>{document.data.isFreeToJoin ? `Open Club` : `Closed Club`}</p>
                    <p className='text-sm font-extralight'>{document.data.isFreeToJoin ? `Click the button and enjoy !` : `Request to join the club`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BiShieldQuarter className="text-primary-color text-2xl" />
                  <div className="flex flex-col gap-1 text-white">
                    <p>Administration</p>
                    <div className="flex">
                      {document.data.members.filter((item) => item.isAdmin).map((memberItem) => (<Image alt='' width={60} height={60} className='w-8 h-8 rounded-full' src={memberItem.user.photoURL} />))}
                    </div>
                  </div>
                </div>
               
              </div>
            </SwiperSlide>
              <SwiperSlide className='max-w-sm  w-full'>
                 <div className="w-full h-72   bg-dark-gray p-3 flex flex-col gap-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaClockRotateLeft /> Activity</p>
            <div className="flex items-center gap-6">
              <IoChatbubbles className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>{document && document.data && document.data.chat  && document.data.chat.messages.length} New Messages Today</p>
                <p className='text-sm font-extralight'>In last Month {document && document.data && document.data.chat &&  document.data.chat.messages.length} Messages</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <FaUserFriends className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>{document.data.members.length} Members Together</p>
                <p className='text-sm font-extralight'>Yesterday {document.data.members.length} new members</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <GiCrane  className="text-primary-color text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>Estimated {formatDistanceToNow(new Date(document.data.creationDate))}</p>
                <p className='text-xs font-extralight'>Est. {new Date(document.data.creationDate).toDateString()}</p>
              </div>
                </div>
                 <div className="flex items-center gap-4">
                  <TbClockExclamation className='text-red-500 text-2xl' />
                  <div className="flex flex-col gap-1 text-white">
                  <p>{Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000) < 0 ? 'Expired' : 'Expires in'}</p>
                  <p className='text-sm font-extralight'> <span className='text-red-500 font-bold'>{Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000) <= 0 ? Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000) * -1 : Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000)}</span> {Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000) < new Date().getTime() ? `days ago expired` : 'days'} </p>
                  </div>
                </div>
          </div>
          </SwiperSlide>
          </BaseSwiper>
          </div>
   
          <div className="xl:flex sm:hidden 2xl:flex-col my-4 mx-2 gap-3 2xl:max-w-sm w-full">
         <div className="w-full 2xl:max-w-full xl:max-w-md h-72 details bg-dark-gray p-3 flex flex-col gap-3 rounded-lg">
                <p className='flex gap-4 items-center text-xl font-bold text-white'><TbListDetails /> Details</p>
                <div className="flex items-center gap-4">
                  {document.data.members.find((item) => item.isCreator) && <Image alt='' width={60} height={60} className='w-10 h-10 rounded-full' src={document.data.members.find((item) => item.isCreator).user.photoURL} />}
                  <div className="flex flex-col gap-1 text-white">
                    <p>Estimated By</p>
                    <p className='text-sm font-extralight'>{document.data.members.find((item) => item.isCreator).user.nickname}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {document.data.isFreeToJoin ? <FaLockOpen className="text-primary-color text-2xl" /> : <FaLock className="text-primary-color text-2xl" />}
                  <div className="flex flex-col gap-1 text-white">
                    <p>{document.data.isFreeToJoin ? `Open Club` : `Closed Club`}</p>
                    <p className='text-sm font-extralight'>{document.data.isFreeToJoin ? `Click the button and enjoy !` : `Request to join the club`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BiShieldQuarter className="text-primary-color text-2xl" />
                  <div className="flex flex-col gap-1 text-white">
                    <p>Administration</p>
                    <div className="flex">
                      {document.data.members.filter((item) => item.isAdmin).map((memberItem) => (<Image alt='' width={60} height={60} className='w-8 h-8 rounded-full' src={memberItem.user.photoURL} />))}
                    </div>
                  </div>
                </div>
               
              </div>
            
               <div className="xl:max-w-md 2xl:max-w-full w-full h-72 activity-section  bg-dark-gray p-3 flex flex-col gap-3 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaClockRotateLeft /> Activity</p>
            <div className="flex items-center gap-6">
              <IoChatbubbles className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>{document && document.data && document.data.chat.messages.length} New Messages Today</p>
                <p className='text-sm font-extralight'>In last Month {document && document.data && document.data.chat.messages.length} Messages</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <FaUserFriends className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>{document.data.members.length} Members Together</p>
                <p className='text-sm font-extralight'>Yesterday {document.data.members.length} new members</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <GiCrane  className="text-primary-color text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>Estimated {formatDistanceToNow(new Date(document.data.creationDate))}</p>
                <p className='text-xs font-extralight'>Est. {new Date(document.data.creationDate).toDateString()}</p>
              </div>
                </div>
                 <div className="flex items-center gap-4">
                  <TbClockExclamation className='text-red-500 text-2xl' />
                  <div className="flex flex-col gap-1 text-white">
                  <p>{Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000) < 0 ? 'Expired' : 'Expires in'}</p>
                  <p className='text-sm font-extralight'> <span className='text-red-500 font-bold'>{Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000) <= 0 ? Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000) * -1 : Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000)}</span> {Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000) < new Date().getTime() ? `days ago expired` : 'days'} </p>
                  </div>
                </div>
          </div>                
        </div>
   </>
          

  )
}

export default CompetitionInfoSection