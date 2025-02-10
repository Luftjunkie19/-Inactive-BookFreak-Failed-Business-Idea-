'use client';

import React, { useEffect, useState } from 'react'
import TestAnswers from './TestAnswers';
import { User } from '@supabase/supabase-js';
import BottomBar from './BottomBar';

type Props = {document:{data:any|null, error:any | null}, userDocument:{data:any|null, error:any | null}, user:User|null, testId:string}

function PlayedDisplay({document, userDocument, user, testId}: Props) {

      const [timeGone, setTimeGone]=useState<number>(0);
      const [accquiredPoints, setAccquiredPoints] = useState<number>(0);
      const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    
  
useEffect(()=>{
  const interval= setInterval(()=>{
    setTimeGone(timeGone + 1);
  },1000);
  

  return ()=>clearInterval(interval);


},[currentQuestion, document, timeGone])



  return (
      <>
       {document && document.data && <div className='flex justify-center gap-16 items-center w-full h-full flex-col'>
        <div className="flex flex-col gap-2 bg-white text-dark-gray max-w-lg w-full rounded-lg p-6">
          <p>{currentQuestion + 1} Question</p>
        <p className='text-2xl font-bold mb-2'>{document.data.questions[currentQuestion].questionContent}</p>
        </div>

      <TestAnswers setTimeGone={setTimeGone} accquiredPoints={accquiredPoints} setAccquiredPoints={setAccquiredPoints} setCurrentQuestion={setCurrentQuestion} questions={document.data.questions} currentQuestion={currentQuestion} document={document} user={user} testId={testId} />
         
          </div>}
          <BottomBar accquiredPoints={accquiredPoints} userDocument={userDocument} timeGone={timeGone} />
      </>
  )
}

export default PlayedDisplay