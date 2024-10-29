import { User } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react'



function useUsersChat() {
    const navigate = useRouter();

    
   
    const createIfNotExistingChat = async (userIds: string[],
        isLoggedIn: true | User) => {
        
        const chatData = await fetch('/api/supabase/chat/get', {
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
        }).then((item) => item.json()).then((result) => result, (err) => err);
        
        if (isLoggedIn || (!chatData || !chatData.data)) {
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
      return fetchedResponse
        }
        
    }
    
    
    const createOrRedirectNotExistingChat = async (userIds: string[],
        isLoggedIn: true | User) => {
        
        const chatData = await fetch('/api/supabase/chat/get', {
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
        }).then((item) => item.json()).then((result)=>result,(err)=>err);
        
        if (isLoggedIn && (!chatData || (chatData && !chatData.data))) {
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
  
    };
    

    const sendSharingMessage = async (chatId: string, typeOfSharing: 'book' | 'test' | 'competition' | 'club', senderId: string, competitionId?: string, clubId?: string, bookId?: string, testId?: string) => {
        try {
            await fetch('/api/supabase/message/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        id: crypto.randomUUID(),
                        chatId,
                        senderId: senderId,
                        sharedCompetitionId: competitionId,
                        sharedClubId: clubId,
                        sentAt: new Date(),
                        sharedTestId: testId,
                        sharedBookId: bookId,
                        content: `Hello, I am recommending you this ${typeOfSharing}`
                    }
                })
            })
        } catch (err) {
            console.log(err);
        }
    };


   

    
    return {
        createOrRedirectNotExistingChat,
        sendSharingMessage,
createIfNotExistingChat
    }
    
}

export default useUsersChat