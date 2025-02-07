'use client';

import { User } from '@supabase/supabase-js';
import Button from 'components/buttons/Button';
import Post from 'components/elements/activity/Post';
import Club from 'components/elements/Club';
import Competition from 'components/elements/Competition';
import Recension from 'components/elements/recension/Recension';
import React, { useState } from 'react'

type Props = {document:{data:any | null, error:any | null}, user:User | null}

function TabsActivitySection({document, user}: Props) {
      const [activeBtn, setActiveBtn] = useState<string>();


  return (
  <div className="flex flex-col gap-4 w-full max-w-5xl">
                  <div className='flex gap-4 items-center'>
                <Button onClick={() => {
                  setActiveBtn('posts')
      }} type={activeBtn === 'posts' ? 'blue' : 'black'}>Posts</Button>
      <Button onClick={() => {
                  setActiveBtn('bookshelfs')
      }} type={activeBtn === 'bookshelfs' ? 'blue' : 'black'}>Bookshelfs</Button>
      <Button onClick={() => {
                  setActiveBtn('competitions')
      }} type={activeBtn === 'competitions' ? 'blue' : 'black'}>Competitions</Button>
      <Button onClick={() => {
                  setActiveBtn('clubs')
      }} type={activeBtn === 'clubs' ? 'blue' : 'black'}>Club</Button>
      <Button onClick={() => {
                  setActiveBtn('books')
      }} type={activeBtn === 'books' ? 'blue' : 'black'}>Books</Button>
      <Button onClick={() => {
                  setActiveBtn('reviews')
      }} type={activeBtn === 'reviews' ? 'blue' : 'black'}>Reviews</Button>    
              </div>
              
              <div className={`flex lg:gap-6 sm:gap-4 w-full max-h-[36rem] overflow-y-auto  ${activeBtn === 'posts' ? 'flex-col items-center' : ''} `}>
                {activeBtn && activeBtn === 'posts' && document &&  document.data && document.data.Post && document.data.Post.length > 0  && <>
                  {document.data.Post.map((item)=>(<Post key={item.id} type={'dark'} userImg={document.data.photoURL} username={document.data.nickname} isOwner={item.ownerId === user?.id} timePassed={''} content={item.body} images={item.images} postData={item} />))}                      
                </>}
                
                {activeBtn && activeBtn === 'competitions' && document.data.Member && document.data.Member.filter((item) => item.Competition).length > 0 &&
                <>
                  {document.data.Member.filter((item)=>item.Competition).map((item)=>(<Competition key={item.Competition.id} type={'dark'} competitionLogo={item.Competition.competitionLogo} competitionName={item.Competition.competitionName} membersAmount={item.Competition.members.length} comeptitionRemainingTime={new Date(item.Competition.endDate)} competitionId={item.Competition.id} members={[]} />))}                      
                </>
                }

                 {activeBtn && activeBtn === 'clubs' && document.data.Member && document.data.Member.filter((item) => item.Club).length > 0 &&
                <>
                  {document.data.Member.filter((item)=>item.Club).map((item)=>(<Club key={item.Club.id} type={'dark'} clubLogo={item.Club.clubLogo} clubName={item.Club.name} hasRequirements={item.Club.requirements.length > 0} membersAmount={item.Club.members.length} clubData={item.Club}  />))}                      
                </>
                } 

                {activeBtn && activeBtn === 'bookshelfs' && document.data.bookShelfs && document.data.bookShelfs.length > 0 && <>
                  {document.data.bookShelfs.map((item) => (<p key={item.id} className='text-white'>{JSON.stringify(item)}</p>))}
                </>}

                    {activeBtn && activeBtn === 'reviews' && document.data.recensions && document.data.recensions.length > 0 && <>
                  {document.data.recensions.map((item) => (<Recension key={item.id} userImg={item.user.photoURL} username={item.user.nickname} rate={item.rating} isOwner={item.userId === user?.id} content={item.comment} type={'white'} recensionId={item.id}/>))}
                </>}
            </div>
            </div>
  )
}

export default TabsActivitySection