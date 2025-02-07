import useContvertData from 'hooks/useContvertData';
import React from 'react'
import { FaTrophy } from 'react-icons/fa';
import { FaBook } from 'react-icons/fa6'
import { MdReviews } from 'react-icons/md'

type Props = {document:{data:any | null, error: any | null}}

function BasicStatistics({ document }: Props) {
    
        const {getUniqueBooks}=useContvertData();

  return (
         <div id='basic-stats' className="max-w-5xl p-4 flex sm:flex-col xl:flex-row gap-4 justify-between items-center bg-dark-gray rounded-lg w-full">
                          <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 flex bg-primary-color justify-center items-center rounded-full">
                            <FaBook className='text-3xl text-white'/>
                          </div>
                           <div className="flex flex-col gap-1 text-white">
                            <p>Your books read this month</p>
                            <p className='text-2xl font-bold'>{getUniqueBooks(document.data.ReadingProgress.filter((item)=> new Date(item.finishTime) >= new Date(new Date().setDate(new Date().getDate() - 30)) && item.book.pages === document.data.ReadingProgress.filter((item)=> new Date(item.finishTime) >= new Date(new Date().setDate(new Date().getDate() - 30))).map((item)=> item.pagesRead).reduce((a, b) => a + b, 0))).length}</p>
                          </div>
                          </div>
                
                            <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 flex bg-secondary-color justify-center items-center rounded-full">
                            <MdReviews className='text-3xl text-primary-color'/>
                          </div>
                           <div className="flex flex-col gap-1 text-white">
                            <p>Reviews, you have shared</p>
                            <p className='text-2xl font-bold'>{document.data.recensions.length}</p>
                          </div>
                          </div>
                
                            <div className="flex gap-4 items-center">
                          <div className="w-16 h-16 flex bg-secondary-color justify-center items-center rounded-full">
                            <FaTrophy className='text-3xl text-yellow-600'/>
                          </div>
                           <div className="flex flex-col gap-1 text-white">
                            <p>Your books read this year</p>
                            <p className='text-2xl text-yellow-600 font-bold'>{getUniqueBooks(document.data.ReadingProgress.filter((item)=> new Date(item.finishTime) >= new Date(new Date().setDate(new Date().getDate() - 365)) && item.book.pages === document.data.ReadingProgress.filter((item)=> new Date(item.finishTime) >= new Date(new Date().setDate(new Date().getDate() - 365))).map((item)=> item.pagesRead).reduce((a, b) => a + b, 0))).length}</p>
                          </div>
                          </div>
                
                      </div>
  )
}

export default BasicStatistics