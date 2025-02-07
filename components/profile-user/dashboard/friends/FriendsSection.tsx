'use client';
import { User } from '@supabase/supabase-js'
import Button from 'components/buttons/Button'
import FriendListItem from 'components/friend/FriendListItem'
import React from 'react'

type Props = { document: { data: any | null, error: any | null }, user: User | null}

function FriendsSection({document, user}: Props) {
  return (
 <div id='friends-section' className="flex sm:flex-col 2xl:flex-row gap-8 2xl:items-center">
      <div className="flex flex-col max-w-sm w-full gap-2">
        <p className="text-white text-xl">Your friends</p>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            {document && user &&  document.data && document.data.friends && (document.data.friends.length > 0 || document.data.friendsStarted.length > 0) ? [...document.data.friends, ...document.data.friendsStarted, document.data].map((item, index)=>(
    <>
                  {item.invitee && item.Invitor && 
                 <FriendListItem photoURL={item.inviteeId === user.id ? item.Invitor.photoURL : item.invitee.photoURL} nickname={item.inviteeId === user.id ? item.Invitor.nickname : item.invitee.nickname} id={item.inviteeId === user.id ? item.Invitor.id : item.invitee.id}/>
                  }
                 
                </>
              )) : <>
              <p>No data about your friends is available.</p>
              </>}
            </div>
      </div>
        </div>
             <div className="flex flex-col gap-2 max-w-xl w-full">
        <p className="text-white text-xl">Requests, that have been sent to you</p>
          <div className="bg-dark-gray max-w-xl w-full p-2 rounded-lg text-white">
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            {document && document.data.notifications.length > 0  ? document.data.notifications.filter((item)=>!item.isRead && item.type === 'friendshipRequest' || (item.isCompetitionRequest || item.isClubRequest)).map((item)=>(
  <div key={item.id} className="p-2 flex gap-2 items-center">

  <div className="flex flex-col flex-1 gap-1">
    <p>{item.sender.nickname}</p>
                  <p className='text-sm font-light'>{item.sender.ReadingProgress.filter((item)=>item.isBookFinished).length} Books</p>
  </div>
  <div className="flex gap-2 items-center">
    <Button additionalClasses='bg-green-400' type='black'>Accept</Button>
     <Button additionalClasses='bg-red-400' type='black'>Decline</Button>
  </div>
</div>

              )) : <>
              <p>No data about your friends is available.</p>
              </>}
              
      
             
             
            </div>
      </div>
      </div>
      </div>
  )
}

export default FriendsSection