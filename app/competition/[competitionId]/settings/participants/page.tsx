
import ParticipantsManagementBoard from 'components/competition/settings/ParticipantsManagementBoard';
import DashboardBar from 'components/Sidebars/left/competition/DashboardBar'
import React from 'react'

type Props = {}

function Page({params }: {params:{competitionId:string}}) {
  const { competitionId } = params;
 
  return (
    <div className='flex w-full'>
      <DashboardBar />
      <ParticipantsManagementBoard competitionId={competitionId} />
    
  </div>
  )
}

export default Page