'use client';
import Button from 'components/buttons/Button';
import ChatBottomBar from 'components/chatList/ChatBottomBar';
import ChatList from 'components/chatList/chat-lists/ChatList';
import LabeledInput from 'components/input/LabeledInput';
import ChatBar from 'components/Sidebars/left/ChatBar';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from 'hooks/useAuthContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaImage } from 'react-icons/fa';
import { FaMicrophone, FaPaperPlane } from 'react-icons/fa6';
import UserChatList from 'components/chatList/chat-lists/UserChatList';
import UserChatTopBar from 'components/TopBar/UserChatTopBar';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { use, useCallback, useEffect } from 'react';

function MessagesHolder({params}:{params:{chatId:string}}) {
  const router = useRouter();
const {chatId}=params;

  const { user } = useAuthContext();
  const queryClient = useQueryClient();




  const { data, isFetched } = useQuery({
    queryKey: ['userChat', chatId],
    queryFn: () => fetch('/api/supabase/chat/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: { id: chatId }, include: {
          messages: true,
          users: true,
        }
      }),
    }).then((item)=>item.json())
  });

  




  return (
<div className='h-screen w-full flex'>
  <ChatBar />
  <div className="flex flex-col sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.25rem)] w-full">
        {data && user && <>
        <UserChatTopBar/>
          <UserChatList document={data.data} user={user} messages={data.data.messages} isAllowedToSee={data && data.data.users.find((item) => item.id === user.id)} documents={[]}/>
         {data.data.find((item)=>item.id === user.id) && user ? <ChatBottomBar isAllowedToType={false}/> : <ChatBottomBar isAllowedToType={true}/> }
 </> }
  </div>
</div>

  );
}

export default MessagesHolder;
