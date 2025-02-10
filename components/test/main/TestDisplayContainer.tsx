'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'hooks/useAuthContext';
import React from 'react'
import { useSelector } from 'react-redux';
import TestDataBar from './elements/TestDataBar';
import TestResults from './elements/TestResults';

type Props = {testId:string}

function TestDisplayContainer({ testId}: Props) {
    const { user } = useAuthContext();
    
    const { data: document } = useQuery({
        queryKey: ['test'], queryFn: async () => {
            return fetch('/api/supabase/test/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ where: { id: testId } }),
            }).then((res) => res.json())
        }
    });

    

  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );


  return (
      <div className={`h-screen w-full flex sm:flex-col xl:flex-row gap-2`}>
          {document && document.data &&
              <>             
              <TestDataBar document={document} user={user} testId={testId} />
              <TestResults document={document} />
              </>
          }
    </div>
  )
}

export default TestDisplayContainer