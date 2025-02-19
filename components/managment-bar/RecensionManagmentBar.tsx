import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, Selection, SelectItem } from '@nextui-org/react';

import React, { useState } from 'react';
import { FaSortAmountDown } from 'react-icons/fa';
import { FaFilter } from 'react-icons/fa6';

type Props = {
  applyFilters: (filterLabel: any) => void,
  applySort: (filterLabel: any) => void,
  filters: {
    label: string;
    filterArray: Object;
  }[],
  sortings: {
    label: string;
    sortArray: {orderBy:Object},
  }[],
  filtersSelected: any[],
  sortSelected: any
}

function RecensionManagmentBar({ applyFilters, applySort, filters, sortings, filtersSelected, sortSelected }: Props) {
     

  return (
    <div className='flex gap-2 items-center overflow-x-auto'>
  <Popover>
 <PopoverTrigger asChild className=''>
   <div className="flex gap-2 cursor-pointer items-center text-nowrap text-white bg-dark-gray py-2 px-4 h-fit max-w-60 w-full justify-between rounded-lg border-2 border-primary-color"
   >
            <FaFilter />
            <p className='text-lg'>            Filters</p>

   </div>
 </PopoverTrigger>
 <PopoverContent className="max-w-72 min-w-60 w-full p-1 bg-dark-gray text-white" align="end" >
  <div className="w-full flex overflow-y-auto flex-col gap-2 max-h-52 h-full bg-dark-gray text-white">
        {filters.map((selectItem) => (<div key={selectItem.label} className='w-full cursor-pointer'>
             {selectItem.label}
           </div>))}
           </div>
 </PopoverContent>
</Popover>
     

  <Popover>
 <PopoverTrigger asChild className=''>
   <div className="flex gap-2 cursor-pointer items-center text-nowrap text-white bg-dark-gray py-2 px-4 h-fit max-w-60 w-full justify-between rounded-lg border-2 border-primary-color"
   >
            <FaSortAmountDown />
            <p className='text-lg'>
              
            Sorting
                     </p>
   </div>
 </PopoverTrigger>
 <PopoverContent className="max-w-72 min-w-60 w-full p-1 bg-dark-gray text-white"  align="start">
          <div className="w-full flex overflow-y-auto flex-col gap-2 max-h-52 h-full">
            {sortings.map((selectItem) => (<div key={selectItem.label} className='w-full cursor-pointer'>
             {selectItem.label}
           </div>))}
           </div>
 </PopoverContent>
</Popover>
     

    </div>
  );
}

export default RecensionManagmentBar;
