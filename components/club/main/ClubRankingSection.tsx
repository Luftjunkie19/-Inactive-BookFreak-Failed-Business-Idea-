import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper'
import RankingListItem from 'components/ranking/RankingListItem'
import React from 'react'
import { FaBookOpen } from 'react-icons/fa6'
import { SwiperSlide } from 'swiper/react'

type Props = {document:{data:any | null, error:any | null}}

function ClubRankingSection({document}: Props) {
  return (
    <>
    {document && document.data && 
      <div className="flex rankings flex-col gap-1 py-2 px-3">
        <p className='text-xl flex gap-2 items-center font-semibold text-white'><FaBookOpen className='text-white'/> Reading Activity of the users</p>
        <div className="max-w-5xl w-full ">
          <BaseSwiper slidesOnXlScreen={2} additionalClasses='w-full gap-2'>
            <SwiperSlide className='w-full max-w-xs'>
          <div className="w-full max-w-xs h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
          {document.data.members.sort((a, b) => b.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}
          
          </div>
            </SwiperSlide>
             <SwiperSlide className='w-full max-w-xs'>
          <div className="w-full max-w-xs h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
          {document.data.members.sort((a, b) => b.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}
          </div>
            </SwiperSlide>
           <SwiperSlide className="w-full max-w-xs">
          <div className="w-full max-w-xs h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
           
          {document.data.members.sort((a, b) => b.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}
          </div>
            </SwiperSlide>
          </BaseSwiper>
          
          
         
      </div>
      </div>   
   
      }
      </>
  )
}

export default ClubRankingSection