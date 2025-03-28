'use client';

import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Button from 'components/buttons/Button';

export type testProps= {
  testData: any,
  type: 'transparent' | 'blue' | 'black' | 'dark' | 'white'
}

function Test({ testData, type }: 
 testProps
) {
  return (
    <Link href={`/test/${testData.id}`} className={`max-w-64 h-72 w-full ${type === 'transparent' ? 'bg-transparent text-white' : type === 'blue' ? 'bg-primary-color text-white' : type === 'dark' ? 'bg-dark-gray text-white' : type === 'black' ? 'bg-transparent text-dark-gray' : 'bg-white text-dark-gray'} rounded-lg flex flex-col gap-1`}>
      <div className="w-full max-h-52 h-full relative top-0 left-0">
        <Image src={testData.id} width={256} height={208} alt='' className='w-full max-h-52 h-full object-cover rounded-t-lg' />
        <div className="absolute bottom-0 left-0 p-1 w-full text-xs flex justify-between items-center">
          <p className={`p-2 rounded-lg ${type === 'transparent' ? 'bg-primary-color text-white' : type === 'blue' ? 'bg-dark-gray text-white' : type === 'dark' ? 'bg-dark-gray text-white' : type === 'black' ? 'bg-primary-color text-white' : 'bg-white text-dark-gray'} `}>{testData.questions.length} Questions</p>

          <p className={`p-2 rounded-lg ${type === 'transparent' ? 'bg-primary-color text-white' : type === 'blue' ? 'bg-dark-gray text-white' : type === 'dark' ? 'bg-dark-gray text-white' : type === 'black' ? 'bg-primary-color text-white' : 'bg-white text-dark-gray'}`}>{testData.results.length} Plays</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-1">
        <p className=' line-clamp-1'>{testData.name}</p>
        <Button type={`${type === 'blue' ? 'white-blue' : type ==='white' ? 'dark-blue' : 'blue'}`} additionalClasses='w-full'>Show Test</Button>
      </div>
    </Link>
  )
}

export default Test