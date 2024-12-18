'use client';

import { useAuthContext } from 'hooks/useAuthContext';
import React, { Suspense, useCallback, useEffect, useState } from 'react';
import classes from '../../../stylings/gradient.module.css'
import { FaBook } from 'react-icons/fa6';
import { MdReviews } from 'react-icons/md';
import { FaBookOpen, FaSearch, FaTrophy } from 'react-icons/fa';
import Book from 'components/elements/Book';
import { Progress } from '@nextui-org/react';
import Button from 'components/buttons/Button';
import { Area, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AreaChart } from 'lucide-react';
import { PagesPerDayChart } from 'components/charts/competition/CompetitionCharts';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import { SwiperSlide } from 'swiper/react';
import { useQuery } from '@tanstack/react-query';
import { ShadcnBarChart, ShadcnLineChart, ShadcnPieChart } from 'components/charts/ShadcnChart';
import { format, formatDistance, intervalToDuration } from 'date-fns';
import { ChartConfig } from '@/components/ui/chart';
import { useRouter } from 'next/navigation';
import useContvertData from 'hooks/useContvertData';

type Props = {}

function Page({ }: Props) {
  const { user } = useAuthContext();
  const navigate= useRouter();  

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




 
  const {displayFeelingsPieChartData, getUniqueBooks, displayHapinessDayTimeRelationData, getHappinessRelationshipConfig, getDailyLineProgressData}=useContvertData();

  const pieChartHappinessDayTimeRelationshipData = document && displayHapinessDayTimeRelationData(document && document.data, document.data.ReadingProgress);


  return (
    <div className='flex sm:h-[calc(100vh-3rem)] overflow-y-auto lg:h-[calc(100vh-3.5rem)] flex-col gap-3'>{document && document.data && <>
      <p className='text-white text-4xl'>Welcome, <span className={`${classes['header-gradient']} ${classes['button-blue-dark-gradient']} font-bold`}>{document.data.nickname}</span></p>
      

      <div className="flex flex-col gap-2">
        <p className='text-3xl font-semibold text-white'>Overview</p>
        <div id='basic-stats' className="max-w-5xl p-4 flex sm:flex-col xl:flex-row gap-4 justify-between items-center bg-dark-gray rounded-lg w-full">
          <div className="flex gap-4 items-center">
          <div className="w-16 h-16 flex bg-primary-color justify-center items-center rounded-full">
            <FaBook className='text-3xl text-white'/>
          </div>
           <div className="flex flex-col gap-1 text-white">
            <p>Your books read this month</p>
            <p className='text-2xl font-bold'>{getUniqueBooks(document.data.ReadingProgress.filter((item)=> new Date(item.finishTime) >= new Date(new Date().setDate(new Date().getDate() - 30)) && item.book.pages === document.data.ReadingProgress.filter((item)=> new Date(item.finishTime) >= new Date(new Date().setDate(new Date().getDate() - 30))).map((item)=> item.pagesRead).reduce((a, b) => a + b, 0))).length}</p>
          </div>
          </div>

            <div className="flex gap-4 items-center">
          <div className="w-16 h-16 flex bg-secondary-color justify-center items-center rounded-full">
            <MdReviews className='text-3xl text-primary-color'/>
          </div>
           <div className="flex flex-col gap-1 text-white">
            <p>Reviews, you have shared</p>
            <p className='text-2xl font-bold'>{document.data.recensions.length}</p>
          </div>
          </div>

            <div className="flex gap-4 items-center">
          <div className="w-16 h-16 flex bg-secondary-color justify-center items-center rounded-full">
            <FaTrophy className='text-3xl text-yellow-600'/>
          </div>
           <div className="flex flex-col gap-1 text-white">
            <p>Your books read this year</p>
            <p className='text-2xl text-yellow-600 font-bold'>{getUniqueBooks(document.data.ReadingProgress.filter((item)=> new Date(item.finishTime) >= new Date(new Date().setDate(new Date().getDate() - 365)) && item.book.pages === document.data.ReadingProgress.filter((item)=> new Date(item.finishTime) >= new Date(new Date().setDate(new Date().getDate() - 365))).map((item)=> item.pagesRead).reduce((a, b) => a + b, 0))).length}</p>
          </div>
          </div>

      </div>
      </div>

      <div className="px-2 flex flex-col gap-2" >
        <div className="flex flex-col gap-1 text-white">   
          {document && document.data.ReadingProgress && document.data.ReadingProgress.length > 0 ?
            <>
               <p className='text-3xl font-semibold'>Currently Reading Book</p>
        <p>If some thing has changed in your reading progress, you can update it now from dashboard perspective</p>
            </> : <>
               <p className='text-3xl font-semibold'>Have Any Book On Eye ?</p>
        <p>Take the book, read it, insert your reading progresss and grow !</p>
            </>
          }
       
        </div>
        <div id="current-progress" className="flex sm:flex-col xl:flex-row items-center gap-6">
        <div className="flex sm:flex-col lg:flex-row items-center max-w-3xl w-full gap-12">
            {document && document.data && document.data.ReadingProgress && document.data.ReadingProgress.length > 0 ?
              <>
          <Book additionalClasses='max-w-52 w-full' bookCover={document.data.ReadingProgress[0].book.bookCover} pages={document.data.ReadingProgress[0].book.pages} author={document.data.ReadingProgress[0].book.bookAuthor} bookId={document.data.ReadingProgress[0].book.id} title={document.data.ReadingProgress[0].book.title} bookCategory={document.data.ReadingProgress[0].book.genre} type={'white'} recensions={document.data.ReadingProgress[0].book.recensions.length} />
          <div className="flex max-w-xl w-full flex-col gap-2">
            <p className='text-2xl font-semibold text-white'>{document.data.ReadingProgress[0].book.title}</p>
            <p className='text-white'>{document.data.ReadingProgress.filter((item)=> item.bookId === document.data.ReadingProgress[0].book.id).map((item)=>item.pagesRead).reduce((partialSum, a) => partialSum + a, 0)}/{document.data.ReadingProgress[0].book.pages} Read Pages</p>
            <Progress
              aria-label='loading...'
              className="max-w-60 w-full"
      size='lg'
      value={(document.data.ReadingProgress.filter((item)=> item.bookId === document.data.ReadingProgress[0].book.id).map((item)=>item.pagesRead).reduce((partialSum, a) => partialSum + a, 0) / document.data.ReadingProgress[0].book.pages) * 100}
              classNames={{
                'indicator':'bg-primary-color'
              }}

            />
            <p className='text-white'>{((document.data.ReadingProgress.filter((item)=> item.bookId === document.data.ReadingProgress[0].book.id).map((item)=>item.pagesRead).reduce((partialSum, a) => partialSum + a, 0) / document.data.ReadingProgress[0].book.pages) * 100).toFixed(2)}% Done</p>
            <Button onClick={()=> navigate.push(`/profile/dashboard/book-progress?bookId=${document.data.ReadingProgress[0].book.id}?readToday=${true}`)} type={'blue'} additionalClasses='flex w-fit px-3 gap-3 items-center justify-around'><span>Read Now</span> <FaBookOpen /> </Button>
</div>        
              </>
              :
              <>
                      <Book additionalClasses='max-w-52 w-full' bookCover={''} pages={150} author={'Book Author'} bookId={''} title={'Book Title'} bookCategory={'Book Genre'} type={'white'} recensions={0} />
          <div className="flex max-w-xl w-full flex-col gap-2">
            <p className='text-2xl font-semibold text-white'>Book Title</p>
            <p className='text-white'>{39}/{150} Read Pages</p>
            <Progress
              aria-label='loading...'
              className="max-w-60 w-full"
      size='lg'
      value={26}
              classNames={{
                'indicator':'bg-primary-color'
              }}

            />
            <p className='text-white'>{26}% Done</p>
            <Button onClick={()=> navigate.push(`/search/books`)} type={'blue'} additionalClasses='flex w-fit px-3 gap-3 items-center justify-around'><span>Search Now</span> <FaSearch /> </Button>
</div>

              </>
          }
      
        </div>

          <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
            <ShadcnBarChart data={[
  {pagesRead:20,
    pagePerHour:30,
  }
]} config={{
              pagesRead:{
                label:'Read Pages',
                color: '#2563eb',
              },
              pagePerMinutes:{
                label: 'Pages Per Minute',
                color: '#2563eb',
              },
              pagePerHour:{
                label: 'Pages Per Hour',
                color: '#2563eb',
              }
              }} dataKeyForXValue={'pagesRead'} dataKeyForBarValue={'pagePerHour'} />
          </div> 
          
        </div>

        <div id="reading-stats"  className="flex max-w-6xl w-full flex-col gap-3">
          <p className='text-white text-3xl font-semibold'>Your Book Reading Statistics</p>
         <div className="flex gap-3 max-w-6xl overflow-x-auto items-center">
             <div className="max-w-xs h-64 p-2 w-full bg-dark-gray rounded-lg">
       <ShadcnBarChart data={document.data.ReadingProgress.map((item) => {
    const startTime = new Date(item.startTime);
    const finishTime = new Date(item.finishTime);
    const timeInMinutes = (finishTime.getTime() - startTime.getTime()) / 60000; // 60000 ms in a minute
    const timeInHours = timeInMinutes / 60; // Convert minutes to hours

         return {
           pagesRead: item.pagesRead,
           feelAfterReading: item.feelAfterReading,
           startTime: format(startTime, "dd.MM.yyyy"),
           timeSpent: `${format(startTime, "dd.MM.yyyy")}, ${intervalToDuration({'start':startTime, end:finishTime}).hours}:${intervalToDuration({'start':startTime, end:finishTime}).minutes}:${intervalToDuration({'start':startTime, end:finishTime}).seconds}`,
      pagePerMinutes: (item.pagesRead / timeInMinutes).toFixed(2), // Pages per minute
           pagePerHour: (item.pagesRead / timeInHours).toFixed(2), // Pages per hour
      
    };
  }) ?? [
  {pagesRead:20,
    pagePerHour:30,
  }
              ]} config={{
              pagesRead:{
                label:'Read Pages',
                color: '#2563eb',
                },
                timeSpent: {
                  label: 'Time Spent',
                  color: '#2563eb',
                },
                startTime: {
                  label: 'Start Time',
                  color: '#2563eb',
                },
              pagePerMinutes:{
                label: 'Pages Per Minute',
                color: '#2563eb',
              },
              pagePerHour:{
                label: 'Pages Per Hour',
                color: '#2563eb',
              }
              }} dataKeyForXValue={'pagePerHour'} dataKeyForBarValue={'startTime'} dataKeyFor2XBar={'pagesRead'} />
            </div>
         
            <div className="max-w-xs h-64 p-2 w-full bg-dark-gray rounded-lg">
            <ShadcnPieChart data={pieChartHappinessDayTimeRelationshipData} config={getHappinessRelationshipConfig(document && document.data, pieChartHappinessDayTimeRelationshipData)} dataKeyForXValue={'labelForX'} dataKeyForYValue={'occurances'}  />
            </div>
         
          <div className="max-w-xs h-64 p-2 w-full bg-dark-gray rounded-lg">
         
              <ShadcnLineChart dataKeyForXLabel={'readingDate'} dataKeyForYValue={'pagesRead'}  data={getDailyLineProgressData(document && document.data, document.data.ReadingProgress)} config={{
                pagesRead:{
                label:'Read Pages',
                color: '#2563eb',
                },
              readingDate:{
                label: 'Reading Date',
                color: '#2563eb',
              }
} satisfies ChartConfig} />
          </div>

         </div>
        
     
          
         </div>
      </div>


    </>}</div>
  )
}

export default Page