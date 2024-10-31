import { User } from '@supabase/supabase-js';
import React from 'react'



export function useRequest() {
    
    const sendJoinRequest = async (user: User, type: 'competition' | 'club', id: string) => {
        try {     
            if (user) {
                const userDocument = await fetch('/api/supabase/user/get', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: user && user.id,
                        include: {
                            BookLover: { include: { user: true, Book: true } },
                            bookShelfs: {
                                include: { user: true, books: true },
                            },
                            booksInRead: {
                                include: {
                                    book: true,
                                }
                            },
                        }
                    })
                }).then((res) => res.json());
    
    
                await fetch('/api/supabase/request/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            userId: user.id,
                            clubId: type === 'club' ? id : null,
                            competitionId: type === 'competition' ? id : null,
                            readRequiredPagesAmount: userDocument.data.booksInRead.reduce((prev, cur) => prev.pagesRead + cur.pagesRead, 0),
                            readRequiredBooksAmount: userDocument.data.booksInRead.length,
                            fullfilsRequirements: true,
                            requestType: `This is request to the ${type}`,
                            isAccepted: false,
                        },
                    })
                });
            }
        } catch (err) { 
            console.log(err);
        }
    }

    return {
        sendJoinRequest
    }
}

