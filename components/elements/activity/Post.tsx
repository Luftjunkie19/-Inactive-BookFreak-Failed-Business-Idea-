import Button from 'components/buttons/Button'
import Image from 'next/image'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import image from '../../../assets/Logo.png'
import { FaComment, FaHeart } from 'react-icons/fa6'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuthContext } from 'hooks/useAuthContext'
import Link from 'next/link'
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react'
import { EyeOff, PencilIcon, Trash } from 'lucide-react'
type Props = { type: 'dark-blue' | 'dark-white' | 'white-dark' | 'white' | 'white-blue',addClasses?:string, userImg: string, username:string, isOwner:boolean, timePassed:string | number, content:string, images?:any[], postData:any}

function Post({type, userImg, username, isOwner, content, timePassed, images, postData, addClasses}: Props) {
   const queryClient = useQueryClient();
   const { user } = useAuthContext();
  
  const { mutateAsync:likePost } = useMutation({
    mutationKey: ['post', postData.id],
    mutationFn: async () => {
       const res= await fetch(`/api/supabase/post/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            where: {
              id: postData.id,
            }, data: {
              lovers: {
                connectOrCreate: {
                  where: { 'id': `${postData.id}${user!.id}`, loverId: user!.id, postId:postData.id }, create: {
                    'postLovedId': postData.id,
                    'id': `${postData.id}${user!.id}`,
                    'loverId': user!.id,
                    'timeAdded': new Date(),
                            
                  }
                }
              }
            }
          })
       })
        console.log(await res.json());
     
      
    },
    onSuccess: async (data, variables, context)=> {
      await queryClient.invalidateQueries({'queryKey':['post', postData.id], 'exact':true, 'type':'all'})
    },
  });
  
  
  return (
    <div className={`flex max-w-3xl w-full flex-col justify-between gap-2 ${addClasses} ${type === 'dark-blue' || type === 'dark-white' ? 'bg-dark-gray text-white' : 'bg-white text-dark-gray'} rounded-lg `}>
      <div className="flex flex-col gap-2">
          <div className={`${type === 'dark-blue' ? 'bg-primary-color text-white' : type === 'dark-white' ? 'bg-white text-primary-color' : type === 'white-dark' ? 'bg-dark-gray text-white' : type === 'white-blue' ? 'bg-primary-color text-white': 'bg-white text-primary-color'} shadow-lg w-full rounded-t-lg flex justify-between items-center px-2 py-1`}>
                 <div className="flex gap-3 items-end w-full">
                  <Image className=' w-12 h-12 rounded-full' src={userImg} alt='' width={40} height={40} />
                  <div className="flex flex-col gap-1">    
                        <p className='line-clamp-1 text-sm'>{username} </p>
                        <p className=' line-clamp-1 text-xs'>{timePassed}</p>
                  </div>
              </div>

          {isOwner &&  
            <Dropdown classNames={{ 'content': 'bg-dark-gray border-primary-color border-2 text-white' }} >
      <DropdownTrigger  className='text-2xl'>
                <div className="cursor-pointer px-2 text-2xl">
                         <BsThreeDots className='cursor-pointer px-2 text-2xl'/>
              </div>

      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
                <DropdownItem key="copy"><div className="flex items-center gap-2 justify-between">
                Hide Post <EyeOff className='text-primary-color text-sm'/>
                </div> </DropdownItem>
                <DropdownItem key="edit">
                  <div className="flex items-center gap-2 justify-between">
                Edit Post <PencilIcon className='text-primary-color text-sm'/>
                </div> 
        </DropdownItem>
        <DropdownItem key="delete" className="text-danger" color="danger">
                  <div className="flex items-center gap-2 justify-between">
                    Delete Post
                    <Trash/>
      </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
                }
          </div>
      <Link className='flex flex-col gap-2 px-2 ' href={`/post/${postData.id}`} >
          <p className='line-clamp-6'>{content}</p>
                {postData.images && postData.images.length > 0 && <div className='grid grid-cols-3 gap-2 w-fit'>
                {postData.images.map((item, index)=>(<Image width={60} height={60} alt='' className='w-24 h-24 rounded-lg object-cover' src={item.url} key={index}/>))}
                </div>}
      </Link>
        
      </div>
        

          <div className={`flex justify-between shadow-large px-2 py-1 rounded-b-lg items-center w-full ${type === 'dark-blue' ? 'bg-primary-color text-white' : type === 'dark-white' ? 'bg-white text-primary-color' : type === 'white-dark' ? 'bg-dark-gray text-white' : type === 'white-blue' ? 'bg-primary-color text-white': 'bg-white text-dark-gray'}`}>
              <div className="flex items-center gap-3">
                  <Button onClick={likePost} type='transparent' additionalClasses="flex gap-2 text-2xl items-center">
                      <FaHeart className={`${type === 'dark-blue' ? ' text-white' : type === 'dark-white' ? ' text-dark-gray' : type === 'white-dark' || type === 'white-blue'  ? ' text-white' : ' text-dark-gray'}`} />
                        <p className={`text-sm ${type === 'dark-blue' ? ' text-white' : type === 'dark-white' ? ' text-dark-gray' : type === 'white-dark' || type === 'white-blue' ? ' text-white' : ' text-dark-gray'}`}>{postData.lovers.length}</p>
                  </Button>

                  <Button type='transparent' additionalClasses="flex gap-2 text-2xl items-center">
                      <FaComment className={`text-2xl ${type === 'dark-blue' ? 'text-dark-gray' :  type === 'white' || type === 'dark-white' || type === 'white-dark' ? 'text-primary-color' : 'text-dark-gray'}`} />
                        <p className={`text-sm ${type === 'dark-blue' ? ' text-white' : type === 'dark-white' ? ' text-dark-gray' : type === 'white-dark' || type === 'white-blue' ? ' text-white' : ' text-dark-gray'}`}>{postData.comments.length}</p>
                  </Button>
                  
            </div>
          </div>
    </div>
  )
}

export default Post