import Button from 'components/buttons/Button'
import Image, { StaticImageData } from 'next/image'
import React from 'react'
import { FaComment, FaHeart } from 'react-icons/fa6'

type Props = {imageUrl: StaticImageData | string, likesNumber:number, commentNumber:number, username:string, commentContent:string}

function Comment({imageUrl, likesNumber, commentNumber, commentContent, username}: Props) {
  return (
    <div className="flex gap-2 w-full">
                      <Image src={imageUrl} width={60} height={60} alt='' className='h-8 w-8 rounded-full' />
      <div className="flex flex-col max-w-md w-full gap-1"
      >
      <p className='text-sm'>{username}</p>
        <div className="flex  w-full flex-col bg-dark-gray rounded-lg">
          <div className="p-2">
              <p className=' line-clamp-4 overflow-y-auto'>{commentContent}</p>
          </div>
                          <div className="flex gap-2 items-center border-t border-t-primary-color">
                              <Button additionalClasses='flex items-center gap-2' type='transparent'>
                                  <FaHeart className='text-xl' />
                      <p>{likesNumber}</p>
                              </Button>
                              <Button additionalClasses='flex items-center gap-2' type='transparent'>
                                  <FaComment className='text-xl' />
                      <p>{commentNumber}</p>
                              </Button>
                     </div>
                      </div>
      </div>        
                     
                  </div>
  )
}

export default Comment