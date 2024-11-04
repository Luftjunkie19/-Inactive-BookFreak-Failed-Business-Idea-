'use client'
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import PostRightBar from 'components/Sidebars/right/PostRightBar';
import { formatDistanceToNow } from 'date-fns';
import { useAuthContext } from 'hooks/useAuthContext';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { Suspense } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { FaComment, FaHeart, FaShare } from 'react-icons/fa6';



function Page( ) {
  const { postId } = useParams();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetch('/api/supabase/post/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: postId })

    }).then((item) => item.json()),
  
  }
  );

  const { mutateAsync:likePost } = useMutation({
    mutationKey: ['post', postId],
    mutationFn: async () => {
      if (data && user && !data.lovers.find((item) => item.loverId === user.id)) {
       const res= await fetch(`/api/supabase/post/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            where: {
              id: postId,
            }, data: {
              lovers: {
                connectOrCreate: {
                  where: { 'id': `${postId}${user!.id}`, loverId: user!.id, postId }, create: {
                    'postLovedId': postId,
                    'id': `${postId}${user!.id}`,
                    'loverId': user!.id,
                    'timeAdded': new Date(),
                            
                  }
                }
              }
            }
          })
       })
        console.log(await res.json());
      } else {
       const res=  await fetch(`/api/supabase/post/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            where: {
              id: postId,
            }, data: {
              lovers: {
                disconnect: { 'id': `${postId}${user!.id}`, loverId: user!.id, postId, postLovedId:postId },
              
              }
            }
          })
        });

         console.log(await res.json());
      }
    },
    onSuccess: async (data, variables, context)=> {
      await queryClient.invalidateQueries({'queryKey':['post', postId], 'exact':true, 'type':'all'})
    },
  })


  return (
    <div className='w-full flex'>
      <div className='flex justify-between w-full sm:h-[calc(100vh-3rem)] overflow-y-hidden lg:h-[calc(100vh-3.5rem)] flex-col gap-3'>
        <div className="flex gap-2 items-center justify-between bg-dark-gray max-h-16 min-h-12 h-full p-2">
       
            <Suspense fallback={<p>Loading...</p>}>
              {data &&       
          <div className="flex items-center gap-2">
                  <Image className='w-8 h-8 rounded-full' width={60} height={60} alt='' src={data.owner.photoURL} />
                  <p className='text-white'>{data.owner.nickname}</p>
          </div>
              }
          </Suspense>
          
             <Suspense fallback={<p>Loading...</p>}>
              {data &&       
          <div className="flex items-center gap-2">
                <p className='text-white text-sm'>{formatDistanceToNow(new Date(data.creationTime))} ago</p>
                <Button type="transparent"><BsThreeDots className='text-primary-color text-lg'/></Button>
          </div>
              }
            </Suspense>
          
          
        </div>
        
        <div className="h-full w-full text-white p-2">
          <Suspense fallback={<p>Loading...</p>}>
            {data && 
              <>
             <p>{data.body}</p>
          <div className="flex items-center gap-3">
            {data.images.map((item) => (<p>{JSON.stringify(item)}</p>))}
          </div>  
            </>
        }  
          </Suspense>
        </div>

        <div className="flex gap-2 items-center justify-between bg-dark-gray max-h-16 min-h-12 h-full p-2">
           <Suspense fallback={<p>Loading...</p>}>
              {data &&       
          <div className="flex items-center gap-2">
                <Button onClick={likePost} additionalClasses='flex items-center gap-2' type='transparent'>
                  <FaHeart className={`${user  && !data.lovers.find((item)=>item.loverId === user!.id) ? 'text-white' : 'text-red-400'} text-2xl`} />
                  <p className='text-white'>{data.lovers.length}</p>
                </Button>
                <Button additionalClasses='flex items-center gap-2' type='transparent'>
                  <FaComment className='text-primary-color text-2xl' />
                  <p className='text-white'>{data.comments.length}</p>
              </Button>
          </div>
              }
          </Suspense>

           <Suspense fallback={<p>Loading...</p>}>
              {data &&       
              <Button additionalClasses='flex items-center gap-2' type='transparent'>
                   <FaShare className='text-white text-2xl' />
                  <p className='text-white'>Share</p>
         </Button>
              }
          </Suspense>
         
        
        </div>
      </div>
      <Suspense fallback={<p>Loading...</p>}>
      {data &&
<PostRightBar comments={data.comments}/>
}
      </Suspense>
    </div>
  )
}

export default Page