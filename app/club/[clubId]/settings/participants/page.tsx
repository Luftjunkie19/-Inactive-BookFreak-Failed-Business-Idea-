'use client';
import React from 'react'
import Button from 'components/buttons/Button'
import DashboardBar from 'components/Sidebars/left/competition/DashboardBar'
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
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { DataTable } from 'components/table/DataTable'
import { columns } from 'components/table/columns/CompetitionColumns'
import { adminColumns } from 'components/table/columns/AdminColumns'


type Props = {}

function page({ }: Props) {
  const { clubId } = useParams();

  const { data: document } = useQuery({
        queryKey:['club'],
        queryFn: () => fetch('/api/supabase/club/get', {
          method: 'POST',
          headers:{
            'Content-Type':'application/json',
          }, 
          body:JSON.stringify({
        id:clubId, include: {
        prize:true,
                members:{
              include: {
                user:{include: {
                    booksInRead: {
                      include: {
                        book: true
                      },
                    },
                  }},
              },
          },
requests: {
              include: {
                user: {
                  include: {
                    booksInRead:true,
                  }
                },
                },
            },    
     'chat': { 'include': { 'messages': true, users:true, chatId:true }},
          Message:true,
            requirements:true,
          }})
        }).then((res)=>res.json())
      });


  
  return (
      <div className='w-full flex gap-6 sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)]  flex-col overflow-y-auto p-3'>
      <div className="flex flex-col gap-1">
        <p className='text-white text-2xl flex items-center gap-2'><FaCodePullRequest /> Requests/Reports from Participants</p>
          
          
          <div className="overflow-x-auto xl:overflow-x-hidden w-full">
  
          <div className="flex text-white mx-auto justify-between p-1 items-center  overflow-x-hidden w-full">
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>User <FaCircleUser className='text-2xl text-primary-color' /></p>
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>Read <FaBook className='text-2xl text-primary-color'/></p>
                       <p className='flex-1 justify-center flex items-center gap-6 text-center'>Conditions <RiContractFill className='text-2xl text-primary-color'/></p>
              <p className='flex-1 justify-center flex items-center gap-6 text-center'>Answers <RiQuestionAnswerFill className='text-2xl text-primary-color' /></p>
                 <p className='flex-1 justify-center flex items-center gap-6 text-center'>Decision <BsThreeDots  className='text-2xl text-primary-color' /></p>
            </div>
            
          <div className="flex flex-col max-h-[32rem] gap-4 w-full bg-dark-gray p-2 rounded mx-auto">

              <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                <div className="flex-1 items-center flex justify-center "><Button additionalClasses='text-nowrap rounded-lg' type='blue'>Check Answers</Button></div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                                    <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaCheckCircle/></Button>
                   <Button additionalClasses='text-red-400 text-3xl' type='transparent'><MdCancel /></Button>
                </div>
              </div>
              
                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                <div className="flex-1 items-center flex justify-center "><Button additionalClasses='text-nowrap rounded-lg' type='blue'>Check Answers</Button></div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                                   <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaCheckCircle/></Button>
                   <Button additionalClasses='text-red-400 text-3xl' type='transparent'><MdCancel /></Button>
                </div>
              </div>

                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                <div className="flex-1 items-center flex justify-center "><Button additionalClasses='text-nowrap rounded-lg' type='blue'>Check Answers</Button></div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                                  <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaCheckCircle/></Button>
                   <Button additionalClasses='text-red-400 text-3xl' type='transparent'><MdCancel /></Button>
                </div>
              </div>
              
                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                <div className="flex-1 items-center flex justify-center "><Button additionalClasses='text-nowrap rounded-lg' type='blue'>Check Answers</Button></div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                                   <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaCheckCircle/></Button>
                   <Button additionalClasses='text-red-400 text-3xl' type='transparent'><MdCancel /></Button>
                </div>
              </div>
              
                 <div className="flex items-center">
                <div className="flex-1 text-white text-sm flex gap-2 justify-center  items-center">
                  <Image alt='' className='w-8 h-8 rounded-full' src={img} width={60} height={60} />
                  Nickname
                </div>
                <div className="flex-1 flex gap-2  text-white text-xl justify-center items-center">12</div>
                <div className="flex-1 text-green-400  flex gap-2 justify-center items-center">Yes</div>
                  <div className="flex-1 items-center flex justify-center "><Button additionalClasses='text-nowrap rounded-lg' type='blue'>Check Answers</Button></div>
                <div className="flex-1 flex gap-1 justify-center items-center">
                  <Button additionalClasses='text-green-400 text-3xl' type='transparent'><FaCheckCircle/></Button>
                   <Button additionalClasses='text-red-400 text-3xl' type='transparent'><MdCancel /></Button>
                </div>
              </div>

          </div>
          
        </div>
        </div>
        
            <div className="flex flex-col gap-1">
        <p className='text-white text-2xl flex gap-2 items-center'><FaUsersCog /> Administration </p>

          <p>{JSON.stringify(document && document.data.requests)}</p>

           {document && <>
          
            <DataTable filterColumnName='nickname' columns={adminColumns} data={document.data.members.filter((item)=>item.isAdmin).map((item)=>({id:item.id, nickname:item.user.nickname, role: item.isCreator ? 'Creator' : item.isOwner ? 'Owner' : 'Admin', photoURL:item.user.photoURL, joiningDate:new Date(item.joiningDate), readBooks:item.user.booksInRead ? item.user.booksInRead.length :  0, readPages: 6}))} />
            
          </>}

          
        </div>
        
            <div className="flex flex-col gap-1">
          <p className='text-white text-2xl flex gap-2 items-center'><FaUsers /> Competition's Participants</p>

          
             {document && <>
          
            <DataTable filterColumnName='nickname' columns={columns} data={document.data.members.map((item)=>({id:item.id, nickname:item.user.nickname, email:item.user.email, photoURL:item.user.photoURL, joiningDate:new Date(item.joiningDate), readBooks:item.user.booksInRead ? item.user.booksInRead.length :  0, readPages: 6}))} />
            
          </>}

          
          </div>

      
        
</div>
  )
}

export default page