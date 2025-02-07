'use client';
import { useQuery } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import { formatDistanceToNowStrict } from 'date-fns';
import Image from 'next/image';
import React, { Suspense } from 'react'
import { BsPersonFillCheck } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';
import { FaPersonCircleMinus } from 'react-icons/fa6';
import { MdPersonAdd } from 'react-icons/md';
import HeaderContainer from './container-components/HeaderContainer';
import { useAuthContext } from 'hooks/useAuthContext';
import ProfileDetails from './container-components/ProfileDetails';
import TabsActivitySection from './container-components/TabsActivitySection';

type Props = {
    userId: string
    
}

function ProfileDisplayContainer({userId }: Props) {

     const { data: document } = useQuery({
        queryKey: ['profile', userId],
        queryFn: () => fetch('/api/supabase/user/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: userId, include: {
              recensions: { include: { user: true, book: true } },
              notifications: true,
              'BookLover': true,
              'Comment': true,
              'Result': true,
              'addedBooks': true,
              'bookShelfs': true,
              'ReadingProgress': {
                include: {
                book:true,
                }
              },
             blockerUser:true,
              blockedUsers:true,
              friendsStarted: true,
              'chats':{include:{'users':{include:true}}},
              friends: true,
              'Post':{ 'include': {
                            'owner': true,
                            'lovers': true,
                      
                'comments': true,
                            viewers:true,
                            
                }},
              Member: {
                include: {  
                  'Club': {
                    include: {
                      'members': true,
                      requirements: true,
                    },
                  },
                  Competition: {
                    include: {
                      'members': true,
                      rules: true,
                    }
                  }
                }
              },
            }
          })
        }).then((res) => res.json())
     });
    const { user } = useAuthContext();



  return (
      <div>
           {document && document.data && 
        <>
        <div className="flex flex-col gap-2 w-full">
        
                      <HeaderContainer document={document} userId={userId} user={user}/>

          
                  <div className="flex sm:flex-col 2xl:flex-row w-full gap-6 px-2 py-4">
                      
        
                      <ProfileDetails document={document} user={
                          user
                      } userId={userId}/>

                      <TabsActivitySection document={document} user={user}/>

          
          </div>
         

        </div>
          
        
       
   </>
 }


    </div>
  )
}

export default ProfileDisplayContainer