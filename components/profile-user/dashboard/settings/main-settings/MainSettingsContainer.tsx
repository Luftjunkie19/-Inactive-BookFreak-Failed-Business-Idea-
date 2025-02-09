'use client';
import React from 'react'
import { useAuthContext } from 'hooks/useAuthContext';
import { useQuery } from '@tanstack/react-query';
import MainForm from './MainForm';
import SettingsOption from './SettingsOption';
import AccountManagement from "./AccountMangement";


function MainSettingsContainer() {
    
      const { user } = useAuthContext();
  const { data: document, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user!.id, include: {
          recensions: true,
          notifications: true,
          'BookLover': true,
          'Comment': true,
          'Result': true,
          'addedBooks': true,
          'bookShelfs': true,
          'ReadingProgress': true,
          'Club': true,
          'Post': true,
        },
      }),
    }).then((res) => res.json())
  });



  return (
   <div className="sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] overflow-y-auto w-full">
        {document && document.data &&<div className='flex flex-col gap-12'>
        
              <MainForm document={document} user={user} />
              
              <SettingsOption />
      
              <AccountManagement/>

        

        </div>
         }
    
      </div>
  )
}

export default MainSettingsContainer