import { Select, Selection, SelectItem } from '@nextui-org/react';

import React, { useState } from 'react';

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
     const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  return (
    <div className='flex gap-2 items-center overflow-x-auto'>
      <Select
        label="Filters"
        selectionMode="multiple"
        placeholder="Select filters"
        selectedKeys={selectedKeys}
        className="max-w-xs w-full"
        onChange={(e) => {
          console.log(e.target.value.split(","));
          setSelectedKeys(new Set(e.target.value.split(",")));
          applyFilters(e.target.value.split(",").filter((item)=>item.trim() === ''));
        }}
        
      >
        {filters.map((filter:{
    label: string;
    filterArray: (array: any[]) => any[];
}, i:number) => (
          <SelectItem key={filter.label} value={filter.label}>
            {filter.label}
          </SelectItem>
        ))}
      </Select>

       <Select
        label="Sorting"
        selectionMode='single'
        placeholder="Select Sorting"
        selectedKeys={new Set(sortSelected)}
        className="max-w-xs w-full"
         onChange={(e) => {
   console.log(e.target.value.split(",").filter((item)=>item.trim().length !== 0));
           applySort(e.target.value.split(",").filter((item)=>item.trim().length !== 0));
        }}
    
      >
        {sortings.map((animal, i ) => (
          <SelectItem key={animal.label}>
            {animal.label}
          </SelectItem>
        ))}
      </Select>
     

    </div>
  );
}

export default RecensionManagmentBar;
