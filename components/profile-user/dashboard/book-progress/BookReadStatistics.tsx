import { ShadcnBarChart, ShadcnPieChart } from 'components/charts/ShadcnChart';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import { format } from 'date-fns';
import React from 'react'
import { SwiperSlide } from 'swiper/react';

type Props = { data:{data:any | null, error: any | null}, bookId:string | undefined}

function  BookReadStatistics({ data, bookId}: Props) {
    
const returnPieChartObj = (array) => {
    let feelingsObjs: { feelAfterReading: string, fill: string, feelFrequency: number }[] = [];

    array.map((item) => {
      if (!feelingsObjs.find((feelingObj)=>feelingObj.feelAfterReading === item.feelAfterReading)) { 
                    feelingsObjs.push({
                      feelAfterReading: item.feelAfterReading,
                      fill: 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)',
                      feelFrequency: 1,
                      
                    });
                  } else {
                    feelingsObjs.find((item) => item.feelAfterReading === item.feelAfterReading)!.feelFrequency++;
                  }
    })

    return feelingsObjs;
                  
  }
    const pieChartData = data && data.data && data.data.ReadingProgress && returnPieChartObj(data.data.ReadingProgress.filter((item) => item.bookId === bookId));

  
  const recentBookProgress = ():{pagesRead:number, feelAfterReading:string, startTime:Date, pagePerMinutes:number, pagePerHour:number}[]=>{
    const recentBookReadId = data && data.data && data.data.ReadingProgress && data.data.ReadingProgress.sort((a, b) => new Date(b.finishTime).getTime() - new Date(a.finishTime).getTime())[0].bookId;
    if(recentBookReadId){
      return data.data.ReadingProgress.filter((item) => item.bookId === recentBookReadId).sort((a, b) => new Date(b.finishTime).getTime() - new Date(a.finishTime).getTime()).map((item)=>{
        const startTime = new Date(item.startTime);
        const finishTime = new Date(item.finishTime);
        const timeInMinutes = (finishTime.getTime() - startTime.getTime()) / 60000; // 60000 ms in a minute
        const timeInHours = timeInMinutes / 60; // Convert minutes to hours
    
        return {
          pagesRead: item.pagesRead,
          feelAfterReading:item.feelAfterReading,
          startTime: format(startTime, "MM/dd/yyyy"),
          pagePerMinutes: (item.pagesRead / timeInMinutes).toFixed(2), // Pages per minute
          pagePerHour: (item.pagesRead / timeInHours).toFixed(2), // Pages per hour
        };
      });
    }else{
      return [];
    }
  }

  const getRecentPieChartData= ()=>{
    const recentBookReadId = data && data.data && data.data.ReadingProgress && data.data.ReadingProgress.sort((a, b) => new Date(b.finishTime).getTime() - new Date(a.finishTime).getTime())[0].bookId;
    if (recentBookReadId) { 
      return returnPieChartObj(data.data.ReadingProgress.filter((item) => item.bookId === recentBookReadId).sort((a, b) => new Date(b.finishTime).getTime() - new Date(a.finishTime).getTime()));
    }else{
      return [];
    }
  }


  const recentPieChartData = data && data.data && data.data.ReadingProgress && getRecentPieChartData();
  
  const recentBooksReadProgress = data && data.data && data.data.ReadingProgress && recentBookProgress();

    
  
  return (
    <div className="flex flex-col gap-2">


      
  <div className="">
            <p className='text-white text-2xl'>Reading Statistics</p>
            <p className='text-gray-400 text-sm'>You can see a specific data about your progress here.</p>
          </div>
  
         <BaseSwiper slidesOn2XlScreen={3} slidesOnLargeScreen2={2} slidesOnXlScreen={2} slidesOnSmallScreen={1}  additionalClasses='w-full'>
         {data && data.data && data.data.ReadingProgress && <>
         <SwiperSlide className='max-w-sm h-72 w-full'>
     <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
     <ShadcnBarChart dataKeyForBarValue={'startTime'} dataKeyForXValue={'pagePerHour'}  config={{
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
                }} data={data.data.ReadingProgress.filter((item) => item.bookId === bookId).length > 0 ?  data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item) => {
      const startTime = new Date(item.startTime);
      const finishTime = new Date(item.finishTime);
      const timeInMinutes = (finishTime.getTime() - startTime.getTime()) / 60000; // 60000 ms in a minute
      const timeInHours = timeInMinutes / 60; // Convert minutes to hours
  
      return {
        pagesRead: item.pagesRead,
        feelAfterReading:item.feelAfterReading,
        startTime: format(startTime, "MM/dd/yyyy"),
        pagePerMinutes: (item.pagesRead / timeInMinutes).toFixed(2), // Pages per minute
        pagePerHour: (item.pagesRead / timeInHours).toFixed(2), // Pages per hour
      };
    }) : recentBooksReadProgress} />
              </div>
         </SwiperSlide>
  
         <SwiperSlide className='max-w-sm h-72 w-full'>
              <div className="max-w-sm h-72 p-2 w-full  bg-dark-gray rounded-lg">
                <ShadcnBarChart dataKeyForBarValue={'startTime'} dataKeyForXValue={'pagePerMinutes'}  config={{
                pagePerMinutes:{
                  label: 'Pages Per Minute',
                  color: '#2563eb',
                },
                pagePerHour:{
                  label: 'Pages Per Hour',
                  color: 'red',
                }
                  }} data={data.data.ReadingProgress.filter((item) => item.bookId === bookId).length > 0 ?  data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item) => {
                  
                    
      const startTime = new Date(item.startTime);
      const finishTime = new Date(item.finishTime);
      const timeInMinutes = (finishTime.getTime() - startTime.getTime()) / 60000; // 60000 ms in a minute
      const timeInHours = timeInMinutes / 60; // Convert minutes to hours
  
      return {
        pagesRead: item.pagesRead,
        feelAfterReading:item.feelAfterReading,
        startTime: format(startTime, "MM/dd/yyyy"),
        pagePerMinutes: (item.pagesRead / timeInMinutes).toFixed(2), // Pages per minute
        pagePerHour: (item.pagesRead / timeInHours).toFixed(2), // Pages per hour
      };
    }) : recentBooksReadProgress} />
              </div>
         </SwiperSlide>
  
         <SwiperSlide className='max-w-sm h-72 w-full'>
                <div className="max-w-sm h-72 p-2 w-full  bg-dark-gray rounded-lg">
                 
                 
  
                  <ShadcnPieChart data={pieChartData ? recentPieChartData : recentPieChartData} config={{
      terrified: {
        label: "Terrified",
        color: "hsl(var(--chart-1))",
      },
      neutral: {
        label: "Neutral",
        color: 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)',
      },
      satisfied: {
        label: "Satisfied",
        color: 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)',
      },
      delighted: {
        label: "Delighted",
        color: 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)',
      },
      
    }} dataKeyForXValue={'feelAfterReading'} dataKeyForYValue={'feelFrequency'}  />
            </div>
         </SwiperSlide>
  
       
  
         
            </>}
         
         </BaseSwiper>
        </div>
  )
}

export default BookReadStatistics