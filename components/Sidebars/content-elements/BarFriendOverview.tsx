import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import React from 'react'

type Props = {
    image: StaticImageData | string,
  username: string
  userId:string
}

function BarFriendOverview({username, image, userId}: Props) {
  return (
    <Link href={`/profile/${userId}`} className="flex group gap-3 items-center hover:scale-95 hover:bg-primary-color/20 transition-all duration-500  cursor-pointer px-2 py-1 rounded-lg w-full">
                  <Image className=' w-8 h-8 rounded-full' src={image} alt='' width={40} height={40} />
                  <p className='text-white transition-all  line-clamp-1 text-sm  '>{username} </p>
              </Link>
  )
}

export default BarFriendOverview