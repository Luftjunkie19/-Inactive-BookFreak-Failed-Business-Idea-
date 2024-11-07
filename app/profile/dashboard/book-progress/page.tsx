"use client";
import { Progress, TimeInput, TimeInputValue } from '@nextui-org/react'
import Button from 'components/buttons/Button'
import { PagesPerDayChart } from 'components/charts/competition/CompetitionCharts'
import Book from 'components/elements/Book'
import { useQuery } from '@tanstack/react-query';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { FaPlusCircle, FaSadCry, FaSmileBeam } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa6'
import { SwiperSlide } from 'swiper/react';
import { useAuthContext } from 'hooks/useAuthContext';
import LabeledInput from 'components/input/LabeledInput';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format, intervalToDuration } from 'date-fns';
import toast from 'react-hot-toast';
import { Time } from '@internationalized/date';
import { PiSmileyMehFill } from 'react-icons/pi';
import { BsEmojiSunglassesFill } from 'react-icons/bs';
import PieChartComponent from 'components/charts/PieChart';
import { ShadcnBarChart, ShadcnPieChart } from 'components/charts/ShadcnChart';


function Page() {
  const { user } = useAuthContext();
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [pastStartedDate, setPastStartedDate] = useState<Date>();
    const [pastFinishedDate, setPastFinishedDate] = useState<Date>();
  const [timeStarted, setTimeStarted] = useState<TimeInputValue>();
  const [timeFinished, setTimeFinished] = useState<TimeInputValue>();
  const [readPages, setReadPages] = useState<number>(0);
  const [progressBarValue, setProgressBarValue] = useState<number>(0);
  const [feeling, setFeeling] = useState<'terrified' | 'neutral' | 'satisfied' | 'delighted' >();
  const [type, setType] = useState < 'paperbook' | 'ebook' | 'audiobook'>();
  const {data}=useQuery({queryKey:['userProgressDashboard'], queryFn:()=>fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id:user!.id, include:{
        'recensions': { 'include': { 'book': true } },
        ReadingProgress:{
          'include':{
            'book':true,
            'user':true
          },
        },
        'notifications':true,
       }}),
  }).then((res) => res.json()),
  })
  
  const params = useSearchParams();
  const bookId = params.get('bookId')?.split('?')[0];
  const readToday = params.get('bookId')?.split('?')[1].split('=')[1] === 'true' ? true : false;

  const { data: readBookData } = useQuery({
    queryKey: ['dashboardBook'], queryFn: () => fetch('/api/supabase/book/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: {
          id: bookId,
        },
        include: {
          recensions: true,
        },
      }),
    }).then((res) => res.json()),
  });

  useEffect(() => {
      const interval = setInterval(() => {
        if (data.data && progressBarValue !== ((data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item)=>item.pagesRead).reduce((prev, cur)=>prev + cur, 0) / readBookData.data.pages) * 100) ) {
          setProgressBarValue(((data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item)=>item.pagesRead).reduce((prev, cur)=>prev + cur, 0) / readBookData.data.pages) * 100));
        } else {
          clearInterval(interval);
        }
      },300)

      return () => clearInterval(interval);
    


  },[bookId, data, progressBarValue, readBookData])


  const addProgress= async ()=>{
    try {
    const now= new Date();
      const bookInReadId = crypto.randomUUID();

      const response = await fetch('/api/supabase/readingProgress/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            id: bookInReadId,
            userId: user!.id,
            bookId,
            typeOfBookVersion: type,
            pagesRead: readPages,
            feelAfterReading: feeling,
            startTime: timeStarted ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeStarted.hour, timeStarted.minute, timeStarted.second, timeStarted.millisecond) : pastStartedDate,
            finishTime: timeFinished ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeFinished.hour, timeFinished.minute, timeFinished.second, timeFinished.millisecond) : pastFinishedDate,
          }
        }),
      });

      const fetched = await response.json();

    setShowUpdate(false);

    } catch (err) {
      console.log(err);
}

    
  }


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

  const pieChartData = data && returnPieChartObj(data.data.ReadingProgress.filter((item) => item.bookId === bookId));

  return (
    <div className='w-full  flex flex-col px-2 gap-2'>
      <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1 text-white">   
        <p className='text-3xl font-semibold'>Currently Reading Book</p>
        <p>If some thing has changed in your reading progress, you can update it now from dashboard perspective</p>
        </div>
        <div className="flex sm:flex-col xl:flex-row xl:items-center gap-6">

            {data && bookId && readBookData &&
            <div className='flex flex-col gap-6 max-w-4xl w-full'>
               <div className="flex items-center gap-2 ">
                  <Button onClick={()=>setShowUpdate(false)} type={!showUpdate ? 'blue' : 'white'}>Statistics</Button>
                  <Button onClick={()=>setShowUpdate(true)} type={showUpdate ? 'blue' : 'white'}>Update</Button>
                </div> 
        <div className="flex sm:flex-col lg:flex-row  max-w-4xl w-full gap-12">
              
          
                
              {readBookData && data &&
          <Book recensions={0} additionalClasses='max-w-56 h-fit w-full xl:self-center' bookCover={readBookData.data.bookCover} pages={data.data.ReadingProgress.filter((item)=>item.bookId === bookId).reduce((prev, cur)=>prev.readPages + cur.readPages, 0)} author={readBookData.data.bookAuthor} bookId={readBookData.data.id} title={readBookData.data.title} bookCategory={readBookData.data.genre} type={'dark'} />
              }

          
              
              {showUpdate && readBookData && data &&  <div className='flex flex-col gap-2 text-white'>
                <p className='text-xl'>Update Reading State !</p>
                <p className='text-sm'>Any Pages Read Today ? Go on and update your reading progress and enjoy your progress !</p>
              
                <LabeledInput onChange={(e)=>setReadPages(parseInt(e.target.value))} inputType='number' minNumber={1} maxNumber={readBookData.data.pages - data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item)=>item.pagesRead).reduce((prev, cur)=>prev + cur, 0)} additionalClasses='p-2 max-w-xs w-full' type='dark' label='Read Pages' />
                
                <div className="flex flex-col gap-2">
                  <p className='text-base'>Book Type</p>
                <div className="flex items-center gap-2">
                  {readBookData.data.accessibleTypes.map((item)=>(<Button key={item} onClick={() => setType(item)} additionalClasses='px-3' type={type === item ? 'blue' : 'white'}>
                    {item.toUpperCase()[0] + item.slice(1)}
                  </Button>))}
                </div>
                  </div>
                  
                  {!readToday ? <>
                    <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-1">
                      <div className="flex flex-col gap-1 max-w-sm w-full">
                        <p>Started time</p>
                  <Popover>
      <PopoverTrigger asChild className='max-w-xs w-full'>
        <div className="flex gap-2 cursor-pointer items-center text-white bg-dark-gray py-2 px-4 h-fit max-w-xs w-full rounded-lg border-2 border-primary-color"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {pastStartedDate ? format(pastStartedDate, "PPP") : <span>Pick a date</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
                <Calendar classNames={{
                  'day_selected': 'bg-primary-color text-white',
            
                  }}
                  
          mode="single"
          selected={pastStartedDate}
                        onSelect={(day, selectedDate) => {
                          console.log(readToday);

                    if (selectedDate.getTime() > new Date().getTime()) {
                      toast.error(`You cannot select dates greater than today's date.`);
                      return;
                      }
                      setPastStartedDate(selectedDate);

          }}
                
                  
        />
      </PopoverContent>
                      </Popover>
                      </div>
                        <TimeInput onChange={(val) => setPastStartedDate((prev) => {
                          if (prev) {
                            prev.setHours(val.hour);
                            prev.setMinutes(val.minute);
                            return prev;
                         }
                      })} className='text-white' hourCycle={24} labelPlacement='outside' classNames={{'base':'max-w-48 w-full text-white flex flex-col gap-[0.125rem]', 'input':'text-white text-base', innerWrapper:'text-white', 'inputWrapper':'rounded-md bg-dark-gray border-primary-color border text-white', 'label':'text-white' }} label={<p className='text-white font-poppins text-base'>Starting Hour</p>} />
                      </div>
                  
                         <div className="flex items-start gap-1">
                      <div className="flex flex-col gap-1 max-w-sm w-full">
                        <p>Finish time</p>
                  <Popover>
      <PopoverTrigger asChild className='max-w-xs w-full'>
        <div className="flex gap-2 cursor-pointer items-center text-white bg-dark-gray py-2 px-4 h-fit max-w-xs w-full rounded-lg border-2 border-primary-color"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {pastFinishedDate ? format(pastFinishedDate, "PPP") : <span>Pick a date</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
                <Calendar classNames={{
                  'day_selected': 'bg-primary-color text-white',
            
                  }}
                  
          mode="single"
          selected={pastFinishedDate}
                        onSelect={(day, selectedDate) => {
                          console.log(readToday);

                    if (selectedDate.getTime() > new Date().getTime() && pastStartedDate && pastStartedDate.getTime() > selectedDate.getTime()) {
                      toast.error(`You cannot select dates earlier than today's date.`);
                      return;
                      }
                      setPastFinishedDate(selectedDate);

          }}
                
                  
        />
      </PopoverContent>
                      </Popover>
                      </div>
                      <TimeInput onChange={(val) => setPastFinishedDate((prev) => {
                          if (prev) {
                            prev.setHours(val.hour);
                            prev.setMinutes(val.minute);
                            if (pastStartedDate && prev.getTime() < pastStartedDate.getTime()) {
                              toast.error(`You cannot select a finish time earlier than the start time.`);
                              return;
                            }
                            return prev;
                         }
                      })} className='text-white' hourCycle={24} labelPlacement='outside' classNames={{'base':'max-w-48 w-full text-white flex flex-col gap-[0.125rem]', 'input':'text-white text-base', innerWrapper:'text-white', 'inputWrapper':'rounded-md bg-dark-gray border-primary-color border text-white', 'label':'text-white' }} label={<p className='text-white font-poppins text-base'>Finish Hour</p>} />
                    </div>
                      
                    </div>
                  
                  </> : <>
                         <div className="flex gap-1 flex-col">
                  <p>Time Data</p>
                  <div className="flex items-center gap-2">
                     <TimeInput onChange={(val)=>setTimeStarted(val)} className='text-white' hourCycle={24} labelPlacement='outside' classNames={{'base':'max-w-48 w-full text-white flex flex-col gap-[0.125rem]', 'input':'text-white text-base', innerWrapper:'text-white', 'inputWrapper':'rounded-md bg-dark-gray border-primary-color border text-white', 'label':'text-white' }} label={<p className='text-white font-poppins text-base'>Starting Date</p>} />
                   <TimeInput  onChange={(val)=>{
                    if( timeStarted && val.hour < timeStarted.hour){
                      toast.error('You cannot select dates earlier than the starting date.');
                      return;
                    }
                    setTimeFinished(val);
                   }}  className='text-white' hourCycle={24} labelPlacement='outside' classNames={{'base':'max-w-48 w-full text-white flex flex-col gap-[0.125rem]', 'input':'text-white text-base', innerWrapper:'text-white', 'inputWrapper':'rounded-md bg-dark-gray border-primary-color border text-white', 'label':'text-white'}} label={<p className='text-white font-poppins text-base'>Ending Date</p>}  /> 
                  </div>
            
                </div>
                  </>}

             
                
                <div className="w-full sm:flex-col xl:flex-row xl:justify-between xl:items-center flex ">
                  <div className="flex flex-col gap-1">
                      <p className='text-sm'>What was your reading experience ?</p>
                      <div className="flex gap-2 items-center">
                    <Button onClick={()=>setFeeling('terrified')} type='transparent'>
                      <FaSadCry className={`text-4xl ${feeling === 'terrified' ? 'text-primary-color' : ''} transition-all hover:scale-95 hover:text-primary-color`} />
                    </Button>

                     <Button onClick={()=>setFeeling('neutral')} type='transparent'>
                      <PiSmileyMehFill   className={`text-4xl ${feeling === 'neutral' ? 'text-primary-color' : ''} transition-all hover:scale-95 hover:text-primary-color`} />
                    </Button>

                      <Button onClick={()=>setFeeling('satisfied')} type='transparent'>
                      <FaSmileBeam  className={`text-4xl ${feeling === 'satisfied' ? 'text-primary-color' : ''} transition-all hover:scale-95 hover:text-primary-color`} />
                    </Button>

                    <Button onClick={()=>setFeeling('delighted')} type='transparent'>
                      <BsEmojiSunglassesFill className={`text-4xl ${feeling === 'delighted' ? 'text-primary-color' : ''} transition-all hover:scale-95 hover:text-primary-color`} />
                    </Button>

                    </div>
                  
                  </div>
                  <Button onClick={addProgress} additionalClasses='max-w-28 w-full' type='blue'>Update</Button>
                </div>

              </div>}
              
              {!showUpdate && readBookData && data &&  <div className="flex xl:self-end max-w-xl w-full flex-col gap-2">
                <p className='text-2xl font-semibold text-white'>Book Title</p>

              <p className='text-white'>{ data.data.ReadingProgress.filter((item) => item.bookId === bookId).length > 0 ? data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item)=>item.pagesRead).reduce((prev, cur)=>prev + cur, 0) : 0}/{readBookData.data.pages} Read Pages</p>

         
       
                {readBookData && data && data.data &&
            <Progress
              aria-label='loading...'
              className="max-w-60 w-full"
      size='lg'
      value={progressBarValue}
              classNames={{
                'indicator':'bg-primary-color'
              }}

            />
                }
            <p className='text-white'>{data && data.data && readBookData && ((data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item)=>item.pagesRead).reduce((prev, cur)=>prev + cur, 0) / readBookData.data.pages) * 100).toFixed(2)}% Done</p>
            <Button onClick={()=>setShowUpdate(true)} type={'blue'} additionalClasses='flex hover:bg-dark-gray hover:text-primary-color hover:scale-95 transition-all duration-400 w-fit px-3 gap-3 items-center justify-around'><span>Read Now</span> <FaBookOpen /> </Button>
