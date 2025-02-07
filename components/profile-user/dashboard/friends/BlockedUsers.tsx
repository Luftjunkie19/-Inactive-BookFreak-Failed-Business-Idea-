import { User } from '@supabase/supabase-js'
import Button from 'components/buttons/Button'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import React from 'react'
import { FaBan, FaUnlock } from 'react-icons/fa6'

type Props = {document:{data:any | null, error: any | null}, user:User | null}

function BlockedUsers({document, user}: Props) {
  return (
    <div id="blocked-users"  className="flex flex-col gap-2 my-4">
        <p className='text-white text-xl'>People you have blocked or suspended</p>
           <div className="bg-dark-gray max-w-xl w-full p-2 rounded-lg text-white">
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
              {document && document.data && document.data.blockerUser.length > 0 ?
               document.data.blockerUser.map((blockedUser)=>(<div key={blockedUser.id} className="p-2 flex gap-2 items-center">
                <Image alt='' src={blockedUser.blockedUser.photoURL} width={60} height={60} className='w-12 h-12 rounded-full' />
                <div className="flex flex-col flex-1 gap-1">
                  <p>{blockedUser.blockedUser.nickname}</p>
                  <p className='text-sm font-light'>{formatDistanceToNow(new Date(blockedUser.dateOfBlock))}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <Button  type='transparent'><FaBan className="text-xl text-red-400" /></Button>
                   <Button type='transparent'><FaUnlock className="text-primary-color text-lg" /></Button>
                </div>
              </div>)) : <>
              
              <p>For now you have not blocked anyone</p>
              
              </>
              }
            
             
            </div>
      </div>
      </div>
  )
}

export default BlockedUsers