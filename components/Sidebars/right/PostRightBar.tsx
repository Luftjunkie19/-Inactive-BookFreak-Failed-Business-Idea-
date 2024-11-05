import { QueryClient, useMutation } from '@tanstack/react-query'
import Button from 'components/buttons/Button'
import LabeledInput from 'components/input/LabeledInput'
import Comment from 'components/post-components/Comment'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaComment, FaHeart, FaPaperPlane } from 'react-icons/fa6'

type Props = { comments: any[], postId: string, queryClient:QueryClient, userId:string }

function PostRightBar({comments, postId, queryClient, userId}: Props) {
    const [comment, setComment] = useState<string>('');

    const { mutateAsync:writeComment } = useMutation({
        mutationKey: ['post', postId],
        mutationFn: async () => {
      const storedId=crypto.randomUUID();
           const res= await fetch(`/api/supabase/post/update`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                where: {
                  id: postId,
                }, data: {
                comments:{
                  connectOrCreate: {
                    where:{
                      postId,
                      ownerId:userId,
                      id:storedId,
                    },
                    'create':{'body':comment, 'ownerId':userId, id:storedId, time:new Date(),},
                  }
                },
                }
              })
           })
            console.log(await res.json());
         
         
        
        },
        onSuccess: async (data, variables, context) => {
            setComment('');
            await queryClient.invalidateQueries({'queryKey':['post', postId], 'exact':true, 'type':'all'});     
        }
           
        })
    


  return (
      <div className='sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] max-w-md flex flex-col justify-between w-full text-white bg-dark-gray'>
      
              <div className="flex w-full flex-col max-h-full h-full p-2 overflow-y-hidden gap-3">
                <p className='flex items-center gap-3'>Comments <FaComment className='text-primary-color text-lg' /></p>
                <div className="flex w-full flex-col max-h-full h-full p-2 overflow-y-auto gap-3">
                  {comments && comments.map((item) => (
                      
                      <Comment key={item.id} imageUrl={item.owner.photoURL} likesNumber={item.Lover.length} commentContent={item.body} commentNumber={0} username={item.owner.nickname} />
                  ))}
                </div>

              </div>

     

          <div className="bg-secondary-color border-t-primary-color border-x-primary-color border-t border-x-1 rounded-t-lg justify-between gap-2 w-full p-2 text-white flex items-center">
              <LabeledInput value={comment} onChange={(e) => setComment(e.target.value)} placeholder='Enter a message...' type='transparent' additionalClasses='text-sm' />

              <Button onClick={writeComment} type='transparent'><FaPaperPlane className='text-primary-color text-2xl'/></Button>
          </div>
    </div>
  )
}

export default PostRightBar