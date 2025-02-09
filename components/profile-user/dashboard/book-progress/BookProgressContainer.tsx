'use client';

import { useQueries } from '@tanstack/react-query';
import { useAuthContext } from 'hooks/useAuthContext';
import { useSearchParams } from 'next/navigation';

import React from 'react'
import BookProgressPanel from './BookProgressPanel';
import BookReadStatistics from './BookReadStatistics';
import ReadingNotesSection from './ReadingNotesSection';

type Props = {}

function BookProgressContainer({  }: Props) {
    const { user } = useAuthContext();
      const params = useSearchParams();
      const bookId = params.get('bookId')?.split('?')[0];
    const readToday = params.get('bookId')?.split('?')[1].split('=')[1] === 'true' ? true : false;

    const [bookReadData, userReadData] = useQueries({
        queries: [{
          'queryKey': ['dashboardBook', bookId], queryFn: () => fetch('/api/supabase/book/get', {
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
        },
        {
          queryKey: ['userProgressDashboard', user?.id], queryFn: () => fetch('/api/supabase/user/get', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: user?.id, include: {
                'recensions': { 'include': { 'book': true } },
                ReadingProgress: {
                  'include': {
                    'book': true,
                    'user': true
                  },
                },
                'notifications': true,
              }
            }),
          }).then((res) => res.json()),
        }
        ]
      });

    
    


  return (
      <>
          {bookReadData.isLoading && userReadData.isLoading && <div>Loading...</div>}
          {bookReadData.error || userReadData.error && <div>Something went wrong</div>}
         
    
          {userReadData && bookReadData && bookReadData.data  && userReadData.data && user &&
              <>
            
            <BookProgressPanel bookId={bookId} data={userReadData.data} userId={user!.id} readBookData={bookReadData.data} readToday={readToday} />
        
            <BookReadStatistics data={userReadData.data} bookId={bookId} />
            <ReadingNotesSection  />
          </>
}
         
    </>
  )
}

export default BookProgressContainer