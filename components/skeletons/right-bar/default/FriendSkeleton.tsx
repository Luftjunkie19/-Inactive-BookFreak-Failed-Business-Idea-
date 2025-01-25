import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

type Props = {}

function FriendSkeleton({}: Props) {
  return (
      <div className='flex items-center gap-2'>
           <Skeleton className="rounded-full h-8 w-8">
        <div className="h-full w-full rounded-full bg-default-300" />
          </Skeleton>
          
          <div className="flex flex-col w-full max-w-52 gap-1">
           <Skeleton className="rounded-full max-w-44 w-full h-2">
        <div className="h-full w-full rounded-full bg-default-300" />
              </Skeleton>
              
                      <Skeleton className="rounded-full max-w-36 w-full h-2">
        <div className="h-full w-full rounded-full bg-default-300" />
        </Skeleton>
        
          </div>

</div>
  )
}

export default FriendSkeleton