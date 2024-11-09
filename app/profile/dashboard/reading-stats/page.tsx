'use client';
import { Calendar } from '@/components/ui/calendar';
import { PopoverContent, PopoverTrigger, Popover} from '@/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import { PagesPerDayChart } from 'components/charts/competition/CompetitionCharts'
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import { CalendarIcon } from 'lucide-react';
import React from 'react'
import toast from 'react-hot-toast';
import { SwiperSlide } from 'swiper/react';

type Props = {}

function Page({}: Props) {


   const { data: document } = useQuery({
      queryKey: ['profile']
   });

  return (
    <div className='w-full h-full'>



        <div className="flex flex-col w-full gap-3 px-1 py-2">
         <div className="flex justify-between items-center gap-3">
        <p className='text-white text-2xl'>Elaborate Data from Your Reading Data (All time)</p>

<div className="flex gap-2 items-center">
   <div className="relative top-0 left-0 ">
   <Button type='blue'>Period of Time</Button>
   <div className="absolute top-[45] -left-[160%] max-w-80 rounded-xl max-h-60 min-h-60 min-w-80 w-full h-full z-50 bg-dark-gray border-2 border-primary-color flex flex-col gap-2 p-2">
      <p className="text-white">Period of Time</p>
    <div className="flex gap-2 items-center justify-between w-full">
      <p className="text-white">From</p>
      <Popover>
      <PopoverTrigger asChild className=''>
        <div className="flex gap-2 cursor-pointer items-center text-white bg-dark-gray py-2 px-4 h-fit w-fit rounded-lg border-2 border-primary-color"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
           <span>Pick a date</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
                <Calendar classNames={{
                  'day_selected': 'bg-primary-color text-white',
            
                  }}
          mode='range'
                        onSelect={(day, selectedDate) => {
                          console.log(selectedDate);

                    if (selectedDate.getTime() > new Date().getTime()) {
                      toast.error(`You cannot select dates greater than today's date.`);
                      return;
                      }
                      console.log(selectedDate);

          }}
                
                  
        />
      </PopoverContent>
   </Popover>
    </div>
   </div>
   </div>
</div>

         </div>
        <BaseSwiper additionalClasses='w-full max-w-full' slidesOn2XlScreen={4} slidesOnLargeScreen2={2} slidesOnLargeScreen={2} slidesOnXlScreen={2.25} slidesOnSmallScreen={1}>
<SwiperSlide className='max-w-sm h-72 w-full'>
   <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       {/* <PagesPerDayChart className='w-full h-full'/> */}
          </div>
</SwiperSlide>
<SwiperSlide className='max-w-sm h-72 w-full'>
             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       {/* <PagesPerDayChart className='w-full h-full'/> */}
          </div>
</SwiperSlide>

<SwiperSlide className='max-w-sm h-72 w-full'>
             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       {/* <PagesPerDayChart className='w-full h-full'/> */}
          </div>
</SwiperSlide>
</BaseSwiper>
      </div>

       <div className="flex flex-col gap-3 px-1 py-2 w-full">
        <p className='text-white text-2xl'>Your Preferences based on Your Reading Data (All time)</p>
        <BaseSwiper additionalClasses='w-full' slidesOn2XlScreen={4} slidesOnLargeScreen2={2} slidesOnLargeScreen={2} slidesOnXlScreen={2.25} slidesOnSmallScreen={1}>
<SwiperSlide className='max-w-sm h-72 w-full'>
   <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       {/* <PagesPerDayChart className='w-full h-full'/> */}
          </div>
</SwiperSlide>
<SwiperSlide className='max-w-sm h-72 w-full'>
             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       {/* <PagesPerDayChart className='w-full h-full'/> */}
          </div>
</SwiperSlide>

<SwiperSlide className='max-w-sm h-72 w-full'>
             <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
       {/* <PagesPerDayChart className='w-full h-full'/> */}
          </div>
</SwiperSlide>
</BaseSwiper>
      </div>


    </div>
  )
}

export default Page