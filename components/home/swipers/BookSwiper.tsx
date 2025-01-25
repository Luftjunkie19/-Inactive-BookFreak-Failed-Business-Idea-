'use client';
import React, { Suspense } from 'react';

import Book from 'components/elements/Book';
import { SwiperSlide } from 'swiper/react';
import BaseSwiper from './base-swiper/BaseSwiper';
import { useQuery } from '@tanstack/react-query';
import SkeletonBook from 'components/skeletons/main-components/SkeletonBook';


type Props = {}

function BookSwiper({}: Props) {
   const { data, error, isFetching, isLoading } = useQuery({
      queryKey: ['homeBooks'],
      'queryFn':  () => fetch('/api/supabase/book/getAll', {
            method: 'POST',
            headers: {
            },
            body: JSON.stringify({ skip: undefined, take: undefined, where: undefined, include:{recensions:true} })
      }).then((item) => item.json())
})
   
   return (<>
    <Suspense fallback={<p className='text-red-500'>Loading....</p>}>          
      <p className='text-white text-2xl px-2 py-1'>Books, that might interest you</p>
    
    <BaseSwiper spaceBetween={16} slidesOnSmallScreen={1.5} slidesOnLargeScreen2={2} slidesOnLargeScreen={3} slidesOnXlScreen={3} slidesOn2XlScreen={6} additionalClasses='w-full'>
            {isLoading && <>
            <SwiperSlide>
            <SkeletonBook />
               </SwiperSlide>
               
               <SwiperSlide>
            <SkeletonBook />
            </SwiperSlide>

            <SwiperSlide>
            <SkeletonBook />
               </SwiperSlide>
               
               <SwiperSlide>
            <SkeletonBook />
            </SwiperSlide>

            <SwiperSlide>
            <SkeletonBook />
               </SwiperSlide>
               
                  <SwiperSlide>
            <SkeletonBook />
            </SwiperSlide>

               <SwiperSlide>
            <SkeletonBook />
            </SwiperSlide>
            
            </>}
     
            {data && data.data && data.data.map((item, i) => (
        <SwiperSlide key={i}>
        <Book recensions={item.recensions.length} bookId={item.id} bookCover={item.bookCover} pages={item.pages} author={item.bookAuthor} title={item.title} bookCategory={item.genre} type={'transparent'} />
    </SwiperSlide>     
       ))}
  
    </BaseSwiper>
       </Suspense>
    </>
 )
}

export default BookSwiper