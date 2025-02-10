'use client'
import { User } from '@supabase/supabase-js'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';
import { FaShare } from 'react-icons/fa';
import { FaFlag, FaHeart, FaPencil } from 'react-icons/fa6';

type Props = {document:{data:any | null, error: any | null}, user:User|null, testId:string}


function TestDataBar({ document, user, testId}: Props) {

    const navigate = useRouter();

      const queryClient = useQueryClient();
  const getUniqueUsers = (users: any[]) => {
    const uniqueUsers = users.filter((user, index, self) => {
      return self.findIndex((t) => t.userId === user.userId) === index;
    });
    return uniqueUsers;

}

    const { mutateAsync } = useMutation({
        mutationKey: ['test', testId],
        mutationFn: async () => {
            if (document && document.data && testId && user && !document.data.testLovers.find((item) => item.loverId === user!.id)) {
                console.log(testId, user);
      
                const res = await fetch('/api/supabase/lover/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            'id': `${testId}${user.id}`,
                            'loverId': user.id,
                            'testId': testId
                        }
                    }),
                });
                const { data, error } = await res.json();

                console.log(data, error);
                if (!data) {
                    toast.error('Something went wrong');
                    throw new Error('Something went wrong');
                }
                toast.success('You are now a test lover');
            } else {
                if (document && document.data && user) {
                    const res = await fetch('/api/supabase/lover/delete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ where: { id: `${testId}${user.id}` } }),
                    });

                    const { data, error } = await res.json();

                    if (!data && error) {
                        toast.error('Something went not correctly');
                        throw new Error('Something went wrong');
                    }

                    toast.success('You are not a test lover anymore.');
      
                }
            }
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ 'queryKey': ['test', testId], exact: true, 'type': 'all' });
        }
    });


    const moveToTest = () => {
        navigate.push(
          `/test/${document.data.id}/played?time=${new Date().getTime()}?attemptId=${crypto.randomUUID()}`
        );
      };
    
     
    
      const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      };


  return (
     <div className="flex bg-dark-gray gap-2 h-screen p-2 flex-col max-w-sm w-full text-white">
          <Image src={""} alt='' width={60} height={60} className='h-60 max-w-60 w-full p-2 object-cover rounded-2xl' />
            <p className='text-xl text-white'>{document.data.name}</p>
          <div className="flex justify-between items-center">
            <div className="">
            <div className='text-sm flex gap-2 items-center text-white'>
              <p>{document.data.results.length} Plays</p>
              <p>{getUniqueUsers(document.data.results).length} Players</p>
             </div>
            </div>
            <div className="flex gap-[0.125rem] text-xl items-center">
              <Button onClick={mutateAsync} type='transparent'>
                <FaHeart  className={`${user && document.data.testLovers.find((item)=>item.loverId === user.id) ? 'text-red-400 hover:scale-95 hover:text-white' : 'text-white hover:scale-95 hover:text-red-400'} transition-all `} />
              </Button>
              <Link href={`/form/test?editTestId=${testId} `}>
              <FaPencil className='text-white hover:text-primary-color transition-all hover:scale-95' />
              </Link>
                
         
                <Button onClick={copyLink} type='transparent'>
                <FaShare className='text-white hover:text-primary-color transition-all hover:scale-95' />
              </Button>
                <Button type='transparent'>
                <FaFlag className='text-white hover:text-primary-color transition-all hover:scale-95' />
              </Button>
</div>
          </div>
          <div className="flex gap-2 items-center">
                    <Button onClick={moveToTest} type='black' additionalClasses='bg-green-400'>Start Test</Button>
            <Button type='white'>Attempt</Button>
          </div>
        <p>{document.data.questions.length} Queries</p>
          <div className="flex flex-col gap-1">
            <p className='text-lg font-semibold'>Description</p>
            <div className='overflow-y-auto w-full max-h-36'>{document.data.description}</div>
          </div>
        </div>
  )
}

export default TestDataBar