</div>}
    
</div>
            </div>
            }
            
{!showUpdate && data &&
          <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
            
             
            <ShadcnBarChart dataKeyForBarValue={'startTime'} dataKeyForXValue={'pagesRead'}  config={{
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
              }} data={data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item) => {
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
  }) ?? []} />

          </div>
}
          
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
<div className="">
          <p className='text-white text-2xl'>Reading Statistics</p>
          <p className='text-gray-400 text-sm'>You can see a specific data about your progress here.</p>
        </div>

       <BaseSwiper slidesOn2XlScreen={3} slidesOnLargeScreen2={2} slidesOnXlScreen={2} slidesOnSmallScreen={1}  additionalClasses='w-full'>
       {data && <>
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
              }} data={data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item) => {
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
  }) ?? []} />
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
                color: '#2563eb',
              }
                }} data={data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item) => {
                
                  
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
  }) ?? []} />
            </div>
       </SwiperSlide>

       <SwiperSlide className='max-w-sm h-72 w-full'>
              <div className="max-w-sm h-72 p-2 w-full  bg-dark-gray rounded-lg">
               
                

                <ShadcnPieChart data={pieChartData} config={ {
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
      
      <div className="flex flex-col gap-2">
        <div className="">
          <p className='text-white text-2xl'>Reading Notes</p>
          <p className='text-gray-400 text-sm '>You read something interesting and you want to note it ? Do it here and avoid fear of loosing the notes !</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="max-w-64 w-full cursor-pointer flex flex-col justify-center items-center gap-4 h-96 p-2 rounded-lg bg-dark-gray border-primary-color border-2">
            
            <FaPlusCircle className='text-6xl text-primary-color'/>
            
            <div className="text-white flex flex-col gap-1 items-center justify-center">
            <p className='text-lg'>Add new Note</p>
            <p className='text-sm text-center text-gray-400'>Remember it forever and search never more in notebooks !</p>
            </div>
          </div>
        </div>

      </div>
       


    </div>
  )
}

export default Page