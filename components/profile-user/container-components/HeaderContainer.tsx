'use client';

import { User } from '@supabase/supabase-js';
import Button from 'components/buttons/Button';
import { formatDistanceToNowStrict } from 'date-fns';
import { LucideMessageCircle } from 'lucide-react';
import Image from 'next/image';
import React, { Suspense, useCallback, useMemo } from 'react'
import { BsPersonFillCheck, BsThreeDots } from 'react-icons/bs';
import { FaUserFriends } from 'react-icons/fa';
import { FaLock, FaPencil, FaPersonCircleMinus } from 'react-icons/fa6';
import { MdBlock, MdPersonAdd } from 'react-icons/md';
import { ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react';
import toast from 'react-hot-toast';
import { suspendUser } from 'lib/supabase/block-functionality-server-functions/BlockSuspendFunctions';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { removeFriend } from 'lib/friends-actions/friendsActions';
type Props = {document:{data:any | null, error:any | null}, userId:string, user:User | null}

function HeaderContainer({ document, userId, user }: Props) {
    
    const queryClient = useQueryClient();
    const navigate=useRouter();    

  
  const isNotFriend
  = useMemo((): boolean => {
    if (document && document.data && user) {
      return ![...document.data.friendsStarted, ...document.data.friends].find((item) => (item.inviteeId === userId && item.inviterUserId === user.id && item.inviteeId !== user.id || item.inviterUserId === userId && item.inviteeId === user.id && item.inviterUserId !== user.id))
}

    return false;

  }, [document, userId, user]);
  
  const hasInvited = useMemo(() => {
    return document.data.notifications.find((item) => item.sentBy === user!.id && item.directedTo === userId && item.type === 'friendshipRequest'
      && item.isRead === false)
  }, [
    document,
    user,
    userId
  ])
    
  const createOrRedirectNotExistingChat = useCallback(async () => {
    if (user && document) {
      const foundChat = document.data.chats.find((chat) => chat.users.find((userObj) => userObj === userId) && chat.users.find((userObj) => userObj === user!.id));
      if (!foundChat) {
        try {
          const getAllMentionedUsers = await fetch('/api/supabase/user/getAll', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              where: {
                OR: [{ id: user.id }, { id: userId }],
              },
            }),
          });

          const fetchedAllUsers = await getAllMentionedUsers.json();

          console.log(fetchedAllUsers);

          const response = await fetch('/api/supabase/chat/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: {
                dateOfCreation: new Date(),
                id: crypto.randomUUID(),
                users: {
                  connect: fetchedAllUsers.data.map((item) => ({ id: item.id })),
                },
              },
            })
          });

          const fetchedResponse = await response.json();
      
          console.log(fetchedResponse);
   
          navigate.replace(`/chat/${fetchedResponse.data.id}`);
        
  

        } catch (err) {
          console.log(err);
        }
      } else {
        navigate.replace(`/chat/${foundChat.id}`);
      }
    }
 
  
  }, [user, document, userId, navigate]);




  const inviteUserToFriends = async () => {
    try { 

      if (hasInvited) {
          toast.error('You have already sent an invitation 🙄');
        return;
      }


    const response = await fetch('/api/supabase/notification/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          directedTo: userId,
          type: 'friendshipRequest',
          receivedAt: new Date(),
          sentBy:user!.id,
        }
      }),
    });

    const fetchedRes = await response.json();
      console.log(fetchedRes);
      
      await queryClient.invalidateQueries({ 'queryKey': ['profile', userId], type: 'all' });
      

      toast.success('Request successfully sent !');
      } catch (err) {
      toast.error('Something went wrong 🙄');
      console.log(err);
}
  }
  const handleBlock = async () => {
                    try {
                      const result= await suspendUser('block', user!.id, userId as string);
                      if (!result) {
                        throw new Error('Something went wrong');
                      }
                      toast.success(`User blocked successfully !`);

                      await queryClient.invalidateQueries({ 'queryKey': ['profile', userId], type: 'all' });
                      await queryClient.invalidateQueries({ 'queryKey': ['profile', user!.id], type: 'all' });

                    } catch (err) {
                       toast.error(JSON.stringify(err));

                     }
  }
  
  const handleSuspend= async () => {
                    try {
                      const result= await suspendUser('suspend', user!.id, userId as string);
                      if (!result) {
                        throw new Error('Something went wrong');
                      }
                      toast.success(`User suspended successfully !`);

                 await queryClient.invalidateQueries({ 'queryKey': ['profile', userId], type: 'all' });
                      await queryClient.invalidateQueries({ 'queryKey': ['profile', user!.id], type: 'all' });
                    } catch (err) {
                       toast.error(JSON.stringify(err));

                     }
                  }


  const deleteFriend
   = async () => { 
try{
const removedFriendshipData=await removeFriend(user!.id, userId);

  console.log(removedFriendshipData);
  
 await queryClient.invalidateQueries({ 'queryKey': ['profile', user!.id], type: 'all' });
  await queryClient.invalidateQueries({ 'queryKey': ['profile', userId], type: 'all' });
  await queryClient.invalidateQueries({ queryKey: ['userFriends'], type: 'all' });


} catch (err) {
       console.log(err);
}

  }


  return (
      <div className="flex flex-col w-full sm:gap-14 lg:gap-0">
            <div className='bg-dark-gray sm:h-36 lg:h-52 relative top-0 left-0 mb-3'>
              {document.data.backgroundImg && <Image src={document.data.backgroundImg} alt="" width={60} height={60} className='w-full object-cover h-full'  />}
              
          <div className="flex lg:flex-row sm:flex-col sm:gap-2 lg:gap-4 items-center absolute sm:-bottom-16 lg:-bottom-[5rem] left-3">
            <Image src={document.data.photoURL} alt='' width={60} height={60} className='lg:w-48 sm:self-start lg:h-48 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full' />
              <div className="flex flex-col gap-2 self-end">
                <div className="flex gap-2 sm:justify-between w-full items-center">
                  <p className='text-white sm:text-lg lg:text-3xl font-semibold'>{document.data.nickname}</p>
                    <p className='text-gray-400 font-light sm:text-xs lg:text-sm self-end'>{formatDistanceToNowStrict(new Date(document.data.dateOfJoin))} ago</p>
                </div>
              <p className='flex gap-2 items-center'>
                <FaUserFriends className='text-primary-color text-2xl' />
         
<Suspense fallback={<p className='text-white'>Loading...</p>}>
            <p className='text-white'>{[...document.data.friendsStarted, ...document.data.friends].length} Friends</p>          
</Suspense>
                    
              </p>
            </div>
            </div>
            
      </div>  
            <div className="flex overflow-x-auto items-center gap-4 p-2 self-end">{document && document.data && user &&
              document.data.id !== user.id && 
              <>
        {
              isNotFriend
              &&
              <Button disableState={hasInvited} onClick={inviteUserToFriends} type={hasInvited ? 'dark-blue' : 'blue'} additionalClasses='flex gap-2 items-center'>
              {hasInvited ? 'Invited' : 'Invite to friends'
              } <MdPersonAdd
              className='text-xl'
              />
              </Button>
              }

               {!isNotFriend &&
                (
          <Button
            onClick={
              deleteFriend
            }
            additionalClasses='flex group transition-all hover:scale-90  gap-3 items-center justify-between hover:bg-red-500 text-base text-lg' type={'black'} >
                  Friends
                   <FaPersonCircleMinus className='text-xl hidden opacity-0 group-hover:block group-hover:opacity-100 transition-all' />
                   <BsPersonFillCheck  className='text-xl group-hover:opacity-0 group-hover:hidden transition-all'/>
                </Button>
          
             )
              }


              <Button onClick={createOrRedirectNotExistingChat} type={'white-blue'} additionalClasses='flex gap-2 items-center'>
                Message <LucideMessageCircle />
              </Button>
              <Dropdown placement='bottom-end' classNames={{
                'content': 'bg-dark-gray border-2 border-primary-color',

      }}>
      <DropdownTrigger  className='text-white cursor-pointer' as='div' >
<p className="flex items-center text-white  flex-nowrap gap-2">More Action <BsThreeDots className='text-primary-color text-2xl'/></p>
      </DropdownTrigger>
                <DropdownMenu popover='auto'  variant='faded' aria-label="Dropdown menu with description">
                  <DropdownItem onClick={handleBlock} classNames={{base:"group"}} endContent={<FaLock className='text-red-400'/>} description={<p>Disable user to interact with you </p>} >
            <p className="text-white group-hover:text-dark-gray transition-all">Block</p>
          </DropdownItem>
                  <DropdownItem onClick={handleSuspend} description={<p>Disable user to see your content </p>} classNames={{
          'base':'text-white hover:bg-secondary-color flex items-center gap-2 group'
        }}
                    endContent={<MdBlock className='text-red-400 text-2xl' />}
          >
             <p className="text-white group-hover:text-dark-gray transition-all">Suspend</p>
          </DropdownItem>
         
      </DropdownMenu>
    </Dropdown>
              </>
              }

              {document && user &&
              document.data.id === user.id && <Button onClick={()=>navigate.push('/profile/dashboard')} type={'blue'} additionalClasses='flex gap-2 px-2 items-center'>Change <FaPencil/></Button> }


            </div>
            
       </div>
  )
}

export default HeaderContainer
