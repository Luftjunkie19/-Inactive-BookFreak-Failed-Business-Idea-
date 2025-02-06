
import React from 'react'
import DashboardBar from 'components/Sidebars/left/competition/DashboardBar';
import SettingsContainer from 'components/competition/settings/form/SettingsContainer';
import { FaInfoCircle } from 'react-icons/fa';


function Page({params}:{params:{competitionId:string}}) {
    const { competitionId} = params;
    

  return (
      <div className='w-full flex'>
          <DashboardBar/>
          <div className="w-full overflow-y-auto sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] overflow-x-hidden px-4 py-2 flex flex-col gap-6">
              <div className="">
              <p className='text-white flex gap-2 text-2xl items-center'><FaInfoCircle className='text-primary-color'/> Competition Info</p>
              <p className='text-sm font-light text-gray-400'>Provide Changes to the competititon if something unexpected popped into your head</p>           
              </div>
      <SettingsContainer competitionId={competitionId}/>

          </div>
    </div>
  )
}

export default Page