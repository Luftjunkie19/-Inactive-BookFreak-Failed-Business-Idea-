import React from 'react'

import { FaInfoCircle } from 'react-icons/fa';

import { Club } from 'app/form/club/page';

import FormDisplayContainer from 'components/club/form/FormDisplayContainer';


export interface EditClub extends Club{
    currentLogo:string,
} 

export default function Page({params}:{params:{clubId:string}}) {
    const { clubId } = params;

    return (
           <div className="w-full overflow-y-auto sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] overflow-x-hidden px-4 py-2 flex flex-col gap-6">
              <div className="">
              <p className='text-white flex gap-2 text-2xl items-center'><FaInfoCircle className='text-primary-color'/> Club&apos;s Info</p>
              <p className='text-sm font-light text-gray-400'>Provide Changes to the club&apos;s information, if something unexpected popped into your head.</p>           
            </div>
           
        <FormDisplayContainer clubId={clubId} />
               
          
          </div>
    );
}