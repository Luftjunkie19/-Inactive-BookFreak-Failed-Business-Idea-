import { User } from '@supabase/supabase-js';
import React from 'react'



export function useRequest() {

      const getUniqueBooks = (readingProgress) => {
  // Use an object as a lookup table to avoid duplicate bookIds
  const bookMap = {};

  return readingProgress.reduce((uniqueBooks, item) => {
    if (!bookMap[item.bookId]) {
      bookMap[item.bookId] = true; // Mark bookId as added
      uniqueBooks.push(item);      // Add the book object to the array
    }
    return uniqueBooks;
  }, []);
};
    
    const sendJoinRequest = async (user: User, type: 'competition' | 'club', id: string, receiverId:string) => {
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
                            ReadingProgress: {
                                include: {
                                    book: true,
                                }
                            },
                        }
                    })
                }).then((res) => res.json());
    
    
              const requestFetch=  await fetch('/api/supabase/request/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            userId: user.id,
                            clubId: type === 'club' ? id : null,
                            competitionId: type === 'competition' ? id : null,
                            readRequiredPagesAmount: userDocument.data.ReadingProgress.reduce((prev, cur) => prev.pagesRead + cur.pagesRead, 0),
                            readRequiredBooksAmount: getUniqueBooks(userDocument.data.ReadingProgress).length,
                            fullfilsRequirements: true,
                            requestType: `${type}`,
                            isAccepted: false,
                        },
                    })
              });
                
                const reqeustRes = await requestFetch.json();

                await fetch('/api/supabase/notification/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            sentBy: user.id,
                            type: 'competitionRequest',
                            isCompetitionRequest: true,
                            directedTo: receiverId,
                            requestId: reqeustRes.data.id,
                            receivedAt: new Date()
                        }
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

