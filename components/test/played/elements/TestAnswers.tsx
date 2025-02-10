import React, { useState } from 'react'
import alphabet from 'alphabet'
import toast from 'react-hot-toast';
import alertMessages from '../../../../assets/translations/AlertMessages.json';
import { useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
type Props = {
    questions: any[], currentQuestion: number, document: { data: any | null, error: any | null },
    user: User | any, testId: string,
    setAccquiredPoints: (acquiredPoints: number) => void,
    setCurrentQuestion: (currentQuestion: number) => void,
    accquiredPoints: number,
    setTimeGone:(timeGone: number) => void
    
}

function TestAnswers({ questions, currentQuestion, document,testId,user, setAccquiredPoints, setCurrentQuestion, accquiredPoints, setTimeGone}: Props) {
    const searchParams = useSearchParams();
    const navigate = useRouter();
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<{ id: string, isCorrect: boolean }>();
    const selectedLanguage = useSelector((state: any) => state.languageSelection.selectedLangugage);
const queryClient=useQueryClient();
      const leaveTheTest = () => {
  navigate.back();
}
    
    
   const insertResult = async (acquiredPoints:number) => { 
    if (document && document.data) {
        const time = Number.parseInt(searchParams.get('time')?.split("?")[0] as string); 
      console.log(searchParams.get('attemptId'));
      const attemptId = searchParams.get('time')?.split("?")[1].split('=')[1];
      
 const insertedObj = await fetch('/api/supabase/result/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: {score: acquiredPoints, testId, userId: user!.id, id: attemptId, percentageResult: Math.floor((acquiredPoints / document.data.questions.length) * 100), timeStarted: new Date(time), timeFinished: new Date(), timeDevoted: new Date().getTime() - new Date(time).getTime() } })
    });

    const insertedObjFetched = await insertedObj.json();

      console.log(insertedObjFetched);
      
      await queryClient.invalidateQueries({ 'queryKey': ['test', testId], exact: true, 'type': 'all' });

    return insertedObjFetched;
    }
  
  }

         const validateAnswer = (chosenId: string, correctAnswers: string[]) => {
      // Using setTimeout to delay answer validation
      setTimeout(async () => {
        const isCorrectAnswer = correctAnswers.includes(chosenId); // Use includes for simplicity
    
        // Validation logic for correct or incorrect answers
        if (isCorrectAnswer && currentQuestion < questions.length - 1) {
          // Correct answer, update points and state
          setAccquiredPoints((points: number) => points + 1);
          setIsAnswerCorrect({ id: chosenId, isCorrect: true });
          toast.success(alertMessages.notifications.successfull.answer[selectedLanguage]);
          setCurrentQuestion(currentQuestion + 1);
        }
        else if (currentQuestion === questions.length - 1) {
    
          if (isCorrectAnswer) {
            setAccquiredPoints((points: number) => points + 1);
          setIsAnswerCorrect({ id: chosenId, isCorrect: true });
          toast.success(alertMessages.notifications.successfull.answer[selectedLanguage]);
          } else {
              setIsAnswerCorrect({ id: chosenId, isCorrect: false });
          toast.error(alertMessages.notifications.wrong.answer[selectedLanguage]);
          }
          
          setTimeout(async () => {
            const insertedObj = await insertResult(isCorrectAnswer ? accquiredPoints + 1 : accquiredPoints);
      
            if (insertedObj.data) {
              leaveTheTest();
            }
    
          }, 2000);
        
        }
        else {
          // Incorrect answer, update state and notify
          setIsAnswerCorrect({ id: chosenId, isCorrect: false });
          toast.error(alertMessages.notifications.wrong.answer[selectedLanguage]);
           setCurrentQuestion(currentQuestion + 1);
        }
    
      
          setIsAnswerCorrect(undefined);
          setTimeGone(0);
    

        
      }, 2000); // Delay answer validation for 2 seconds
    };

  
    
  return (
   <div className="flex w-full self-end gap-2 items-center mx-auto m-0 p-2">
        {questions[currentQuestion].answers.map((item, index: string | number)=>(<button disabled={isAnswerCorrect ? true : false} onClick={()=>{
          validateAnswer(item.id, questions[currentQuestion].correctAnswer);

        }} className={`flex border-primary-color border-2 ${typeof isAnswerCorrect !== 'undefined' && isAnswerCorrect.id !== item.id && !isAnswerCorrect.isCorrect  && 'bg-red-400'}  ${typeof isAnswerCorrect !== 'undefined' && isAnswerCorrect.id === item.id && isAnswerCorrect.isCorrect  && 'bg-green-400'} bg-dark-gray hover:text-dark-gray hover:bg-primary-color/40  transition-all duration-400 cursor-pointer flex-1  text-white p-3 rounded-lg`} key={item.id}>
          <p>{alphabet[index].toUpperCase()}. {item.answerContent}</p>
        </button>))}
      </div>
  )
}

export default TestAnswers