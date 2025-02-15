'use client';
import { useQuery } from '@tanstack/react-query';
import UserChatList from 'components/chatList/chat-lists/UserChatList';
import ChatBottomBar from 'components/chatList/ChatBottomBar';
import UserChatTopBar from 'components/TopBar/UserChatTopBar';
import { useAuthContext } from 'hooks/useAuthContext';
import React from 'react'

type Props = {chatId:string}

function ChatView({ chatId}: Props) {
  
const { user } = useAuthContext();


  const { data, isFetched } = useQuery({
    queryKey: ['userChat', chatId],
    queryFn: () => fetch('/api/supabase/chat/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: { id: chatId },
        include: {
          messages: {
            include: {
            'recommendation':true,
                sender: true,
                competition: true,
                club: true,
                book:true,
          }},
          users:true,
        }
      }),
    }).then((item)=>item.json())
  });


  return (
    <>
      {data && user && data.data && <>
        <UserChatTopBar chatUsers={data.data.users}/>
          <UserChatList document={data.data} user={user} messages={data.data.messages} isAllowedToSee={data && data.data.users.find((item) => item.id === user.id)} />
         {data.data.users.find((item)=>item.id === user.id) && user ? <ChatBottomBar directUserId={data.data.users.find((item) => item.id !== user.id).id} updateQueryName='userChat' userId={user.id} chatId={(chatId as string)} isAllowedToType={false}/> : <ChatBottomBar directUserId={data.data.users.find((item) => item.id !== user.id).id} updateQueryName='userChat' userId={user.id} chatId={(chatId as string)} isAllowedToType={true}/> }
      </>}
    </>
  )
}

export default ChatView