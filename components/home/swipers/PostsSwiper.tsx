'use client';

import React, { Suspense } from 'react'
import BaseSwiper from './base-swiper/BaseSwiper'
import { SwiperSlide } from 'swiper/react'
import Post from 'components/elements/activity/Post'
import { useQuery } from '@tanstack/react-query'
import { useAuthContext } from 'hooks/useAuthContext'
import Link from 'next/link';

type Props = {}

function PostsSwiper({ }: Props) {
    const { user } = useAuthContext();
    const { data, error, isFetching, isLoading } = useQuery({
      queryKey: ['swiperPosts'],
      'queryFn': () => fetch('/api/supabase/post/getAll', {
            method: 'POST',
            headers: {
            },
           body: JSON.stringify({
             where: undefined,
             take: undefined,
             skip: undefined,
             orderBy: undefined,
             include: {
               comments: true, owner: true,
               lovers: true,
              viewers:true,
             },
           })
         }).then((item)=>item.json())
    })
  

  return (<>
    <p className='text-white text-2xl px-2 py-1'>The most popular posts of recent time !</p>
    <BaseSwiper freeMode={{ 'enabled': true, minimumVelocity: 250, 'sticky':true, momentumRatio: 2,  'momentum':true ,'momentumBounce':true}} additionalClasses='w-full' slidesOnSmallScreen={1} slidesOnLargeScreen2={1} slidesOnLargeScreen={1} slidesOnXlScreen={1} slidesOn2XlScreen={2}>
    {data && data.data && data.data.map((item, i )=>(
          <Suspense key={item.id} fallback={<p>Loading...</p>}>
      <SwiperSlide className='2xl:max-w-2xl  xs:max-w-sm w-full' key={i}>
        
       <Post addClasses='2xl:max-w-2xl  xs:max-w-sm w-full min-h-96 max-h-96 h-full'  type={'white'} userImg={item.owner.photoURL} username={item.owner.nickname} isOwner={item.owner.id === user?.id} timePassed={''} content={item.body} postData={item} />

    </SwiperSlide>     
       </Suspense>
       ))}
  
    </BaseSwiper>
  </>
  )
}

export default PostsSwiper