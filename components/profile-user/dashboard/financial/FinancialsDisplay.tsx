'use client';
import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'hooks/useAuthContext';
import DataForm from './DataForm';
import FundsSection from './FundsSection';
import SubscriptionManagement from './SubscriptionManagement';
type Props = {}

function FinancialsDisplay({}: Props) {
  const {user}= useAuthContext();
  
  const { data: document } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id:user!.id, include:{
        'recensions':{'include':{'book':true}},
        'ReadingProgress':{orderBy:{'startTime':'desc'}, include:{
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
      <div className='flex flex-col pb-2 overflow-y-auto sm:h-[calc(100vh-3.5rem)] xl:h-[calc(100vh-4rem)] gap-2'>
          {document && <p className='text-white text-3xl'>Hello, {document.data.nickname} !</p>}
          <DataForm />
          <FundsSection />
          <SubscriptionManagement />
    </div>
  )
}

export default FinancialsDisplay