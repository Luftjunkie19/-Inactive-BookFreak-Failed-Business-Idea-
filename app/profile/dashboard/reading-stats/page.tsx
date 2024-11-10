'use client';
import { Calendar } from '@/components/ui/calendar';
import { PopoverContent, PopoverTrigger, Popover} from '@/components/ui/popover';
import { useQuery } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import { PagesPerDayChart } from 'components/charts/competition/CompetitionCharts'
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import {motion} from 'framer-motion';
import { SwiperSlide } from 'swiper/react';
import { DateRange } from 'react-day-picker';
import { addDays } from 'date-fns';

type Props = {}

function Page({}: Props) {
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>({
      from: new Date(2024, 0, 20),
      to: addDays(new Date(2024, 0, 20), 20),
   });

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
   <Button additionalClasses='hover:bg-dark-gray hover:text-primary-color hover:scale-95 transiion-all duration-500' onClick={()=>setIsModalOpen(!isModalOpen)} type='blue'>Period of Time</Button>
   <motion.div animate={{
    opacity: isModalOpen ? 1 : 0,
    scale: isModalOpen ? 1 : 0.25,
    x: isModalOpen ? -250 : -245,
    y: isModalOpen ? 45 : 0   ,
    zIndex: isModalOpen ? 10 : 0
   }} className="absolute top-0 left-0 max-w-80 rounded-xl max-h-60 min-h-60 min-w-80 w-full h-full bg-dark-gray border-2 border-primary-color flex flex-col gap-2 p-2">
      <p className="text-white">Period of Time</p>
    <div className="flex gap-2 items-center justify-between w-full">
      <p className="text-white">From</p>
      <Popover>
      <PopoverTrigger asChild className=''>
        <div className="flex gap-2 cursor-pointer items-center text-white bg-dark-gray py-2 px-4 h-fit w-fit rounded-lg border-2 border-primary-color"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
           <span>Date Range</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                selected={selectedDateRange}
                disabled={(date)=> date.getTime() >       new Date().getTime()}
                classNames={{
                  'day_selected': 'bg-primary-color text-white hover:bg-primary-color hover:text-white hover:scale-95 transition-all duration-300',
                  'day_range_start':'',
                  'day_range_middle':'',
                  'day_range_end':'',
                  'cell':'bg-none',
                  'table': 'bg-dark-gray text-white',
                  'nav_button':' text-primary-color border-primary-color hover:bg-primary-color hover:text-white hover:border-white hover:scale-95 active:scale-95 transition-all duration-300 border-2 p-1 rounded-lg',
                  'root': 'bg-dark-gray text-white border-none', 
                  }}
          mode='range'
                        onSelect={(day, selectedDate, activeModifiers) => {
                          console.log(selectedDate, day, activeModifiers);

                     
                    if (selectedDate.getTime() > new Date().getTime()) {
                      toast.error(`You cannot select dates greater than today's date.`);
                      return;
                      }
                  
                        setSelectedDateRange(day);
                      

          }}
                
                  
        />
      </PopoverContent>
   </Popover>
    </div>
   </motion.div>
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