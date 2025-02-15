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
import { IoStatsChart } from 'react-icons/io5'
import toast from 'react-hot-toast'
type Props = {
  type: 'dark-blue' | 'dark-white' | 'white-dark' | 'white' | 'white-blue' | 'dark',  
  addClasses?: string,
  userImg: string,
  username: string,
  isOwner: boolean,
  timePassed: string | number,
  content: string,
  images?: any[],
  postData: any
}

function Post({type, userImg, username, isOwner, content, timePassed, images, postData, addClasses}: Props) {
   const queryClient = useQueryClient();
   const { user } = useAuthContext();
  
  const { mutateAsync:likePost } = useMutation({
    mutationKey: ['post', postData.id],
    mutationFn: async () => {

      if (postData.lovers.some(item => item.loverId === user?.id)) {
       await fetch(`/api/supabase/lover/delete`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            where: {
             'id': `${postData.id}${user!.id}`
            }
          })
       });
        return;
      }

       const res= await fetch(`/api/supabase/post/update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            where: {
              id: postData.id,
            }, data: {
              lovers:{'connectOrCreate':{
                'where':{'id': `${postData.id}${user!.id}`},
                create:{
              'id': `${postData.id}${user!.id}`,
              'loverId': user!.id,
              'timeAdded': new Date(),
                }
              }}
            }
          })
       })
        console.log(await res.json());
     
      
    },
    onSuccess: async (data, variables, context)=> {
      await queryClient.invalidateQueries({ 'queryKey': ['post', postData.id], 'exact': true, 'type': 'all' });
      await queryClient.invalidateQueries({ 'queryKey': ['swiperPosts'], 'type': 'all' });
        toast.success('Successfully liked the post !');
    }
  });

  const { mutateAsync:
    deletePost
   } = useMutation({
    mutationKey: ['post', postData.id],
    mutationFn: async () => {
      const res = await fetch(`/api/supabase/post/delete
        `, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            where: {
              id: postData.id,
            },
          })
       })
     
    },
    onSuccess: async (data, variables, context)=> {
      await queryClient.invalidateQueries({ 'queryKey': ['post', postData.id], 'exact': true, 'type': 'all' });
      await queryClient.invalidateQueries({ 'queryKey': ['swiperPosts'], 'type': 'all' });
      toast.success('Successfully deleted the post !');
    }
  });
  
  
  return (
    <div className={`flex max-w-3xl w-full flex-col justify-between ${addClasses} ${type === 'dark-blue' || type === 'dark-white' ? 'bg-dark-gray text-white' : 'bg-white text-dark-gray'} rounded-lg `}>
      <div className="flex flex-col">
        <div className={`${type === 'dark-blue' ? 'bg-primary-color text-white' : type === 'dark-white' ? 'bg-white text-primary-color' : type === 'white-dark' ? 'bg-dark-gray text-white' : type === 'white-blue' ? 'bg-primary-color text-white' : type === 'dark' ? 'bg-dark-gray text-white' : 'bg-white text-primary-color'
        }          
            
            shadow-lg w-full rounded-t-lg flex justify-between items-center p-2`}>
                 <div className="flex gap-3  w-full">
                  <Image className=' w-8 h-8 rounded-full' src={userImg} alt='' width={40} height={40} />
                  <div className="flex items-center gap-1">    
                        <p className='line-clamp-1 text-sm'>{username} </p>
                        <p className=' line-clamp-1 text-xs'>{timePassed}</p>
                  </div>
              </div>

          {isOwner &&  
            <Dropdown classNames={{ 'content': 'bg-dark-gray text-lg border-primary-color border-2 text-white' }} >
      <DropdownTrigger  className='text-lg'>
                <div className="cursor-pointer px-2 text-lg">
                         <BsThreeDots className='cursor-pointer text-lg'/>
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
        <DropdownItem
                  onClick={ async () => {
                    await deletePost();
                  }}
                  key="delete" className="text-danger" color="danger">
                  <div className="flex items-center gap-2 justify-between">
                    Delete Post
                    <Trash/>
      </div>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
                }
          </div>
      <Link className={`flex flex-col gap-2 p-2 min-h-52 max-h-96 h-full ${type === 'dark' ? 'bg-dark-gray text-white' : ''}`} href={`/post/${postData.id}`} >
          <p className='line-clamp-6'>{content}</p>
                {postData.images && postData.images.length > 0 && <div className='grid grid-cols-3 gap-2 w-fit'>
                {postData.images.map((item, index)=>(<Image width={60} height={60} alt='' className='w-24 h-24 rounded-lg object-cover' src={item.url} key={index}/>))}
                </div>}
      </Link>
        
      </div>
        

      <div className={`flex justify-between shadow-large px-2 py-1 rounded-b-lg items-center w-full ${type === 'dark-blue' ? 'bg-primary-color text-white' : type === 'dark-white' ? 'bg-white text-primary-color' : type === 'white-dark' ? 'bg-dark-gray text-white' : type === 'white-blue' ? 'bg-primary-color text-white' : type === 'dark' ? 'bg-dark-gray text-gray-500' :
        'bg-white text-dark-gray'
        }`}>
              <div className="flex items-center gap-3">
                  <Button onClick={likePost} type='transparent' additionalClasses="flex gap-2 text-2xl items-center">
            <FaHeart className={`${postData.lovers.some(item => item.loverId === user?.id) ? 'text-red-600 hover:text-dark-gray hover:scale-95 transition-all' : 'hover:text-red-600 hover:scale-95 transition-all'} ${type === 'dark-blue' ? ' text-white' : type === 'dark-white' ? ' text-dark-gray' : type === 'white-dark' || type === 'white-blue' ? ' text-white' : 
                        type === 'dark' ? ' text-white' : ' text-dark-gray'
                        }`} />
            <p className={`text-sm ${type === 'dark-blue' ? ' text-white' : type === 'dark-white' ? ' text-dark-gray' : type === 'white-dark' || type === 'white-blue' ? ' text-white' : type === 'dark' ? 'text-white' : ' text-dark-gray'
              
              }`}>{postData.lovers.length}</p>
                  </Button>

                  <Button type='transparent' additionalClasses="flex gap-2 text-2xl items-center">
            <FaComment className={`text-2xl  hover:scale-95 transition-all ${type === 'dark-blue' ? 'text-dark-gray' : type === 'white' || type === 'dark-white' || type === 'white-dark' ? 'text-primary-color' :
              type === 'dark' ? 'text-white hover:text-primary-color' : 'text-dark-gray'
                        }`} />
            <p className={`text-sm ${type === 'dark-blue' ? ' text-white' : type === 'dark-white' ? ' text-dark-gray' : type === 'white-dark' || type === 'white-blue' ? ' text-white' : type === 'dark' ? 'text-white' : ' text-dark-gray'
              
              }`}>{postData.comments.length}</p>
          </Button>
          
          <div className="flex 
          text-sm
          items-center cursor-pointer group hover:text-primary-color transition-all gap-1"><IoStatsChart className='text-primary-color text-3xl group-hover:rounded-full transition-all group-hover:bg-secondary-color/30 p-1 group-hover:text-primary-color 
       group-hover:scale-95
          ' /> {postData.viewers.length}</div>
                  
            </div>
          </div>
    </div>
  )
}

export default Post