/* eslint-disable react/jsx-key */
'use client';

import { useState } from 'react';
import image from '../../../assets/Logo.png'
import classes from '../../../stylings/gradient.module.css' 
import CompetitionBar from 'components/Sidebars/left/CompetitionLeftBar';
import { BsFillDoorOpenFill, BsListTask } from 'react-icons/bs';
import {
  FaBook,
  FaBookOpen,
  FaFacebookMessenger,
  FaInfo,
  FaLockOpen,
  FaMoneyBillWave,
  FaPencilAlt,
  FaTasks,
  FaTrashAlt,
  FaUserFriends,
} from 'react-icons/fa';
import {
  FaClockRotateLeft,
  FaLock,
  FaTicket,
  FaTicketSimple,
  FaUser,
} from 'react-icons/fa6';
import { FiType } from 'react-icons/fi';
import { GrUserManager } from 'react-icons/gr';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import Link from 'next/link';



import alertTranslations from '../../../assets/translations/AlertMessages.json';
import competitionTranslations
  from '../../../assets/translations/CompetitionsTranslations.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import CompetitionChat from '../../../components/chat/CommunityChat';
import Loader from '../../../components/Loader';
// import Ranking from '../../components/Ranking';
// import Warning from '../../components/WarningsComponents/Warning';
import { snackbarActions } from '../../../context/SnackBarContext';
import { warningActions } from '../../../context/WarningContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Button from 'components/buttons/Button';
import { IoChatbubbles } from 'react-icons/io5';
import { GiCrane } from 'react-icons/gi';
import CompetitionAd from 'components/advertisements/CompetitionAd';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import Slide from 'components/home/swipers/base-swiper/Slide';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { PagesPerDayChart } from 'components/charts/competition/CompetitionCharts';
import { useQuery } from '@tanstack/react-query';
import { TbClockExclamation, TbListDetails } from 'react-icons/tb';
import { BiShieldQuarter } from 'react-icons/bi';
import { formatDistanceToNow } from 'date-fns';
import { useRequest } from 'hooks/useRequest';
import toast from 'react-hot-toast';
import { useClipboard } from 'use-clipboard-copy';
import RankingListItem from 'components/ranking/RankingListItem';

