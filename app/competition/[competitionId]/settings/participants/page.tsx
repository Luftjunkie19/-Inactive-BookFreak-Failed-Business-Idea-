'use client';
import Button from 'components/buttons/Button'
import DashboardBar from 'components/Sidebars/left/competition/DashboardBar'
import React from 'react'
import img from '../../../../../assets/Logo.png'
import { FaAnglesDown, FaAnglesUp, FaBan, FaBook, FaCircleUser, FaCodePullRequest, FaUsers } from 'react-icons/fa6'
import { RiContractFill, RiMapPinTimeLine, RiQuestionAnswerFill } from 'react-icons/ri'
import Image from 'next/image'
import { BsThreeDots, BsThreeDotsVertical } from 'react-icons/bs'
import { FaCheckCircle, FaUsersCog, FaVolumeMute } from 'react-icons/fa'
import { MdCancel } from 'react-icons/md'
import { GiExitDoor, GiRank3 } from 'react-icons/gi'
import { SiPowerpages } from 'react-icons/si'
import { TbAlertTriangleFilled } from 'react-icons/tb'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { DataTable } from 'components/table/DataTable'
import { columns } from 'components/table/columns/CompetitionColumns'
import { adminColumns } from 'components/table/columns/AdminColumns';
import { requestColumns } from 'components/table/columns/RequestColumns';
import { useAuthContext } from 'hooks/useAuthContext';

type Props = {}

function Page({ }: Props) {
  const { competitionId } = useParams();
  const {user}=useAuthContext();
  
     const { data: document } = useQuery({
        queryKey:['competition'],
        queryFn: () => fetch('/api/supabase/competition/get', {
          method: 'POST',
          headers:{
            'Content-Type':'application/json',
          }, 
          body:JSON.stringify({
        id:competitionId, include:undefined})
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
    <div className='flex w-full'>
  <DashboardBar/>
      <div className='w-full flex gap-6 sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)]  flex-col overflow-y-auto p-3'>
        <div className="flex flex-col gap-1">
          <p className='text-white text-2xl flex items-center gap-2'><FaCodePullRequest /> Requests/Reports from Participants</p>
          {document && 
            <DataTable filterColumnName='nickname' columns={requestColumns} data={document.data.requests.filter((item) => !item.isAccepted).map((item) => ({ userId: item.user.id, competitionId:item.competitionId, id: item.id, nickname: item.user.nickname, photoURL: item.user.photoURL, email: item.user.email, fulfillsRequirements:item.fullfilsRequirements, requiredTextAnswer:item.requiredTextAnswer,  readBooks: getUniqueBooks(item.user.ReadingProgress.filter((progress, index, self)=>progress.book.pages === self.filter((item)=>item.id === progress.id).map((item)=>item.pagesRead).reduce((cur, prev)=>cur + prev, 0))).length, readPages: item.user.ReadingProgress.map((item)=>item.pagesRead).reduce((prev, cur) => prev + cur, 0)}))} />
          }


        
        </div>
        
            <div className="flex flex-col gap-1">
        <p className='text-white text-2xl flex gap-2 items-center'><FaUsersCog /> Administration </p>

  

           {document && <>
          
            <DataTable filterColumnName='nickname' columns={adminColumns} data={document.data.members.filter((item)=>item.isAdmin && item.userId !== user!.id).map((item)=>({id:item.id, nickname:item.user.nickname, role: item.isCreator ? 'Creator' : item.isOwner ? 'Owner' : 'Admin', photoURL:item.user.photoURL, joiningDate:new Date(item.joiningDate), readBooks: getUniqueBooks(item.user.ReadingProgress).length, readPages: item.user.ReadingProgress.map((item)=>item.pagesRead).reduce((prev, cur) => prev + cur, 0) }))} />
            
          </>}

          
        </div>
        
            <div className="flex flex-col gap-1">
          <p className='text-white text-2xl flex gap-2 items-center'><FaUsers /> Competition&#39;s Participants</p>

          
             {document && <>
          
            <DataTable filterColumnName='nickname' columns={columns} data={document.data.members.filter((member)=> !member.isCreator && !member.isOwner).map((item) => ({ id: item.id, userId:item.user.id, associationId:competitionId, nickname: item.user.nickname, email: item.user.email, photoURL: item.user.photoURL, joiningDate: new Date(item.joiningDate), readBooks:  getUniqueBooks(item.user.ReadingProgress.filter((progress, index, self)=>progress.book.pages === self.filter((item)=>item.id === progress.id).map((item)=>item.pagesRead).reduce((cur, prev)=>cur + prev, 0))).length, readPages: item.user.ReadingProgress.map((item)=>item.pagesRead).reduce((prev, cur) => prev + cur, 0) }))} />
            
          </>}

          
          </div>

      
        
</div>
  </div>
  )
}

export default Page