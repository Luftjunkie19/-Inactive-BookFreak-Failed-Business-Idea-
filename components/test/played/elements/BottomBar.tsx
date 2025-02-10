import React from 'react'

type Props = { userDocument: { data: any | null, error:any| null }, accquiredPoints: number, timeGone: number }

function BottomBar({
    userDocument, accquiredPoints,timeGone
}: Props) {
  return (
     <div className="bg-primary-color text-white flex w-full justify-between p-4 items-center">
      { userDocument && userDocument.data &&
<div className="flex gap-2 items-center">
 {/* <Image className='w-8 h-8 rounded-full' src={userDocument.data.photoURL} alt="" width={60} height={60}/> */}
 <p className="text-white">{userDocument.data.nickname}</p>
</div>
}
    
        <p className='text-white text-lg font-semibold'>{Math.floor(timeGone / 60) > 10 ? Math.floor(timeGone / 60) : `0${Math.floor(timeGone / 60)}`}:{timeGone >= 10 ? timeGone : `0${timeGone}`}</p>
        
        
        <p className='text-white flex gap-2 items-center'>Points gained <span className=' text-lg font-semibold'>{accquiredPoints}</span></p>
      </div>
  )
}

export default BottomBar