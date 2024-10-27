'use client';

import {
  BiSolidBook,
  BiSolidBookHeart,
  BiSolidLike,
} from 'react-icons/bi';
import {
  FaBook,
  FaBookOpen,
  FaBookReader,
  FaCommentAlt,
  FaPlusCircle,
  FaStar,
  FaTrophy,
  FaUserAltSlash,
  FaUserFriends,
} from 'react-icons/fa';
import {
  FaBookBookmark,
  FaGear,
  FaGears,
  FaHeart,
  FaLock,
  FaPencil,
  FaUserGear,
} from 'react-icons/fa6';
import {
  IoPieChartSharp,
  IoShareSocialSharp,
} from 'react-icons/io5';
import { useSelector } from 'react-redux';

import Link from 'next/link';


import translations from '../../../assets/translations/ProfileTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useLogout } from '../../../hooks/useLogout';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BsFillPersonPlusFill, BsThreeDots } from 'react-icons/bs';
import { IoIosChatbubbles, IoMdBookmarks, IoMdFemale } from 'react-icons/io';
import { MdBlock, MdPersonAdd, MdReviews, MdSpaceDashboard } from 'react-icons/md';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import Slide from 'components/home/swipers/base-swiper/Slide';
import Book from 'components/elements/Book';
import { SwiperSlide } from 'swiper/react';
import Button from 'components/buttons/Button';
import { ButtonGroup, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react';
import Post from 'components/elements/activity/Post';
import { useQuery } from '@tanstack/react-query';
import { LucideMessageCircle } from 'lucide-react';
import { useCallback, useState } from 'react';
import Competition from 'components/elements/Competition';
import Club from 'components/elements/Club';
import { formatDistance, formatDistanceToNowStrict } from 'date-fns';
import Recension from 'components/elements/recension/Recension';
import toast from 'react-hot-toast';
import { suspendUser } from 'lib/supabase/block-functionality-server-functions/BlockSuspendFunctions';


function Profile({params}:{params:{userId:string}}) {
  const { userId } = params;
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

    const navigate = useRouter();
  const [activeBtn, setActiveBtn] = useState<string>();
  const { user } = useAuthContext();





    const { data:chatData, isFetched } = useQuery({
    queryKey: ['userChat'],
    queryFn: () => fetch('/api/supabase/chat/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: {
          AND: [
            {
              users: {
                every: {
                  id: {
                    in: [userId, user!.id]
                  }
                }
              }
            },
          ]
        },
        include: {
          messages: true,
          users: true,
        }
      }),
    }).then((item)=>item.json())
  });



  const createOrRedirectNotExistingChat = useCallback(async () => {
    if (user && (!chatData || !chatData.data)) {
        try { 
      const getAllMentionedUsers = await fetch('/api/supabase/user/getAll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
           where: { 
              OR:[{id:user.id}, {id:userId}],
  },
        }),
      });

      const fetchedAllUsers = await getAllMentionedUsers.json();

      console.log(fetchedAllUsers);

        const response = await fetch('/api/supabase/chat/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              dateOfCreation: new Date(),
              id: crypto.randomUUID(),
              users:{
                connect:fetchedAllUsers.data.map((item)=>({id:item.id})),
              },
           },
          })
        });

      const fetchedResponse = await response.json();
      
      console.log(fetchedResponse);
   
