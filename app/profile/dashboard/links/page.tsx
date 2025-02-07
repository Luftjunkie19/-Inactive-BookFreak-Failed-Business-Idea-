import LinkViewDisplayContainer from 'components/profile-user/dashboard/links/LinkViewDisplayContainer'
import React from 'react'

type Props = {}

function Page({ }: Props) {

  return (
    <div className='w-full sm:h-[calc(100vh-3.5rem)] overflow-y-auto lg:h-[calc(100vh-4rem)] flex flex-col gap-3 p-2'>
      <div className="">
      <p className='text-white text-2xl'>Your Links</p>
       <p className='text-gray-400 text-sm'>In this page, you can link to any outside social-media you would like to.</p>
      </div>

      <LinkViewDisplayContainer/>
    

    </div>
  )
}

export default Page