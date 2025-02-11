'use client';
import React, { useCallback, useState } from 'react'
import GridDisplay from './GridDisplay';
import FilterBar from 'components/Sidebars/right/FilterBar';
import { BookProps } from 'components/elements/Book';
import LabeledInput from 'components/input/LabeledInput';
import { FaSearch } from 'react-icons/fa';
import { Checkbox, CheckboxGroup, Radio, RadioGroup } from '@nextui-org/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';

type Props<T> = {
    initialSearchParamsState: { skip: number, take: number, where?: any, include?: any, orderBy?: any },
    filterOptions: { filter: any, label: string }[],
    sortingOptions: { label: string, sort: any }[],
    queryKey:string
    apiPath: string,
    renderComponent: (item)=>JSX.Element
}

function SearchContainer
 <T>({ initialSearchParamsState, filterOptions, queryKey, sortingOptions, apiPath,renderComponent

}: Props<T>){
    
      const { data: orderedDocuments, error, isFetching, isLoading } = useQuery({
    queryKey: [queryKey],
    'queryFn': async () => {
      const fetchBooks = await fetch(apiPath, {
        method: 'POST',
        headers: {
        },
        body: JSON.stringify(userSearchParams)
      });

      const fetchedBooks = await fetchBooks.json();

      return fetchedBooks;
    }
  })
 

    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const router = useRouter();
    const [userSearchParams, setUserSearchParams] = useState<{ skip: number, take: number, where?: any, include?: any, orderBy?: any }>(initialSearchParamsState);


        const createQueryString = useCallback(
        (name: string, value: string) => {
          const params = new URLSearchParams(searchParams.toString())
          params.set(name, value)
     
          return params.toString()
        },
        [searchParams]
      )

  return (
 <div className='w-full h-full flex'>
    
          <GridDisplay<T>
              orderedDocuments={orderedDocuments} renderElement={renderComponent}
              userSearchParams={userSearchParams}
              setUserSearchParams={setUserSearchParams} queryKeyName={queryKey}/>
          
      <FilterBar searchBarContent={<div className="flex justify-between items-center gap-2">
        <LabeledInput onChange={async (e) => {
          if (e.target.value.trim() === '') {
            setUserSearchParams({ ...userSearchParams, where: { title: undefined } }); 
          }

          setUserSearchParams({ ...userSearchParams, where: { title:{contains:e.target.value} } });
// Cancel all queries
await queryClient.cancelQueries()

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: [queryKey], type: 'all' })

          router.replace(`/search/books${e.target.value.trim().length === 0 ? '' : `?${createQueryString('title', e.target.value)}`}`);
      }} additionalClasses='text-base' placeholder='Search....' type='transparent' />
        <FaSearch  className='text-white cursor-pointer hover:text-primary-color hover:rotate-[360deg] transition-all text-xl'/>
      </div>} filterBarContent={<div>
         <CheckboxGroup
          onValueChange={async (value: string[]) => {
            let arrayOfFilters: { genre: string }[] = [];

            if (value.length === 0) {
                setUserSearchParams({ ...userSearchParams, where: {...userSearchParams.where, 'OR':undefined}  });
            }

            console.log(value);
            value.map((item) => {
              const foundItem = filterOptions.find((catObj) => catObj.label === item);
              console.log(foundItem);
              if (foundItem) {
                arrayOfFilters.push(foundItem.filter);
              }
            })

            setUserSearchParams({ ...userSearchParams, where: { OR: arrayOfFilters } });

            // Cancel all queries
await queryClient.cancelQueries()

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: [queryKey], type: 'all' })

              }}
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {filterOptions.map((filter) => (
                <Checkbox key={filter.label} value={filter.label} classNames={{label:'text-xs text-white'}}>{filter.label}</Checkbox>
              ))}
    </CheckboxGroup>

        </div>} sortingBarContent={<div>
            <RadioGroup
            onValueChange={async (value) => {
              
              setUserSearchParams({ ...userSearchParams, orderBy: sortingOptions.find((item) => item.label === value)!.sort || undefined })
            // Cancel all queries
await queryClient.cancelQueries()

// Remove all inactive queries that begin with `posts` in the key
queryClient.removeQueries({ queryKey: [queryKey], type: 'inactive' })

// Refetch all active queries
await queryClient.refetchQueries({ type: 'active' })

// Refetch all active queries that begin with `posts` in the key
await queryClient.refetchQueries({ queryKey: [queryKey], type: 'active' })
            }
           
            }
              orientation="horizontal"
              classNames={{wrapper:'max-h-96 overflow-y-auto h-full flex gap-2 flex-wrap', label:"text-white text-2xl"}}
            >
              {sortingOptions.map((sort) => (
                <Radio key={sort.label} value={sort.label} classNames={{label:'text-xs text-white'}}>{sort.label}</Radio>
              ))}
    </RadioGroup>
      </div  >} />
    </div>
  )
}

export default SearchContainer