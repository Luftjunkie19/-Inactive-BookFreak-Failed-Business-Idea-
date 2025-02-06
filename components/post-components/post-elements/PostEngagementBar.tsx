import { User } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import React, { Suspense } from 'react'
import { FaComment, FaHeart, FaShare } from 'react-icons/fa6';

type Props = {
    data: any,
    postId: string, 
    user:User | null,
}

function PostEngagementBar({ data, postId, user }: Props) {
    
    const queryClient = useQueryClient();
    

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
            where:{
              id: postId
            },
         data: {
                    lovers:{'connectOrCreate':{
                      'where':{'id': `${postId}${user!.id}`},
                      create:{
                    'id': `${postId}${user!.id}`,
                    'loverId': user!.id,
                    'timeAdded': new Date(),
                      }
                    }}
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
              id: `${postId}`,
            },
            data: {
              lovers:{
                delete: {
                  id: `${postId}${user!.id}`
                },
              }
            }
          })
        });

         console.log(await res.json());
      }
    },
    onSuccess: async ()=> {
      await queryClient.invalidateQueries({'queryKey':['post', postId], 'exact':true, 'type':'all'})
    },
  });

    
  return (
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
  )
}

export default PostEngagementBar