'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { FaCodePullRequest, FaUsers } from 'react-icons/fa6'


import { DataTable } from 'components/table/DataTable'
import { columns } from 'components/table/columns/CompetitionColumns'
import { adminColumns } from 'components/table/columns/AdminColumns'
import { clubRequestColumns } from 'components/table/columns/ClubRequestsColumns';
import { FaUsersCog } from 'react-icons/fa';

type Props = {
    clubId:string
}



const ClubTableView = ({clubId}: Props) => {
  const { data: document } = useQuery({
        queryKey:['club', clubId],
        queryFn: () => fetch('/api/supabase/club/get', {
          method: 'POST',
          headers:{
            'Content-Type':'application/json',
          }, 
          body:JSON.stringify({
        id:clubId, include:undefined,
          })
        }).then((res)=>res.json())
      });

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




  return (
      <>
          <div id='first-particpant-form-section' className="flex flex-col gap-1">
              <p className='text-white text-2xl flex items-center gap-2'><FaCodePullRequest /> Requests/Reports from Participants</p>
                
      
              {document && document.data && <>
          <div className="max-w-7xl w-full mx-auto">
            
                    <DataTable filterColumnName='nickname' columns={clubRequestColumns} data={document.data.requests.filter((item) => !item.isAccepted).map((item) => ({ userId: item.user.id, clubId:item.clubId, id: item.id, nickname: item.user.nickname, photoURL: item.user.photoURL, email: item.user.email, fulfillsRequirements:item.fullfilsRequirements, requiredTextAnswer:item.requiredTextAnswer,  readBooks: getUniqueBooks(item.user.ReadingProgress.filter((progress, index, self)=>progress.book.pages === self.filter((item)=>item.id === progress.id).map((item)=>item.pagesRead).reduce((cur, prev)=>cur + prev, 0))).length, readPages: item.user.ReadingProgress.map((item)=>item.pagesRead).reduce((prev, cur) => prev + cur, 0)}))} />
              </div>
              </>
                }
                
               
              </div>
              
                  <div id='second-particpant-form-section' className="flex flex-col gap-1">
              <p className='text-white text-2xl flex gap-2 items-center'><FaUsersCog /> Administration </p>
      
      
      
                 {document && <>
          <div className="max-w-7xl w-full mx-auto">
            
                  <DataTable filterColumnName='nickname' columns={adminColumns} data={document.data.members.filter((item)=>item.isAdmin && !item.isCreator).map((item)=>({id:item.id, nickname:item.user.nickname, role: item.isCreator ? 'Creator' : item.isOwner ? 'Owner' : 'Admin', photoURL:item.user.photoURL, joiningDate:new Date(item.joiningDate), readBooks: getUniqueBooks(item.user.ReadingProgress).length , readPages: item.user.ReadingProgress.map((item)=>item.pagesRead).reduce((prev, cur) => prev + cur, 0)}))} />
                </div>
                  
                </>}
      
                
              </div>
              
                  <div id='third-particpant-form-section' className="flex flex-col gap-1">
                <p className='text-white text-2xl flex gap-2 items-center'><FaUsers /> Competition&apos;s Participants</p>
      
                
                   {document && <>
          <div className="max-w-7xl w-full mx-auto">
            
                  <DataTable filterColumnName='nickname' columns={columns} data={document.data.members.filter((member)=> !member.isCreator && !member.isOwner).map((item)=>({id:item.id, userId:item.user.id, associationId:clubId, nickname:item.user.nickname, email:item.user.email, photoURL:item.user.photoURL, joiningDate:new Date(item.joiningDate), readBooks: getUniqueBooks(item.user.ReadingProgress.filter((progress, index, self)=>progress.book.pages === self.filter((item)=>item.id === progress.id).map((item)=>item.pagesRead).reduce((cur, prev)=>cur + prev, 0))).length, readPages: item.user.ReadingProgress.map((item)=>item.pagesRead).reduce((prev, cur) => prev + cur, 0)}))} />
                </div>
                  
                </>}
      
                
                </div>
      
            
      
      
      </>
  )
}

export default ClubTableView