import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress, TimeInput, TimeInputValue } from '@nextui-org/react';
import { useQueryClient } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import { ShadcnBarChart } from 'components/charts/ShadcnChart';
import Book from 'components/elements/Book';
import LabeledInput from 'components/input/LabeledInput';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { BsEmojiSunglassesFill } from 'react-icons/bs';
import { FaBookOpen, FaSadCry, FaSmileBeam } from 'react-icons/fa';
import { PiSmileyMehFill } from 'react-icons/pi';

type Props = {bookId:string|undefined, data:{data:any | null, error:any| null}, userId:string, readBookData:any,readToday:boolean}

function BookProgressPanel({ data, bookId, userId, readBookData, readToday}: Props) {
      const [progressBarValue, setProgressBarValue] = useState<number>(0);
  const [showUpdate, setShowUpdate] = useState<boolean>(false);
  const [pastStartedDate, setPastStartedDate] = useState<Date>();
    const [pastFinishedDate, setPastFinishedDate] = useState<Date>();
  const [timeStarted, setTimeStarted] = useState<TimeInputValue>();
  const [timeFinished, setTimeFinished] = useState<TimeInputValue>();
  const [readPages, setReadPages] = useState<number>(0);
const queryClient=useQueryClient();
  const [feeling, setFeeling] = useState<'terrified' | 'neutral' | 'satisfied' | 'delighted' >();
  const [type, setType] = useState < 'paperbook' | 'ebook' | 'audiobook'>();

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
            userId: userId,
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


      await Promise.all([
        queryClient.invalidateQueries({ 'queryKey': ['dashboardBook', bookId], 'type': 'all' }),
        queryClient.invalidateQueries({ 'queryKey': ['userProgressDashboard'], 'type': 'all' })
      ]);

    setShowUpdate(false);

    } catch (err) {
      console.log(err);
}

    
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (data && data.data && progressBarValue !== ((data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item) => item.pagesRead).reduce((prev, cur) => prev + cur, 0) / readBookData.data.pages) * 100)) {
        setProgressBarValue(((data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item) => item.pagesRead).reduce((prev, cur) => prev + cur, 0) / readBookData.data.pages) * 100));
      } else {
        clearInterval(interval);
      }
    }, 300)

    return () => clearInterval(interval);
    


  }, [bookId, data, progressBarValue, readBookData]);
    

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

  const getRecentBookDetails= ()=>{
    const recentBookReadId = data && data.data && data.data.ReadingProgress && data.data.ReadingProgress.sort((a, b) => new Date(b.finishTime).getTime() - new Date(a.finishTime).getTime())[0].bookId;
    
    if (recentBookReadId) {
      return data.data.ReadingProgress.find((item) => item.bookId === recentBookReadId).book;
    }

    return null;
  }

  const recentBookDetails = getRecentBookDetails();
  
  const recentBooksReadProgress = recentBookProgress();


  return (
    <div className="flex flex-col gap-4">

              <div className="flex flex-col gap-1 text-white">   
        <p className='text-3xl font-semibold'>{readBookData.data ? 'Currently' : 'Recently'} Reading Book </p>
            <p>If some thing has changed in your reading progress, you can update it now from dashboard perspective</p>
            </div>
      <div className="flex sm:flex-col xl:flex-row xl:items-center gap-6">
        
        
       
    
                {data && data.data && data.data.ReadingProgress && bookId && (readBookData || recentBookDetails)  &&
                <div className={`flex flex-col gap-6 ${!showUpdate ? 'max-w-3xl' : ''} w-full`}>
                   <div className="flex items-center gap-2 ">
                      <Button onClick={()=>setShowUpdate(false)} type={!showUpdate ? 'blue' : 'white'}>Statistics</Button>
                      <Button onClick={()=>setShowUpdate(true)} type={showUpdate ? 'blue' : 'white'}>Update</Button>
                    </div> 
            <div className="flex sm:flex-col lg:flex-row   w-full gap-12">
                  
              
                    
                  { data && data.data.ReadingProgress && (readBookData || recentBookDetails) &&
              <Book recensions={0} additionalClasses='max-w-56 h-fit w-full xl:self-center' bookCover={readBookData ? readBookData.bookCover : recentBookDetails.bookCover} pages={readBookData  ? data.data.ReadingProgress.filter((item)=>item.bookId === bookId).reduce((prev, cur)=>prev.readPages + cur.readPages, 0) : recentBooksReadProgress.reduce((prev, cur)=>prev + cur.pagesRead, 0)} author={readBookData ? readBookData.data.bookAuthor : recentBookDetails.bookAuthor.bookAuthor} bookId={readBookData ?  readBookData.data.id : recentBookDetails.id} title={readBookData ? readBookData.data.title : recentBookDetails.title } bookCategory={readBookData ? readBookData.data.genre : recentBookDetails.genre} type={'dark'} />
                  } 
              
                  
                  {showUpdate && readBookData && data && data.data && data.data.ReadingProgress &&  <div className='flex flex-col gap-2 text-white'>

                <div className="flex gap-2 items-center w-full">
                  
                  <div className="flex flex-col gap-2 w-full">
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
                  </div>

                      {!readToday ? <>
                        <div className="flex flex-col gap-2 w-full">
                        <div className="flex items-center gap-4">
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
                      
                             <div className="flex items-center gap-4">
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
                             <div className="flex gap-1 flex-col w-full">
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
                </div>   
              
                      
   <div className="w-full max-w-lg sm:flex-col xl:flex-row xl:justify-between xl:items-center flex ">
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
                  
                  {!showUpdate && readBookData && data && data.data && data.data.ReadingProgress && <div className="flex xl:self-end max-w-xl w-full flex-col gap-2">
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
                
    {!showUpdate && data && data.data && data.data.ReadingProgress &&
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
                  }} data={data.data.ReadingProgress.filter((item) => item.bookId === bookId).length > 0 ? data.data.ReadingProgress.filter((item) => item.bookId === bookId).map((item) => {
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
    }
              
            </div>
          </div>
  )
}

export default BookProgressPanel