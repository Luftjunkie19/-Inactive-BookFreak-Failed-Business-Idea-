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
import { addDays, format } from 'date-fns';
import { useAuthContext } from 'hooks/useAuthContext';
import useContvertData from 'hooks/useContvertData';
import { ShadcnBarChart, ShadcnLineChart, ShadcnPieChart, ShadcnRadialChart } from 'components/charts/ShadcnChart';
import { ChartConfig } from '@/components/ui/chart';
import { BsCalendar2WeekFill } from 'react-icons/bs';
import PieRadialChartsSection from 'components/dashboard/PieRadialChartsSection';
import LineChartDashboardSection from 'components/dashboard/LineChartDashboardSection';

type Props = {}

function Page({}: Props) {
   const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>();
   const {displayHapinessDayTimeRelationData, getMostReadGenresConfig, getMostReadGenres,getUniqueBooks, getDailyLineProgressData, getHappinessRelationshipConfig, getBarPagesPerHourIndicatorData}=useContvertData();
const {user}=useAuthContext();
   const { data: document } = useQuery({
      queryKey: ['profile'],
      queryFn: () => fetch('/api/supabase/user/get', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ id:user!.id, include:{
           'recensions':{'include':{'book':true}},
           'ReadingProgress':{orderBy:{'startTime':'asc'}, include:{
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
    <div className='w-full h-full'>

{document && document.data && 
<>
       <PieRadialChartsSection document={document} />

       <LineChartDashboardSection document={document} />  

      <div className="flex flex-col gap-3 px-1 py-2 w-full">

        <p className='text-white text-2xl'>Speed of Reading & Productivity</p>
        
   <div className="relative top-0 left-0 ">
   <Button additionalClasses='hover:bg-dark-gray group flex items-center gap-2 hover:text-primary-color hover:scale-95 transiion-all duration-500' onClick={()=>setIsModalOpen(!isModalOpen)} type='blue'>Period of Time
    <BsCalendar2WeekFill className='text-white text-xl group-hover:text-primary-color transition-all duration-500' />
   </Button>
   <motion.div  animate={{
    opacity: isModalOpen ? 1 : 0,
    scale: isModalOpen ? 1 : 0.25,
    'amplitude':'wobble',  
    x: isModalOpen ? 0 : 0,
    y: isModalOpen ? 45 : 0,
    'transition':{
      'type': 'spring',
      duration:0.4,
    },
    zIndex: 10
   }} className="absolute top-0 left-0 max-w-80 rounded-xl max-h-60 min-h-60 min-w-80 w-full h-full bg-dark-gray border-2 border-primary-color flex flex-col gap-2 p-2">
      <p className="text-white text-xl">Filters</p>
    <div className="flex gap-2 flex-col w-full">
      <p className='text-white'>Select a period of time</p>
      <Popover>
      <PopoverTrigger asChild className=''>
        <div className="flex gap-2 cursor-pointer items-center text-nowrap text-white bg-dark-gray py-2 px-4 h-fit w-fit rounded-lg border-2 border-primary-color"
        >
          <CalendarIcon />
            {selectedDateRange?.from ? (
              selectedDateRange.to ? (
                <>
                  {format(selectedDateRange.from, "dd.MM.yyyy")} -{" "}
                  {format(selectedDateRange.to, "dd.MM.yyyy")}
                </>
              ) : (
                format(selectedDateRange.from, "dd.MM.yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                selected={selectedDateRange}
                disabled={(date)=> date.getTime() > new Date().getTime()}
                classNames={{
                  'day_selected': 'bg-primary-color text-white hover:bg-primary-color hover:text-white hover:scale-95 transition-all duration-300',
                  'day_range_middle':'',
                  'day_range_end':'bg-none',
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

        <BaseSwiper additionalClasses='w-full' slidesOn2XlScreen={4} slidesOnLargeScreen2={2} slidesOnLargeScreen={2} slidesOnXlScreen={2.25} slidesOnSmallScreen={1}>
<SwiperSlide className='max-w-sm h-72 w-full'>
   <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
<ShadcnBarChart data={getBarPagesPerHourIndicatorData(document && document.data, document.data.ReadingProgress)} config={{
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
                color: 'gray',
              },
              title:{
               label: 'title',
               color: 'red',
              }
              }} dataKeyForXValue={'pagesRead'} dataKeyFor2XBar={'pagePerHour'} dataKeyForBarValue={'title'} />
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
</>
}



    </div>
  )
}

export default Page