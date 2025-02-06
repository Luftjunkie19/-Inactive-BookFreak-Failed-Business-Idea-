
import {  useMutation, useQueryClient } from '@tanstack/react-query'
import Button from 'components/buttons/Button'
import LabeledInput from 'components/input/LabeledInput'
import Comment from 'components/post-components/post-elements/Comment'
import Image from 'next/image'
import React, { useState } from 'react'
import { FaComment, FaHeart, FaPaperPlane } from 'react-icons/fa6'

type Props = { comments: any[], postId: string, userId:string }

function PostComments({comments, postId, userId}: Props) {
  const [comment, setComment] = useState<string>('');
  
   const queryClient = useQueryClient();

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
      <div className=' max-w-2xl flex flex-col h-full justify-between w-full text-white'>
    
              <div className="flex w-full flex-col overflow-y-hidden gap-3">
        <p className='flex text-xl px-2 items-center gap-3'>Comments <FaComment className='text-primary-color text-xl' /></p>
        
                <div className="flex  w-full flex-col  p-2 overflow-y-auto gap-3">
                  {comments && comments.map((item) => (
                      
                      <Comment key={item.id} imageUrl={item.owner.photoURL} likesNumber={item.Lover.length} commentContent={item.body} commentNumber={0} username={item.owner.nickname} />
                  ))}
                </div>

              </div>

       <div className=" flex-col gap-2 w-full p-2 text-white flex max-w-2xl ">
             <textarea onChange={(e) => setComment(e.target.value)} value={comment} placeholder='Write a comment....' className='max-w-2xl p-2 w-full overflow-y-auto bg-dark-gray border border-primary-color resize-none scrollbar-hide outline-none rounded-lg lg:h-44 sm:h-14'></textarea>

              <Button onClick={writeComment} type='dark-blue' additionalClasses=' flex hover:bg-primary-color hover:text-white transition-all hover:scale-95 max-w-fit self-end px-6 items-center gap-2'><FaPaperPlane className='text-2xl'/>Send</Button>
          </div>

        
    </div>
  )
}

export default PostComments