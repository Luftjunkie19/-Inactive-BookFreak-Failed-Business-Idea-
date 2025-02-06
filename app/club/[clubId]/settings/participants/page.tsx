
import ClubTableView from 'components/club/participants/ClubTableView';
import React from 'react'





function Page({params}:{params:{clubId:string}}) {
  const { clubId } = params;


  
  return (
    <div className='w-full flex gap-6 sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)]  flex-col overflow-y-auto p-3'>   
      <ClubTableView clubId={clubId} />
</div>
  )
}

export default Page