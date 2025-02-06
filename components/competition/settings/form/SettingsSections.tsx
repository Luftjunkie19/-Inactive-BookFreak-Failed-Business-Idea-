'use client';

import Button from 'components/buttons/Button';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import { FaPauseCircle, FaPencilAlt } from 'react-icons/fa';
import { GiTargetPrize } from 'react-icons/gi';
import { IoMdSwap } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';

type Props = {competitionId:string}

function SettingsSections({ competitionId }: Props) {
    const navigation=useRouter();
    
     const deleteCompetition = async () => {
      try {
       const deletedCompetition = await fetch('/api/supabase/competition/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: competitionId,
          }),
        });

        const fetched= await deletedCompetition.json();
        if(!fetched.data){
          toast.error('Something went wrong');
          throw new Error(fetched.error);
        }
        navigation.push('/search/competitions');
        toast.success('Successfully deleted the competition !');
      } catch (err) {
        console.error(err);
      }
    };


    

  return (
      <>
         <div id='second-form-section' className="flex flex-col gap-2">
                    <p className='text-white flex gap-2 text-2xl items-center'><GiTargetPrize  className='text-primary-color'/> Competition&apos;s Prize</p>
                    <p className='text-sm font-light max-w-2xl text-gray-400'>You can handle the competition&apos;s prize as you wish ? Want to swap the prize for a different one ? Do it here !</p>           
                   
                        <div className="flex overflow-x-auto gap-4 items-center">
                            <Button type="blue" additionalClasses='w-fit px-4 text-nowrap flex gap-2 items-center hover:bg-white hover:text-primary-color hover:scale-95 transition-all'>Swap Prize <IoMdSwap/> </Button>
                            <Button type="blue" additionalClasses='w-fit px-4 flex text-nowrap gap-2 items-center hover:bg-white hover:text-primary-color hover:scale-95 transition-all'>Change Details <FaPencilAlt /></Button>
                        </div>
                   
                    </div>
                     <div id='third-form-section' className="flex flex-col gap-2 pb-2">
                    <p  className='text-white flex gap-2 text-2xl items-center'><MdDelete   className='text-red-400'/> Competition&apos;s Deletion</p>
                    <p className='text-sm font-light max-w-2xl text-gray-400'>You can handle the competition&apos;s deletion as you wish ? Your situation changed or because of another reasons you have to delete or terminate the competition ? Feel free to do it.</p>           
                   
                        <div className="flex gap-4 items-center">
                            <Button type='transparent' additionalClasses='w-fit bg-yellow-600 hover:scale-95 transition-all hover:bg-yellow-400 px-4 flex gap-2 items-center'>Terminate <FaPauseCircle /> </Button>
                            <Button onClick={deleteCompetition} type="black" additionalClasses='w-fit px-4 hover:bg-red-600 hover:scale-95 transition-all flex gap-2 bg-red-400 items-center'>Delete <MdDelete /></Button>
                        </div>
                   
                    </div>
      </>
  )
}

export default SettingsSections