navigate.replace(`/chat/${fetchedResponse.data.id}`); 
        
  

      } catch (err) {
        console.log(err);
}
    }else{
      navigate.replace(`/chat/${chatData.data.id}`); 
    }
  
  }, [user, chatData])



  const { data: document } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userId, include: {
          recensions: { include: { user: true, book: true } },
          notifications: true,
          'BookLover': true,
          'Comment': true,
          'Result': true,
          'addedBooks': true,
          'bookShelfs': true,
          'booksInRead': true,
          friendsStarted: true,
          friends: true,
          'Post': { include: { lovers: true, comments: true, hashtags: true } },
          Member: {
            include: {
                        
              'Club': {
                include: {
                  'members': true,
                  requirements: true,
                },
              },
              Competition: {
                include: {
                  'members': true,
                  rules: true,
                }
              }
            }
          },
        }
      })
    }).then((res) => res.json())
  });



  const inviteUserToFriends = async () => {
    try { 

      if (document.data.notifications.find((item) => item.sentBy === user!.id && item.directedTo === userId && item.type === 'friendshipRequest')) {
          toast.error('You have already sent an invitation 🙄');
        return;
      }


    const response = await fetch('/api/supabase/notification/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: {
          directedTo: userId,
          type: 'friendshipRequest',
          receivedAt: new Date(),
          sentBy:user!.id,
        }
      }),
    });

    const fetchedRes = await response.json();
    console.log(fetchedRes);

      toast.success('Request successfully sent !');
      } catch (err) {
      toast.error('Something went wrong 🙄');
      console.log(err);
}
  }






  return (
    <div className={`min-h-screen w-full h-full`}>
   {document && document.data && 
        <>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col w-full sm:gap-14 lg:gap-0">
          <div className='bg-dark-gray min-h-52 relative top-0 left-0'>
          <div className="flex gap-8 items-center absolute -bottom-12 left-4 m-2">
            <Image src={document.data.photoURL} alt='' width={60} height={60} className='w-48 h-48 rounded-full' />
              <div className="flex flex-col gap-2">
                <div className="flex gap-2 items-center">
                  <p className='text-white text-3xl font-semibold'>{document.data.nickname}</p>
                    <p className='text-gray-400  text-sm self-end'>{formatDistanceToNowStrict(new Date(document.data.dateOfJoin))} ago</p>
                </div>
              <p className='flex gap-2 items-center'>
                <FaUserFriends className='text-primary-color text-2xl' />
                    <p className='text-white'>{[...document.data.friendsStarted, ...document.data.friends].length} Friends</p>
              </p>
            </div>
            </div>
            
      </div>  
            <div className="flex items-center gap-4 p-2 self-end">{document && user &&
              document.data.id !== user.id && 
              <>
              <Button disableState={document.data.notifications.find((item)=>item.sentBy === user.id && item.directedTo === userId && item.type==='friendshipRequest')} onClick={inviteUserToFriends} type={document.data.notifications.find((item)=>item.sentBy === user.id && item.directedTo === userId && item.type==='friendshipRequest') ? 'dark-blue' : 'blue'} additionalClasses='flex gap-2 items-center'>
                Invite Friend <MdPersonAdd />
              </Button>
              <Button onClick={createOrRedirectNotExistingChat} type={'white-blue'} additionalClasses='flex gap-2 items-center'>
                Message <LucideMessageCircle />
              </Button>
              <Dropdown placement='bottom-end' classNames={{
                'content': 'bg-dark-gray border-2 border-primary-color',

      }}>
      <DropdownTrigger  className='text-white cursor-pointer' as='div' >
<p className="flex items-center gap-2">More Action <BsThreeDots className='text-primary-color text-2xl'/></p>
      </DropdownTrigger>
                <DropdownMenu popover='auto'  variant='faded' aria-label="Dropdown menu with description">
                  <DropdownItem onClick={async () => {
                    try {
                      const result= await suspendUser('block', user!.id, userId);
                      if (!result) {
                        throw new Error('Something went wrong');
                      }
                      toast.success(`User blocked successfully !`);

                    } catch (err) {
                       toast.error(JSON.stringify(err));

                     }
                  }} classNames={{base:"group"}} endContent={<FaLock className='text-red-400'/>} description={<p>Disable user to interact with you </p>} >
            <p className="text-white group-hover:text-dark-gray transition-all">Block</p>
          </DropdownItem>
                  <DropdownItem onClick={async () => {
                    try {
                      const result= await suspendUser('suspend', user!.id, userId);
                      if (!result) {
                        throw new Error('Something went wrong');
                      }
                      toast.success(`User suspended successfully !`);

                    } catch (err) {
                       toast.error(JSON.stringify(err));

                     }
                  }} description={<p>Disable user to see your content </p>} classNames={{
          'base':'text-white hover:bg-secondary-color flex items-center gap-2 group'
        }}
                    endContent={<MdBlock className='text-red-400 text-2xl' />}
          >
             <p className="text-white group-hover:text-dark-gray transition-all">Suspend</p>
          </DropdownItem>
         
      </DropdownMenu>
    </Dropdown>
              </>
              }

              {document && user &&
              document.data.id === user.id && <Button onClick={()=>navigate.push('/profile/dashboard')} type={'blue'} additionalClasses='flex gap-2 px-2 items-center'>Change <FaPencil/></Button> }


            </div>
            
       </div>

          
          <div className="flex sm:flex-col 2xl:flex-row w-full gap-6 px-2 py-4">
            <div className="flex sm:max-w-5xl 2xl:max-w-md w-full sm:flex-col xl:flex-row 2xl:flex-col gap-4">
               <div className="flex flex-col gap-2 rounded-lg border-2 p-2 border-primary-color bg-dark-gray w-full">
              <p className='text-xl text-white font-semibold'>Details</p>
                <div className="max-h-40 h-full text-white overflow-y-auto">{document.data.description}</div>
              <div className="flex gap-2 text-white items-center">
                <IoMdFemale className='text-2xl' />
                <p>She/her</p>
              </div>
              <div className="flex gap-3 text-white items-center">
                <BiSolidBookHeart className='text-2xl' />
                <div className="flex flex-col ">
                  <p className='font-light'>Favourite Book</p>
                  <p>Book Title</p>
                </div>
              </div>
                  <div className="flex gap-3 text-white items-center">
                <FaBookOpen  className='text-2xl' />
         <div className="flex flex-col ">
                  <p className='font-light'>Currently Reading</p>
                  <p>Book Title</p>
                </div>
              </div>
              </div>
              
              <div className="flex flex-col gap-2 max-w-md rounded-lg border-2 p-2 border-primary-color bg-dark-gray w-full">
                <p className='text-xl text-white font-semibold'>Statistics</p>
                <div className="flex flex-col p-1 gap-6">
              <div className="flex gap-2 text-white items-center">
                <FaTrophy className='text-2xl text-yellow-600' />
                <p>2 Competitions won</p>
              </div>
              <div className="flex gap-3 text-white items-center">
                <FaBookReader className='text-2xl text-primary-color' />
               <p>12 Books Read this year</p>
              </div>
                  <div className="flex gap-3 text-white items-center">
                <FaBook  className='text-2xl' />

                  <p className='font-light'>50 Books read in total</p>
                  </div>
                  
                  <div className="flex gap-3 text-white items-center">
                  <MdReviews className='text-2xl text-primary-color'/>

                  <p className='font-light'>4 Reviews Shared</p>
                  </div>


                </div>
            </div>
           </div>
            
            

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
              <div className=" flex flex-col gap-4 w-full max-h-[36rem] overflow-y-auto ">
                {activeBtn && activeBtn === 'posts' && document.data.Post.length > 0  && <>
                  {document.data.Post.map((item)=>(<Post key={item.id} type={'white'} userImg={document.data.photoURL} username={document.data.nickname} isOwner={item.ownerId === user?.id} timePassed={''} content={item.body} images={item.images} postData={item} />))}                      
                </>}
                
                {activeBtn && activeBtn === 'competitions' && document.data.Member && document.data.Member.filter((item) => item.Competition).length > 0 &&
                <>
                  {document.data.Member.filter((item)=>item.Competition).map((item)=>(<Competition key={item.Competition.id} type={'dark'} competitionLogo={item.Competition.competitionLogo} competitionName={item.Competition.competitionName} membersAmount={item.Competition.members.length} comeptitionRemainingTime={new Date(item.Competition.endDate)} competitionId={item.Competition.id} />))}                      
                </>
                }

                 {activeBtn && activeBtn === 'clubs' && document.data.Member && document.data.Member.filter((item) => item.Club).length > 0 &&
                <>
                  {document.data.Member.filter((item)=>item.Club).map((item)=>(<Club key={item.Club.id} type={'dark'} clubLogo={item.Club.clubLogo} clubName={item.Club.name} hasRequirements={item.Club.requirements.length > 0} membersAmount={item.Club.members.length} clubData={item.Club}  />))}                      
                </>
                } 

                {activeBtn && activeBtn === 'clubs' && document.data.bookShelfs && document.data.bookShelfs.length > 0 && <>
                  {document.data.bookShelfs.map((item) => (<p className='text-white'>{JSON.stringify(item)}</p>))}
                </>}

                    {activeBtn && activeBtn === 'clubs' && document.data.recensions && document.data.recensions.length > 0 && <>
                  {document.data.recensions.map((item) => (<Recension key={item.id} userImg={item.user.photoURL} username={item.user.nickname} rate={item.rating} isOwner={item.userId=== user?.id} content={item.comment} type={'white'}/>))}
                </>}


                


            </div>
            </div>

          </div>
         

        </div>
          
        
       
   </>
 }
      
    </div>
  );
}

export default Profile;
