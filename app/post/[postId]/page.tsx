import Button from 'components/buttons/Button';
import PostView from 'components/post-components/PostView';
import PostRightBar from 'components/post-components/post-elements/PostComments';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import React, { Suspense } from 'react'
import { BsThreeDots } from 'react-icons/bs';
import { FaComment, FaHeart, FaShare } from 'react-icons/fa6';



function Page({ params }: { params: { postId: string } }) {
  const {postId} = params


  return (
    <div className='w-full h-full'>
      <PostView postId={postId} />
    </div>
  )
}

export default Page