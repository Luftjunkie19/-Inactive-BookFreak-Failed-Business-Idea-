import { User } from '@supabase/supabase-js'
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper'
import RankingListItem from 'components/ranking/RankingListItem'
import React from 'react'
import { SwiperSlide } from 'swiper/react'

type Props = {document:{data:any | null, error: any | null}, user:User|null}

function Rankings({document, user}: Props) {
  return (
<div className="flex flex-col gap-2">
        <p className='text-white text-xl'>Comparison of your and your friends results</p>
      <div id='rankings' className="max-w-6xl w-full">   
      <BaseSwiper spaceBetween={8} additionalClasses='w-full' slidesOn2XlScreen={3} slidesOnLargeScreen2={3} slidesOnXlScreen={2} slidesOnLargeScreen={2} slidesOnSmallScreen={1}>
      
      <SwiperSlide>
        <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>All-time Ranking</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
              {document && document.data && user && (document.data.friends.length > 0 || document.data.friendsStarted.length > 0) ? [...document.data.friends, ...document.data.friendsStarted, document.data].map((item, index)=>(
                <>
                  {item.invitee && item.Invitor && 
                  <RankingListItem pagesAmount={item.inviteeId === user.id   ? item.Invitor.ReadingProgress.reduce((prev, cur)=> prev.pagesRead + cur.pagesRead, 0) : item.invitee.ReadingProgress.reduce((prev, cur)=> prev.pagesRead + cur.pagesRead, 0)} key={item.id} image={item.inviteeId === user.id  ? item.Invitor.photoURL : item.invitee.photoURL} username={item.inviteeId === user.id   ? item.Invitor.nickname : item.invitee.nickname} rankingPlace={index + 1}  />
                  }
                 
                </>
              )) : <>
              <p>No data about your friends is available.</p>
              </>}
            </div>
      </div>
      </SwiperSlide>
       
        <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Annually Ranking</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
         {document && document.data && user && (document.data.friends.length > 0 || document.data.friendsStarted.length > 0) ? [...document.data.friends, ...document.data.friendsStarted, document.data].map((item, index)=>(
                <>
                  {item.invitee && item.Invitor && 
                  <RankingListItem pagesAmount={item.inviteeId === user.id   ? item.Invitor.ReadingProgress.reduce((prev, cur)=> prev.pagesRead + cur.pagesRead, 0) : item.invitee.ReadingProgress.reduce((prev, cur)=> prev.pagesRead + cur.pagesRead, 0)} key={item.id} image={item.inviteeId === user.id  ? item.Invitor.photoURL : item.invitee.photoURL} username={item.inviteeId === user.id   ? item.Invitor.nickname : item.invitee.nickname} rankingPlace={index + 1}  />
                  }
                 
                </>
              )) : <>
              <p>No data about your friends is available.</p>
              </>}
            </div>
          </div>
      </SwiperSlide>
       
        <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Monthly Ranking</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
          {document && document.data && user && (document.data.friends.length > 0 || document.data.friendsStarted.length > 0) ? [...document.data.friends, ...document.data.friendsStarted, document.data].map((item, index)=>(
                <>
                  {item.invitee && item.Invitor && 
                 ( <RankingListItem pagesAmount={item.inviteeId === user.id   ? item.Invitor.ReadingProgress.reduce((prev, cur)=> prev.pagesRead + cur.pagesRead, 0) : item.invitee.ReadingProgress.reduce((prev, cur)=> prev.pagesRead + cur.pagesRead, 0)} key={item.id} image={item.inviteeId === user.id  ? item.Invitor.photoURL : item.invitee.photoURL} username={item.inviteeId === user.id   ? item.Invitor.nickname : item.invitee.nickname} rankingPlace={index + 1}  />)
                  }
                 
                </>
              )) : <>
              <p>No data about your friends is available.</p>
              </>}
            </div>
          </div>
        </SwiperSlide>
       
   

            
        <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Weekly Ranking</p>
                <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
                  
          {document && document.data && user && (document.data.friends.length > 0 || document.data.friendsStarted.length > 0) ? [...document.data.friends, ...document.data.friendsStarted, document.data].map((item, index)=>(
                <>
                  {item.invitee && item.Invitor && 
                  <RankingListItem pagesAmount={item.inviteeId === user.id   ? item.Invitor.ReadingProgress.reduce((prev, cur)=> prev.pagesRead + cur.pagesRead, 0) : item.invitee.ReadingProgress.reduce((prev, cur)=> prev.pagesRead + cur.pagesRead, 0)} key={item.id} image={item.inviteeId === user.id  ? item.Invitor.photoURL : item.invitee.photoURL} username={item.inviteeId === user.id   ? item.Invitor.nickname : item.invitee.nickname} rankingPlace={index + 1}  />
                  }
                 
                </>
              )) : <>
              <p>No data about your friends is available.</p>
              </>}
            </div>
          </div>
        </SwiperSlide>
     
      </BaseSwiper>
    </div>
      </div>
  )
}

export default Rankings