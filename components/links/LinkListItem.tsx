import Button from 'components/buttons/Button'
import Link from 'next/link'
import React from 'react'
import { FaInstagram } from 'react-icons/fa'
import { FaFacebook, FaPencil, FaSpotify, FaX, FaYoutube } from 'react-icons/fa6'
import { IoCloseCircle } from 'react-icons/io5'
import { TbWorldWww } from 'react-icons/tb'

type Props = {linkData:{socialMediaType:string,url:string,id:string, linkOwnerId:string}}

function LinkListItem({linkData}: Props) {
  return (
      <div className="flex gap-2 items-center p-2">
          <div className="flex gap-2 flex-1 items-center">
              {linkData.socialMediaType === 'facebook' ? <FaFacebook className='text-primary-color text-3xl'/> : linkData.socialMediaType === 'instagram' ? <FaInstagram/> : linkData.socialMediaType === 'youtube' ? <FaYoutube/> : linkData.socialMediaType === 'twitter' ? <FaX/> : linkData.socialMediaType === 'spotify' ? <FaSpotify className='text-green-400 text-3xl'/> : <TbWorldWww/> }
            
            <div className="flex flex-col">
                  <p className="text-white text-sm">{linkData.socialMediaType}</p>
                  <Link href={linkData.url} className=' text-gray-400 underline'>Link to {linkData.socialMediaType}</Link>
            </div>
          </div>
          <div className="flex gap-1 items-center">
            <Button type="transparent"><FaPencil className='text-primary-color text-xl'/></Button>
              <Button type="transparent"><IoCloseCircle className='text-red-400 text-xl' /></Button>
          </div>
        </div>
  )
}

export default LinkListItem