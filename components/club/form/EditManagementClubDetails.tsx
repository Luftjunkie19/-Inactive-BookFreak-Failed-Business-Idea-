'use client';

import { useQueryClient } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import { MdDelete } from 'react-icons/md';

type Props = {clubId:string}

function EditManagementClubDetails({ clubId}: Props) {
    const queryClient = useQueryClient();
        const navigation=useRouter();
    
    const deleteClub = async () => {
      try {
       const deletedCompetition = await fetch('/api/supabase/club/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: clubId,
          }),
        });

        const fetched= await deletedCompetition.json();
        if(!fetched.data){
          toast.error('Something went wrong');
          throw new Error(fetched.error);
        }
        navigation.push('/search/competitions');
          toast.success('Successfully deleted the competition !');
          await queryClient.invalidateQueries({ 'queryKey': ['club', clubId], 'type': 'all' });
      } catch (err) {
        console.error(err);
      }
    };



  return (
        <div id='second-form-section' className="flex flex-col gap-2">
                 <p className='text-white flex gap-2 text-2xl items-center'><MdDelete   className='text-red-400'/> Clubs&apos;s Deletion</p>
                 <p className='text-sm font-light max-w-2xl text-gray-400'>You can handle the clubs&apos;s deletion as you wish ? Your situation changed or because of another reasons you have to delete the club ? Feel free to do it.</p>           
                
                     <div className="flex gap-4 items-center">
                         <Button onClick={deleteClub} type='black' additionalClasses='w-fit px-4 flex gap-2 text-white bg-red-400 items-center hover:bg-red-500 hover:scale-95 transition-all'>Cancel <MdDelete /></Button>
                     </div>
                
                 </div>
  )
}

export default EditManagementClubDetails