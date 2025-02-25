'use client';
import { useQuery } from '@tanstack/react-query';

import { useAuthContext } from 'hooks/useAuthContext';

import React from 'react'
import classes from '../../../../stylings/gradient.module.css'

import ReadingStats from './elements/ReadingStats';
import CurrentProgressSection from './elements/CurrentProgressSection';
import BasicStatistics from './elements/BasicStatistics';
import MilestoneIncentive from './elements/MilestoneIncentive';

type Props = {}

function MainDashboardViewContainer({}: Props) {
  const { user } = useAuthContext();


  const { data: document } = useQuery({
    queryKey: ['profileDashboardMain'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id:user!.id, include:{
        'recensions':{'include':{'book':true}},
        'ReadingProgress':{orderBy:{'finishTime':'asc'}, include:{
          'book':{
            include:{
              recensions:true,
            },
          },
          user:true
        }}, 
        'notifications':true,
       }}),
    }).then((res) => res.json())
  });


  


 
    return (
        <>
                  {document && document.data && <>
                  <p className='text-white font-semibold text-4xl'>Welcome, <span className={`${classes['header-gradient']} ${classes['button-blue-dark-gradient']} font-bold`}>{document.data.nickname}</span></p>
                  
            
                  <div className="flex flex-col gap-2">
                    <p className='text-3xl text-white'>Overview</p>
            <BasicStatistics document={document} />
            <MilestoneIncentive/>
            
                  </div>
            
                  <div className="px-2 flex flex-col gap-2" >
                    <div className="flex flex-col gap-1 text-white">   
                      {document && document.data.ReadingProgress && document.data.ReadingProgress.length > 0 ?
                        <>
                           <p className='text-3xl'>Currently Reading Book</p>
                    <p>If some thing has changed in your reading progress, you can update it now from dashboard perspective</p>
                        </> : <>
                           <p className='text-3xl font-semibold'>Have Any Book On Eye ?</p>
                    <p>Take the book, read it, insert your reading progresss and grow !</p>
                        </>
                      }
                   
                    </div>
                <CurrentProgressSection document={document} />
            
                  <ReadingStats document={document}/>
                  </div>
            
            
                  </>}

            
    </>
  )
}

export default MainDashboardViewContainer