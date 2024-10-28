import { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react'

type Props = {
    userIds: string[],
    isLoggedIn: true | User
}

function useUsersChat({ userIds, isLoggedIn }: Props) {
    

   const { data:chatData, isFetched } = useQuery({
    queryKey: ['userChat'],
    queryFn: () => fetch('/api/supabase/chat/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: {
          AND: [
            {
              users: {
                every: {
                  id: {
                    in: userIds
                  }
                }
              }
            },
          ]
        },
        include: {
          messages: true,
          users: true,
        }
      }),
    }).then((item)=>item.json())
   });
    
    const createOrRedirectNotExistingChat = useCallback(async () => {
        if (isLoggedIn && (!chatData || !chatData.data)) {
            try {
                const getAllMentionedUsers = await fetch('/api/supabase/user/getAll', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        where: {
                            OR: userIds.map((item) => ({ id: item }))
                        },
                    }),
                });

                const fetchedAllUsers = await getAllMentionedUsers.json();


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
            navigate.replace(`/chat/${chatData.data.id}`);
        }
  
    }, [isLoggedIn, chatData]);
    

    const sendSharingMessage=async ()=>{}


    
    return {
        chatObject:chatData.data,
createOrRedirectNotExistingChat
    }
    
}

export default useUsersChat