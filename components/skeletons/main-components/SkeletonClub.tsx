import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@nextui-org/react'
import React from 'react'

type Props = {}

function SkeletonClub({}: Props) {
  return (
<Card className="max-w-64 w-full space-y-3 bg-dark-gray border-none justify-between flex flex-col gap-4 h-80  p-4" >
       
   <Skeleton className="rounded-lg">
        <div className="h-36 rounded-lg bg-default-300" />
              </Skeleton>

      <div className="flex flex-col gap-2">
          <Skeleton className="rounded-lg">
        <div className="h-4 rounded-sm w-full bg-default-300" />
        </Skeleton>
           <Skeleton className="rounded-lg w-5/6">
        <div className="h-4 rounded-sm w-full bg-default-300" />
      </Skeleton>
           <Skeleton className="rounded-lg w-4/5">
        <div className="h-3 rounded-sm w-full bg-default-300" />
        </Skeleton>
</div>

       <Skeleton className="rounded-sm">
        <div className="h-9 rounded-sm w-full bg-default-300" />
        </Skeleton>

    </Card>
  )
}

export default SkeletonClub