function Competition() {
  const [isPending, setIsPending] = useState(false);
  // const sendRefund=httpsCallable(functions, 'sendRefund');
 
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const { competitionId:id } = useParams();
  const { user } = useAuthContext();
  const clipboard = useClipboard();

  const copyLinkTo = () => {
    clipboard.copy(location.href);
  }

  const { sendJoinRequest } = useRequest();

  const sendCompetitionRequest = async () => {
    try { 
      if (user && document) {
        await sendJoinRequest(user, 'competition', id as string, document.data.members.find((item) => item.isCreator).user.id);
  toast.success('Successfully sent the request to join the competition !')
}
      
    } catch (err) {
      console.error(err);
    }
  }


  const { data: document } = useQuery({
    queryKey: ['competition', id],
    queryFn: () => fetch('/api/supabase/competition/get', {
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
      }, 
      body: JSON.stringify({
        id, include: undefined,
})
    }).then((res)=>res.json())
  })

  const navigate = useRouter();


  const isWarningVisible = useSelector((state:any) => state.isWarningVisible);


  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
 

  const dispatch = useDispatch();

  return (
    <div
      className={`sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] overflow-y-scroll overflow-x-hidden w-full`}
    >
  

      <div className="flex flex-col sm:gap-14 xl:gap-0">
      <div className={`relative w-full ${classes['light-blue-gradient']} top-0 left-0 h-64 `}>
          {document && document.data && 
        <div className="absolute z-10 -bottom-16 flex gap-6 items-center  left-0 m-3">
            <Image src={image} alt='' width={60} height={60} className='sm:w-24 sm:h-24 xl:w-44 z-10 xl:h-44 object-cover rounded-lg' />
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-bold text-white">{document.data.competitionName}</p>
              <p className='text-white'>{document.data.members && document.data.members.length} Members</p>
              <div className="flex">
                  {document && document.data.members.map((item) => (<Image key={item.id} src={item.user.photoURL} alt="" width={60} height={60} className='w-8 h-8 rounded-full object-cover' />))}
                  
              </div>
            </div>
          
        </div>
          }
      </div>

      <div className="flex overflow-x-auto justify-end items-center gap-2 p-2">
        <Button onClick={copyLinkTo} additionalClasses='px-6 py-[0.375rem]' type={'blue'} >
Share
        </Button>

        {document && document.data && document.data.members && user && !document.data.members.find((item)=>item.user.id === user.id) &&   
           <Button onClick={sendCompetitionRequest} additionalClasses='px-6 py-[0.375rem] text-nowrap' type={'white-blue'} >
Request To Join
        </Button>
        }
</div>

      </div>
  {document && document.data && 
   <div className="flex sm:flex-col 2xl:flex-row overflow-x-hidden  gap-4 w-full">
        
        <div className="w-full sm:block xl:hidden">
          <BaseSwiper  slidesOnSmallScreen={2} slidesOnLargeScreen={2} slidesOnLargeScreen2={2} slidesOnXlScreen={2} slidesOn2XlScreen={2} additionalClasses='w-full'>
            <SwiperSlide className='max-w-sm w-full'>
                 <div className="w-full h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
                <p className='flex gap-4 items-center text-lg font-bold text-white'><TbListDetails /> Details</p>
                <div className="flex items-center gap-4">
                  {document.data.members.find((item) => item.isCreator) && <Image alt='' width={60} height={60} className='w-10 h-10 rounded-full' src={document.data.members.find((item) => item.isCreator).user.photoURL} />}
                  <div className="flex flex-col gap-1 text-white">
                    <p>Estimated By</p>
                    <p className='text-sm font-extralight'>{document.data.members.find((item) => item.isCreator).user.nickname}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {document.data.isFreeToJoin ? <FaLockOpen className="text-primary-color text-2xl" /> : <FaLock className="text-primary-color text-2xl" />}
                  <div className="flex flex-col gap-1 text-white">
                    <p>{document.data.isFreeToJoin ? `Open Club` : `Closed Club`}</p>
                    <p className='text-sm font-extralight'>{document.data.isFreeToJoin ? `Click the button and enjoy !` : `Request to join the club`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BiShieldQuarter className="text-primary-color text-2xl" />
                  <div className="flex flex-col gap-1 text-white">
                    <p>Administration</p>
                    <div className="flex">
                      {document.data.members.filter((item) => item.isAdmin).map((memberItem) => (<Image alt='' width={60} height={60} className='w-8 h-8 rounded-full' src={memberItem.user.photoURL} />))}
                    </div>
                  </div>
                </div>
               
              </div>
            </SwiperSlide>
              <SwiperSlide className='max-w-sm w-full'>
                 <div className="w-full h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaClockRotateLeft /> Activity</p>
            <div className="flex items-center gap-6">
              <IoChatbubbles className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>{document && document.data && document.data.chat  && document.data.chat.messages.length} New Messages Today</p>
                <p className='text-sm font-extralight'>In last Month {document && document.data && document.data.chat &&  document.data.chat.messages.length} Messages</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <FaUserFriends className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>{document.data.members.length} Members Together</p>
                <p className='text-sm font-extralight'>Yesterday {document.data.members.length} new members</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <GiCrane  className="text-primary-color text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>Estimated {formatDistanceToNow(new Date(document.data.creationDate))}</p>
                <p className='text-xs font-extralight'>Est. {new Date(document.data.creationDate).toDateString()}</p>
              </div>
                </div>
                 <div className="flex items-center gap-4">
                  <TbClockExclamation className='text-red-500 text-2xl' />
                  <div className="flex flex-col gap-1 text-white">
                    <p>Expires in</p>
                    <p className='text-sm font-extralight'> <span className='text-red-500 font-bold'>{Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000)}</span> days until expiration </p>
                  </div>
                </div>
          </div>
          </SwiperSlide>
          </BaseSwiper>
        </div>
         
          <div className="xl:flex sm:hidden 2xl:flex-col my-4 mx-2 gap-3 2xl:max-w-sm w-full">
         <div className="w-full h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
                <p className='flex gap-4 items-center text-lg font-bold text-white'><TbListDetails /> Details</p>
                <div className="flex items-center gap-4">
                  {document.data.members.find((item) => item.isCreator) && <Image alt='' width={60} height={60} className='w-10 h-10 rounded-full' src={document.data.members.find((item) => item.isCreator).user.photoURL} />}
                  <div className="flex flex-col gap-1 text-white">
                    <p>Estimated By</p>
                    <p className='text-sm font-extralight'>{document.data.members.find((item) => item.isCreator).user.nickname}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {document.data.isFreeToJoin ? <FaLockOpen className="text-primary-color text-2xl" /> : <FaLock className="text-primary-color text-2xl" />}
                  <div className="flex flex-col gap-1 text-white">
                    <p>{document.data.isFreeToJoin ? `Open Club` : `Closed Club`}</p>
                    <p className='text-sm font-extralight'>{document.data.isFreeToJoin ? `Click the button and enjoy !` : `Request to join the club`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <BiShieldQuarter className="text-primary-color text-2xl" />
                  <div className="flex flex-col gap-1 text-white">
                    <p>Administration</p>
                    <div className="flex">
                      {document.data.members.filter((item) => item.isAdmin).map((memberItem) => (<Image alt='' width={60} height={60} className='w-8 h-8 rounded-full' src={memberItem.user.photoURL} />))}
                    </div>
                  </div>
                </div>
               
              </div>
            
               <div className="w-full h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaClockRotateLeft /> Activity</p>
            <div className="flex items-center gap-6">
              <IoChatbubbles className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>{document && document.data && document.data.chat.messages.length} New Messages Today</p>
                <p className='text-sm font-extralight'>In last Month {document && document.data && document.data.chat.messages.length} Messages</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <FaUserFriends className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>{document.data.members.length} Members Together</p>
                <p className='text-sm font-extralight'>Yesterday {document.data.members.length} new members</p>
              </div>
            </div>
             <div className="flex items-center gap-6">
              <GiCrane  className="text-primary-color text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>Estimated {formatDistanceToNow(new Date(document.data.creationDate))}</p>
                <p className='text-xs font-extralight'>Est. {new Date(document.data.creationDate).toDateString()}</p>
              </div>
                </div>
                 <div className="flex items-center gap-4">
                  <TbClockExclamation className='text-red-500 text-2xl' />
                  <div className="flex flex-col gap-1 text-white">
                    <p>Expires in</p>
                    <p className='text-sm font-extralight'> <span className='text-red-500 font-bold'>{Math.floor((new Date(document.data.endDate).getTime() - new Date().getTime()) / 86400000)}</span> days until expiration </p>
                  </div>
                </div>
          </div>                
        </div>

            <div className="flex flex-col gap-3 p-1 overflow-y-auto h-auto overflow-x-hidden max-w-4xl w-full">
          <div className="flex flex-col gap-1">
           <div className="flex flex-wrap gap-3 p-1 w-full lg:items-center">
                <div className="w-full max-w-xs h-72 bg-dark-gray items-center p-2 flex flex-col justify-around border-green-400 border shadow-green-400 shadow gap-2 rounded-lg">
                  {document.data.prize.isPrizeItem && 
                    <>
                  {document.data.prize.book && <Link href={`/book/${document.data.prize.book.id}`} className='flex flex-col gap-1 items-center justify-center'>
                    <Image width={60} height={60} className='w-16 h-24 rounded-lg' src={document.data.prize.book} alt='' />
                      <p className='text-white'>{document.data.prize.book.title}</p>
                    </Link>}


                     {document.data.prize.voucherFor && <div className='flex flex-col gap-1 items-center justify-center'>
                    <Image width={60} height={60} className='w-16 h-24 rounded-lg' src={document.data.prize.book} alt='' />
                      <p className='text-white'>{document.data.prize.prizeName}</p>
   <p className='text-white'>{document.data.prize.book.itemType}</p>
                    </div>}
                   
                    </>
                  }

                  {!document.data.prize.isPrizeItem && 
                    <>
                    <p className=' text-5xl font-bold text-green-400'>{document.data.prize.prizeMoneyAmount} {document.data.prize.prizeMoneyCurrency}</p>
                  </>
                  }
              <div className="flex flex-col gap-1 items-center">
              <p className='text-white text-lg self-center'>Prize only for the ranking-leader</p> 
<p className='text-yellow-700 text-3xl self-center font-bold'>#1</p>               
              </div>  
                  

      
   
          </div>

               <div className="w-full max-w-xs h-72 bg-dark-gray justify-around items-center  p-2 flex flex-col gap-4 rounded-lg">
              <div className="flex flex-col gap-1 justify-around items-center">
                <Image src={image} width={60} height={60} className='w-12 h-12 rounded-full' alt=''/>
              <p className='text-white self-center'>Winner</p>
              <p className='text-white'>1. Username - 100 points</p>
                  </div>

              <div className="flex flex-col gap-2 items-center">
                    {new Date(document.data.endDate).getTime() === new Date().getTime() ? <>      
              <Button type={'black'} additionalClasses='bg-green-400'>Claim Reward</Button>
                    </> : <>
                        <p className='text-white text-center'>The winner will be announced on <span className='text-red-500'>{new Date(document.data.endDate).toLocaleDateString()}</span></p>
                    </>}
              </div>
          </div>
           </div>
        </div>
        
        <div className="flex flex-col gap-1">
          <BaseSwiper spaceBetween={2} additionalClasses='w-full' slidesOn2XlScreen={2} slidesOnLargeScreen2={1} slidesOnXlScreen={2} slidesOnLargeScreen={1} slidesOnSmallScreen={1}>
            <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Overall Ranking</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            
             {document.data.members.sort((a, b) => b.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}
               
                
           
             
            </div>
          </div>
            </SwiperSlide>
                    <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Week's Best Readers</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            {document.data.members.sort((a, b) => b.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}      
            </div>
          </div>
            </SwiperSlide>
            <SwiperSlide>
          <div className="bg-dark-gray max-w-sm w-full p-2 rounded-lg text-white">
            <p className='text-lg font-bold'>Month's Best Readers</p>
            <div className="overflow-y-auto min-h-60 max-h-60 h-full flex flex-col">
            {document.data.members.sort((a, b) => b.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}
            </div>
          </div>
            </SwiperSlide>
       
            
          </BaseSwiper>

          <div className="flex flex-col">
            <p className='text-white text-lg'>Data from members' progresses</p>
             <BaseSwiper spaceBetween={2} additionalClasses='w-full' slidesOn2XlScreen={2} slidesOnLargeScreen2={1} slidesOnXlScreen={2} slidesOnLargeScreen={1} slidesOnSmallScreen={1}>
            <SwiperSlide>
               <div className='max-w-sm w-full h-64 rounded-lg bg-dark-gray p-2'>
       <PagesPerDayChart className='w-full h-full' />
          </div>
            </SwiperSlide>
               <SwiperSlide>
               <div className='max-w-sm w-full h-64 rounded-lg bg-dark-gray p-2'>
       <PagesPerDayChart className='w-full h-full' />
          </div>
            </SwiperSlide>
               <SwiperSlide>
               <div className='max-w-sm w-full h-64 rounded-lg bg-dark-gray p-2'>
       <PagesPerDayChart className='w-full h-full' />
          </div>
          </SwiperSlide>
          </BaseSwiper>
          </div>
        </div>
         
  </div>
 
</div>
}
      
     
 
    </div>
  )
}

export default Competition;
