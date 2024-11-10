import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import Button from 'components/buttons/Button';
import { ShadcnPieChart, ShadcnRadialChart } from 'components/charts/ShadcnChart';
import React, { useState } from 'react'
import { BsCalendar2WeekFill } from 'react-icons/bs';
import { SwiperSlide } from 'swiper/react';
import {motion} from 'framer-motion';
import { DateRange } from 'react-day-picker';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import toast from 'react-hot-toast';
import useContvertData from 'hooks/useContvertData';
type Props = {document:any, }

function PieRadialChartsSection({document}: Props) {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {displayHapinessDayTimeRelationData, getMostReadGenresConfig, getMostReadGenres,getUniqueBooks, getHappinessRelationshipConfig}=useContvertData();
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange| undefined>();
const displayFilteredOrNot = (array: any[] = []) => {
  if (selectedDateRange && selectedDateRange.from && selectedDateRange.to) {
    return array.filter((item) => 
      new Date(item.startTime).getTime() >= new Date(selectedDateRange?.from).getTime() &&
      new Date(item.startTime).getTime() <= new Date(selectedDateRange?.to).getTime()
    );
  }
  return array;
};

  return (
    <div className="flex flex-col w-full gap-3 px-1 py-2">
    <div className="flex flex-col  gap-3">
   <p className='text-white text-2xl'>Your Preferences based on Your Reading Data </p>


   <div className="relative top-0 left-0 ">
<Button additionalClasses='hover:bg-dark-gray group flex items-center gap-2 hover:text-primary-color hover:scale-95 transiion-all duration-500' onClick={()=>setIsModalOpen(!isModalOpen)} type='blue'>Period of Time
<BsCalendar2WeekFill className='text-white text-xl group-hover:text-primary-color transition-all duration-500' />
</Button>
<motion.div  animate={{
opacity: isModalOpen ? 1 : 0,
scale: isModalOpen ? 1 : 0.25,
x: isModalOpen ? 0 : 0,
y: isModalOpen ? 45 : 0,
'transition':{
 'type': 'spring',
 duration:0.4,
},
zIndex: 10
}} className="absolute top-0 left-0  max-w-80 rounded-xl max-h-60 min-h-60 min-w-80 w-full h-full bg-dark-gray border-2 border-primary-color flex flex-col  gap-2 p-2">
 <p className="text-white text-xl">Filters</p>
 <div className="h-full w-full flex flex-col justify-between">    
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
          initialFocus={false}
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

                   onSelect={(dayRange, selectedDate, activeModifiers) => {
                     setSelectedDateRange(dayRange);
                     
     }}
           
             
   />
 </PopoverContent>
</Popover>
</div>
<Button onClick={()=>{
setIsModalOpen(!isModalOpen);
}
} additionalClasses='w-fit spcace-x-2' type='blue'>Apply</Button>  
 </div>
</motion.div>
</div>

    </div>
 
   <BaseSwiper additionalClasses='w-full max-w-full' slidesOn2XlScreen={4} slidesOnLargeScreen2={2} slidesOnLargeScreen={2} slidesOnXlScreen={2.25} slidesOnSmallScreen={1}>
<SwiperSlide className='max-w-sm h-72 w-full'>
          <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
            {displayHapinessDayTimeRelationData(document && document.data, displayFilteredOrNot(document.data.ReadingProgress)).length > 0 &&
<ShadcnPieChart data={displayHapinessDayTimeRelationData(document && document.data, displayFilteredOrNot(document.data.ReadingProgress))} config={getHappinessRelationshipConfig(document && document.data, displayHapinessDayTimeRelationData(document && document.data, displayFilteredOrNot(document.data.ReadingProgress)))} dataKeyForXValue={'labelForX'} dataKeyForYValue={'pagesRead'} />
            }
     </div>
</SwiperSlide>
<SwiperSlide className='max-w-sm h-72 w-full'>
          <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
            {getMostReadGenres(document && document.data, getUniqueBooks(displayFilteredOrNot(document.data.ReadingProgress))).length > 0 &&
  <ShadcnPieChart data={getMostReadGenres(document && document.data, getUniqueBooks(displayFilteredOrNot(document.data.ReadingProgress)))} config={getMostReadGenresConfig(document && document.data, getMostReadGenres(document && document.data, getUniqueBooks(displayFilteredOrNot(document.data.ReadingProgress))))} dataKeyForXValue={'label'} dataKeyForYValue={'pagesRead'}  />
            }
     </div>
</SwiperSlide>

<SwiperSlide className='max-w-sm h-72 w-full'>
          <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
            {displayHapinessDayTimeRelationData(document && document.data, displayFilteredOrNot(document.data.ReadingProgress)).length > 0 && 
    <ShadcnRadialChart  data={displayHapinessDayTimeRelationData(document && document.data, displayFilteredOrNot(document.data.ReadingProgress))} config={getHappinessRelationshipConfig(document && document.data, displayHapinessDayTimeRelationData(document && document.data, displayFilteredOrNot(document.data.ReadingProgress)))} dataKeyForXValue={'labelForX'} dataKeyForYValue={'pagesRead'} activeProperty={'feelAfterReading'}  />
            }
     </div>
</SwiperSlide>
</BaseSwiper>
    
 </div>
  )
}

export default PieRadialChartsSection