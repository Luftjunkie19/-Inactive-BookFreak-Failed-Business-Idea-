import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { FaStar } from "react-icons/fa6";



function SkeletonBook() {
  return (
<Card className="max-w-60 w-full space-y-3 bg-dark-gray border-none justify-between flex flex-col gap-4 h-80  p-4" >
       
   <Skeleton className="rounded-lg">
        <div className="h-36 rounded-lg bg-default-300" />
              </Skeleton>

      <div className="flex flex-col gap-2">
           <Skeleton className="rounded-lg">
        <div className="h-4 rounded-sm bg-default-300" />
      </Skeleton>
           <Skeleton className="rounded-lg">
        <div className="h-4 rounded-sm w-4/5 bg-default-300" />
        </Skeleton>
          <Skeleton className="rounded-lg">
        <div className="h-4 rounded-sm w-3/5 bg-default-300" />
        </Skeleton>


        <div className="flex items-center gap-2 w-full">
            <Skeleton className="rounded-lg">
  <FaStar className="text-default-300 text-xl" />
          </Skeleton>
           <Skeleton className="rounded-lg">
        <div className="h-2 rounded-sm w-2/5 bg-default-300" />
        </Skeleton>
          
      
        </div>
        
</div>


    </Card>

  );
}

export default SkeletonBook;
