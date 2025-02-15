'use client';
import { FaBell } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import image from 'assets/about-image.jpg'
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from 'hooks/useLogout';
import {motion} from 'framer-motion'
import { viewerActions } from 'context/ViewerContext';
import Button from 'components/buttons/Button';
import { FaCheck } from 'react-icons/fa6';
import { MdCancel } from 'react-icons/md';
import Image from 'next/image';
import Notification from './notification/Notification';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { TbBooksOff } from 'react-icons/tb';

function NotificationViewer() {
  const { user } = useAuthContext();
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );

  const [activeState, setActiveState]=useState<'all' | 'unread'>('unread');

  const {data}=useQuery({
    queryKey: ['notifications', user.id],
    queryFn: () => fetch('/api/supabase/notification/getAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({where:{directedTo:user.id}}),
    }).then((item) => item.json()),
    enabled: !!user,
  })

  
  const openedState = useSelector((state: any) => state.viewer.isOpened);
  
  const queryClient=useQueryClient();
  const dispatch=useDispatch();

  const openDialog=()=>{
    dispatch(viewerActions.toggleState())
  }

  const readNotification=async (senderId:string, notificationId:string) => {
    try{
    const res =  await fetch('/api/supabase/notification/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({
           where:{ sentBy: senderId,  
            id:notificationId },
            data:{
              seenAt:new Date(),
              isRead:true,
            }
            })
      });
    
      console.log(await res.json())
      await queryClient.invalidateQueries({
        queryKey: ['notifications', user!.id],
        'type': 'all',
      });

    }catch(err){
      console.log(err);
    }
    
     
      };

  const { mutateAsync, isSuccess, isPending  } = useMutation({
    mutationKey: ['notifications', user.id],
     mutationFn: async ({ senderId, notificationId }: { senderId: string; notificationId: string }) => {
    await readNotification(senderId, notificationId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['notifications', user!.id],
        'type': 'all',
      });
    }
  });
   


  return (
    <div className='relative top-0 left-0' >
      <FaBell id='notification-btn' onClick={openDialog} size={24} className={` transition-all duration-500 cursor-pointer   hover:text-primary-color ${isDarkModed ? 'text-yellow-500' : 'text-white'}`} />
      {data && data.data.filter((item) => !item.isRead).length > 0 && 
      <div className="absolute -bottom-[12px] -right-[10px] bg-red-700 flex justify-center items-center rounded-full p-2 w-5 h-5">
          <p className='text-white text-xs'>{data.data.filter((item) => !item.isRead).length}</p>
      </div>
      }
    <motion.div  animate={{
      'scale': openedState ? 1 : 0,
      opacity:openedState ? 1 : 0,
      x: openedState ? -250 : -200,
      y: openedState ? 15 : 50,
      zIndex:999,
      type:'spring',
      
    }} className="absolute flex-col gap-2 flex min-w-96 max-w-96 border-primary-color border-2 p-2 w-full max-h-80 min-h-72 bg-dark-gray rounded-lg">
      <p className='text-white text-xl'>Notifications</p>
      <div className="flex items-center gap-2">
        <Button onClick={()=>setActiveState('all')} additionalClasses='px-3' type={activeState==='all' ? 'blue' : 'white-blue'}>All</Button>
        <Button onClick={()=>setActiveState('unread')} type={activeState==='unread' ? 'blue' : 'white-blue'}>Unread</Button>
      </div>
      <div className="flex flex-col gap-2 w-full h-full overflow-x-hidden overflow-y-auto">
        {data && data.data && activeState === 'unread' && data.data.filter(((notification)=>!notification.isRead)).length > 0 && data.data.filter(((notification)=>!notification.isRead)).map((notification)=>(
             <Notification clubInvitation={ notification.clubInvitation && {'invitationLinkToClub':notification.clubInvitation.clubId, 'invitationMessageContent':notification.clubInvitation.message}} readNotification={()=>mutateAsync({senderId:notification.sentBy, notificationId:notification.id})} requestToJoin={notification.request} messageObject={notification.newMessage} isRead={notification.isRead} receiverId={notification.receiver.id} notificationId={notification.id} senderNickname={notification.sender.nickname} key={notification.id} image={notification.sender.photoURL}  isFriendshipRequest={notification.type === 'friendshipRequest'} senderId={notification.sentBy} sentAt={new Date(notification.receivedAt)}  />
        )) 
        }

{data && data.data && activeState=== 'all' && data.data.length > 0 && data.data.map((notification)=>(
  <Notification clubInvitation={notification.clubInvitation && {'invitationLinkToClub':notification.clubInvitation.clubId, 'invitationMessageContent':notification.clubInvitation.message}} readNotification={()=>mutateAsync({senderId:notification.sentBy, notificationId:notification.id})} requestToJoin={notification.request}  messageObject={notification.newMessage} isRead={notification.isRead} receiverId={notification.receiver.id} notificationId={notification.id} senderNickname={notification.sender.nickname} key={notification.id} image={notification.sender.photoURL} isFriendshipRequest={notification.type === 'friendshipRequest'} senderId={notification.sentBy} sentAt={new Date(notification.receivedAt)}  />
        )) 
        }

         

        {data && data.data && activeState=== 'unread' && data.data.filter(((notification)=>!notification.isRead)).length === 0 && <div className='w-full flex flex-col self-center gap-2 justify-center h-full items-center'>
        <TbBooksOff size={48} className="text-primary-color" />
        <p className="text-white text-sm">No Notifications have been sent to you.</p>
        </div>}



      

      </div>
    </motion.div>
    </div>
  );
}

export default NotificationViewer;