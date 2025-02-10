'use client';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'hooks/useAuthContext';
import React, { useEffect } from 'react';
import PlayedDisplay from './elements/PlayedDisplay';

type Props = {testId:string}

function PlayedTestContainer({ testId }: Props) {
    const { user } = useAuthContext();

      const {data:userDocument}=useQuery({
        queryKey: ['testedUser'], queryFn: () => fetch('/api/supabase/user/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: user!.id }),
        }).then((res) => res.json())
      });
    
      const { data: document } = useQuery({
        queryKey: ['test', testId], queryFn: () => fetch('/api/supabase/test/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: testId }),
        }).then((res) => res.json())
      });
    

    


  return (
      <div className="sm:h-[calc(100vh-3.25rem)] lg:h-[calc(100vh-4rem)] relative overflow-y-auto justify-between top-0 left-0 w-full flex flex-col gap-4 items-center">
          <PlayedDisplay userDocument={userDocument} document={document} user={user} testId={testId}  />
    </div>
  )
}

export default PlayedTestContainer