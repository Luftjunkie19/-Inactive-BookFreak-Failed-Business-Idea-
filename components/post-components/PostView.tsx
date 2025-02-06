'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import PostComments from 'components/post-components/post-elements/PostComments';
import { useAuthContext } from 'hooks/useAuthContext';
import React, { Suspense, useCallback, useEffect } from 'react'
import { FaComment, FaHeart, FaShare } from 'react-icons/fa6';
import PostEngagementBar from './post-elements/PostEngagementBar';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { BsThreeDots } from 'react-icons/bs';

type Props = {postId:string}

function PostView({postId}: Props) {
  const { user } = useAuthContext();


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
 const queryClient = useQueryClient();


    const { mutateAsync:viewPost } = useMutation({
    mutationKey: ['post', postId],
    mutationFn: async () => {
      if (data && user && !data.viewers.find((item) => item.viewerId === user.id)) {
        console.log(data);
       const res= await fetch(`/api/supabase/post/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            where: {
              id: postId,
            }, data: {
              viewers: {
                connectOrCreate: {
                  where: { 'id': `${postId}${user!.id}`, viewerId: user!.id }, create: {
                    'id': `${postId}${user!.id}`,
                    'viewerId': user!.id,
                    'dateOfView': new Date()
                  }
                }
              }
            }
          })
       })
        console.log(await res.json());
      }
    },
    onSuccess: async (data, variables, context)=> {
      await queryClient.invalidateQueries({'queryKey':['post', postId], 'exact':true, 'type':'all'})
    },
  });


  const updateViewersState = useCallback(async () => {
     if (user && data && !data.viewers.find((item) => item.viewerId === user.id)) {
       viewPost();
    }

  },[user, data, viewPost]);

  
  useEffect(() => {
    updateViewersState();
  }, [updateViewersState]);



    return (
        <>
          <div className='flex  w-full sm:h-[calc(100vh-3rem)] overflow-y-hidden lg:h-[calc(100vh-3.5rem)] flex-col gap-3'>
                <div className="flex gap-2 items-center justify-between bg-dark-gray max-h-14 min-h-12 h-full p-2">
               
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
                        <p className='text-gray-500 text-sm font-light'>{formatDistanceToNow(new Date(data.creationTime))} ago</p>
                        <Button type="transparent"><BsThreeDots className='text-primary-color text-lg'/></Button>
                  </div>
                      }
                    </Suspense>
                  
                  
                </div>
                
                <div className="  w-full text-white p-2 flex flex-col gap-2">
                  <Suspense fallback={<p>Loading...</p>}>
                    {data && 
                      <>
                     <p className='text-white'>{data.body}</p>
                  <div className="flex items-center flex-wrap gap-3">
                    {data.images && data.images.map((item) => (<Image  width={300} height={300} key={item.id} src={item.url} alt="" className="max-w-64 w-full h-64 rounded-lg object-cover" />))}
                  </div>  
                    </>
                }  
                  </Suspense>
                </div>
        
               <PostEngagementBar postId={postId} data={data} user={user}/>
              <Suspense fallback={<p>Loading...</p>}>
              {data && user &&
        <PostComments comments={data.comments} postId={postId as string}  userId={user!.id}/>
        }
              </Suspense>
              </div>
        
        </>
  )
}

export default PostView