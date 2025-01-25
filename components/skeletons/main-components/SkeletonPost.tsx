
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import React from 'react'

type Props = {}

function SkeletonPost({}: Props) {
  return (
      <Card className="max-w-2xl w-full space-y-3 justify-between flex flex-col gap-4 min-h-96 max-h-96 h-full p-4" >
       
   <Skeleton className="rounded-lg">
        <div className="h-10 rounded-lg bg-default-300" />
              </Skeleton>

      <div className="space-y-3">
        <Skeleton className="w-full rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
              </Skeleton>
               <Skeleton className="w-full rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
              </Skeleton>
               <Skeleton className="w-full rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
              </Skeleton>
               <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
              </Skeleton>
               <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200" />
              </Skeleton>
              
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
          </div>

    



           <Skeleton className="rounded-lg">
        <div className="h-10 rounded-lg bg-default-300" />
      </Skeleton>


    </Card>
  )
}

export default SkeletonPost