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
import BarChartDashboardSection from 'components/dashboard/BarChartDashboardSection';

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

        <BarChartDashboardSection document={document}/>
</>
}



    </div>
  )
}

export default Page