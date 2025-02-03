import { User } from '@supabase/supabase-js'
import Button from 'components/buttons/Button'
import { PagesPerDayChart } from 'components/charts/competition/CompetitionCharts'
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper'
import RankingListItem from 'components/ranking/RankingListItem'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { SwiperSlide } from 'swiper/react'

type Props = { document: any, competitionRankingMembers:any[], user: User | null }

function CompetitionDetails({document, competitionRankingMembers, user}: Props) {
  return (
<div className="flex flex-col gap-3 p-1 overflow-y-auto h-auto overflow-x-hidden max-w-4xl w-full">
          <div className="flex flex-col gap-1">
           <div className="flex flex-wrap prize gap-3 p-1 w-full lg:items-center">
                <div className="w-full max-w-xs h-72 bg-dark-gray items-center p-2 flex flex-col justify-around border-green-400 border shadow-green-400 shadow gap-2 rounded-lg">
                  {document.data.prize.isPrizeItem && 
                    <>
                  {document.data.prize.book && <Link href={`/book/${document.data.prize.book.id}`} className='flex flex-col gap-1 items-center justify-center'>
                    <Image width={60} height={60} className='w-16 h-24 rounded-lg' src={document.data.prize.book} alt='' />
                      <p className='text-white'>{document.data.prize.book.title}</p>
                    </Link>}


                     {document.data.prize.voucherFor && <div className='flex flex-col gap-1 items-center justify-center'>
                    <Image width={60} height={60} className='w-16 h-24 rounded-lg' src={document.data.prize.book} alt='' />
                      <p className='text-white'>{document.data.prize.prizeName}</p>
   <p className='text-white'>{document.data.prize.book.itemType}</p>
                    </div>}
                   
                    </>
                  }

                  {!document.data.prize.isPrizeItem && 
                    <>
                    <p className=' text-5xl font-bold text-green-400'>{document.data.prize.prizeMoneyAmount} {document.data.prize.prizeMoneyCurrency}</p>
                  </>
                  }
              <div className="flex flex-col gap-1 items-center">
              <p className='text-white text-lg self-center'>Prize only for the ranking-leader</p> 
<p className='text-yellow-700 text-3xl self-center font-bold'>#1</p>               
              </div>  
                  

      
   
          </div>

               <div className="w-full max-w-xs h-72 bg-dark-gray justify-around items-center  p-2 flex flex-col gap-4 rounded-lg">
              <div className="flex flex-col gap-1 justify-around items-center">
                <Image src={competitionRankingMembers[0].photoURL} width={60} height={60} className='w-12 h-12 rounded-full' alt=''/>
              <p className='text-white self-center'>Winner</p>
              <p className='text-white'>1. {competitionRankingMembers[0].nickname} - {competitionRankingMembers[0].points} Points</p>
                  </div>

              <div className="flex flex-col gap-2 items-center">
                    {new Date(document.data.endDate).getTime() <= new Date().getTime() ? <>      
            {user && competitionRankingMembers[0].id === user.id && 
            <Button type={'black'} additionalClasses='bg-green-400 hover:bg-green-500 hover:scale-95 transition-all'>Claim Reward</Button>
            }  
         <p className='text-yellow-700 text-sm'>
              {competitionRankingMembers[0].nickname} is the winner
            </p> 
                    </> : <>
                        <p className='text-white text-center'>The winner will be announced on <span className='text-red-500'>{new Date(document.data.endDate).toLocaleDateString()}</span></p>
                    </>}
              </div>
          </div>
           </div>
            </div>
            




        
        <div className="flex flex-col gap-1">
          <BaseSwiper spaceBetween={2} additionalClasses='w-full rankings' slidesOn2XlScreen={2} slidesOnLargeScreen2={1} slidesOnXlScreen={2} slidesOnLargeScreen={1} slidesOnSmallScreen={1}>
            <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Participants Ranking</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">

                 

             {document && document.data && document.data.members && competitionRankingMembers.map((member, index) => (
               <RankingListItem key={member.id} image={member.photoURL} username={member.nickname} points={member.points} rankingPlace={index + 1} />
             ))}
               
                
           
             
            </div>
          </div>
            </SwiperSlide>

                <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Overall Ranking</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            
             {document.data.members.sort((a, b) => b.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}
               
                
           
             
            </div>
          </div>
            </SwiperSlide>
                    <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Week's Best Readers</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            {document.data.members.sort((a, b) => b.user.ReadingProgress.filter((item)=> new Date(item.finishTime).getTime() - new Date().getTime() <= 7 * 24 * 3600 * 1000 ).map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.filter((item)=> new Date(item.finishTime).getTime() - new Date().getTime() <= 7 * 24 * 3600 * 1000 ).map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}      
            </div>
          </div>
            </SwiperSlide>
            <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Month's Best Readers</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            {document.data.members.sort((a, b) => b.user.ReadingProgress.filter((item)=> new Date(item.finishTime).getTime() - new Date().getTime() <= 30 * 24 * 3600 * 1000 ).map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.filter((item)=> new Date(item.finishTime).getTime() - new Date().getTime() <= 30 * 24 * 3600 * 1000 ).map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}
            </div>
          </div>
            </SwiperSlide>
       
            
          </BaseSwiper>

          <div className="flex flex-col ">
            <p className='text-white text-lg'>Data from members' progresses</p>
             <BaseSwiper spaceBetween={2} additionalClasses='w-full charts-section' slidesOn2XlScreen={2} slidesOnLargeScreen2={1} slidesOnXlScreen={2} slidesOnLargeScreen={1} slidesOnSmallScreen={1}>
            <SwiperSlide>
               <div className='max-w-sm w-full h-64 rounded-lg bg-dark-gray p-2'>
       <PagesPerDayChart className='w-full h-full' dataKeyForXValue={''} dataKeyForYValue={''} arrayOfData={[]} />
          </div>
            </SwiperSlide>
               <SwiperSlide>
               <div className='max-w-sm w-full h-64 rounded-lg bg-dark-gray p-2'>
       <PagesPerDayChart className='w-full h-full' dataKeyForXValue={''} dataKeyForYValue={''} arrayOfData={[]} />
          </div>
            </SwiperSlide>
               <SwiperSlide>
               <div className='max-w-sm w-full h-64 rounded-lg bg-dark-gray p-2'>
       <PagesPerDayChart className='w-full h-full' dataKeyForXValue={''} dataKeyForYValue={''} arrayOfData={[]} />
          </div>
          </SwiperSlide>
          </BaseSwiper>
          </div>
        </div>
         
  </div>
  )
}

export default CompetitionDetails