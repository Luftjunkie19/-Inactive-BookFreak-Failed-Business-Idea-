'use client';


import { use, useState } from 'react';
import image from '../../../assets/Logo.png'
import { BsFillDoorOpenFill, BsListTask } from 'react-icons/bs';
import {
  FaBookOpen,
  FaFacebookMessenger,
  FaInfo,
  FaPencilAlt,
  FaTasks,
  FaTrashAlt,
  FaUserFriends,
  FaUserPlus,
} from 'react-icons/fa';
import {
  FaClockRotateLeft,
  FaLock,
  FaLockOpen,
  FaUsers,
  FaX,
} from 'react-icons/fa6';
import {
  GiBookmarklet,
  GiCrane,
  GiRibbonShield,
} from 'react-icons/gi';
import { GrUserManager } from 'react-icons/gr';
import {
  useDispatch,
  useSelector,
} from 'react-redux';



import alertTranslations from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/ClubsTranslations.json';
import formsTranslations
  from '../../../assets/translations/FormsTranslations.json';
import reusableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import CompetitionChat from '../../../components/chat/CommunityChat';
import { snackbarActions } from '../../../context/SnackBarContext';
import { warningActions } from '../../../context/WarningContext';
import { useAuthContext } from '../../../hooks/useAuthContext';

import { useRouter, useParams } from 'next/navigation';

import Image from 'next/image';
import Button from 'components/buttons/Button';
import CompetitionAd from 'components/advertisements/CompetitionAd';
import { IoChatbubbles } from 'react-icons/io5';
import BaseSwiper from 'components/home/swipers/base-swiper/BaseSwiper';
import { SwiperSlide } from 'swiper/react';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { TbListDetails } from 'react-icons/tb';
import { BiShieldQuarter } from 'react-icons/bi';
import {useRequest} from 'hooks/useRequest';
import toast from 'react-hot-toast';
import { useClipboard } from 'use-clipboard-copy';
import RankingListItem from 'components/ranking/RankingListItem';
import { useForm } from 'react-hook-form';
import { Competition } from 'app/form/competition/page';

function Club({params}:{params:{clubId:string}}) {
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const { clubId: id } = use(params);
  const dispatch = useDispatch();
  const { user } = useAuthContext();
  const navigate = useRouter();;
  const [message, setMessage] = useState<{ open: boolean, message: string | null }>({ open: false, message: null });
    const { sendJoinRequest} = useRequest();
  const { data: document } = useQuery({
    queryKey: ['club'],
    queryFn: () => fetch('/api/supabase/club/get', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, include: { members: { include: { user: true } } } })
    }).then((res) => res.json())
  });


  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
 const clipboard = useClipboard();
  const sendRequest = async () => {
    try {
      if (user){
        await sendJoinRequest(user, 'club', id as string, document.data.members.find((item) => item.isCreator).user.id);
      }
      
      toast.success('Successfully sent a join request.');

     } catch (err) {
      console.log(err);
    }
  }

  const copyShareLink = () => {
    clipboard.copy(location.href);
    toast.success('Link copied to clipboard');
  }




  return (
    <div
      className={`w-full sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden`}
    >
      <div className="relative top-0 left-0 bg-red-200 max-h-60 h-full">
        {document && document.data &&
        <div className="absolute z-10 -bottom-16 flex gap-6 items-center  left-0 m-3">
            <Image src={document.data.clubLogo} alt='' width={60} height={60} className='w-44 z-10 h-44 object-cover rounded-lg' />
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-bold text-white">{document.data.clubName}</p>
              <p>{document.data.members && document.data.members.length} Members</p>
              <div className="flex">
                {document.data.members && document.data.members.map((item)=>( <Image key={item.id} src={item.user.photoURL} alt='' width={60} height={60} className='w-6 h-6 object-cover rounded-full' />))}
              </div>
            </div>
          
        </div>
        }
   </div>
              <div className="flex justify-end items-center gap-2 p-2">
        <Button onClick={copyShareLink} additionalClasses='px-6 py-[0.375rem]' type={'blue'} >
Share
        </Button>

        {document && user && document.data && !document.data.members.find((member)=>member.user.id === user.id) &&
           <Button onClick={sendRequest} additionalClasses='px-6 py-[0.375rem]' type={'white-blue'} >
Join Club
        </Button>
        }
      </div>
      
        {document && document.data &&   
        <div className="flex sm:flex-col 2xl:flex-row 2xl:items-center gap-6 px-1 w-full">
        <div className="flex sm:flex-col xl:flex-row 2xl:flex-col my-4 mx-2 gap-3 lg:max-w-full 2xl:max-w-sm sm:max-w-sm w-full">
          <div className="w-full h-72 max-w-sm  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaClockRotateLeft /> Activity</p>
            <div className="flex items-center gap-6">
              <IoChatbubbles className="text-white text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>{document.data.chat.messages.length} New Messages Today</p>
                <p className='text-sm font-extralight'>In last Month {document.data.chat.messages.length} Messages</p>
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
          </div>
              <div className="w-full h-72 max-w-sm  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><TbListDetails /> Details</p>
            <div className="flex items-center gap-4">
              {document.data.members.find((item)=>item.isCreator) && <Image alt='' width={60} height={60} className='w-10 h-10 rounded-full' src={document.data.members.find((item)=>item.isCreator).user.photoURL}/>}
              <div className="flex flex-col gap-1 text-white">
                <p>Estimated By</p>
                <p className='text-sm font-extralight'>{document.data.members.find((item)=>item.isCreator).user.nickname}</p>
              </div>
            </div>
              <div className="flex items-center gap-4">
                {document.data.isFreeToJoin ? <FaLockOpen className="text-primary-color text-2xl" /> :        <FaLock className="text-primary-color text-2xl" />}
              <div className="flex flex-col gap-1 text-white">
                <p>{document.data.isFreeToJoin ? `Open Club` : `Closed Club`}</p>
                <p className='text-sm font-extralight'>{document.data.isFreeToJoin ? `Click the button and enjoy !` : `Request to join the club`}</p>
              </div>
            </div>
             <div className="flex items-center gap-3">
              <BiShieldQuarter className="text-primary-color text-2xl" />
              <div className="flex flex-col gap-1 text-white">
                <p>Administration</p>
                <div className="flex items-center">
                  {document.data.members.filter((item)=>item.isAdmin).map((memberItem)=>(<Image key={memberItem.id} alt='' width={60} height={60} className='w-8 h-8 rounded-full' src={memberItem.user.photoURL}/>))}
          </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 max-w-4xl w-full">
          <div className="w-full h-72 bg-dark-gray p-2 rounded-lg">
            <p className='flex gap-4 items-center text-lg font-bold text-white'><FaTasks className='text-2xl' /> Competition Rules</p>
            <ul className='py-2'>
              {document.data.requirements.length > 0 ? document.data.requirements.map((item, index) => (<li key={index} className='text-white flex gap-1 items-center'>
              
            -  
                {item.requirementQuestion && item.requirementQuestionPossibleAnswers.length > 0 && 
                <p>{item.requirementQuestion}: {item.requirementQuestionPossibleAnswers.join(', ')}</p>
                }

                {item.requiredBookType && item.requiredPagesRead && 
                <p>{item.requiredBookType}: {item.requiredPagesRead} Pages</p>
                }

                {item.requiredBookType && item.requiredBookRead && <p>{item.requiredBookType}: {item.requiredBookRead} Books</p>}
                
             
              
              </li>)) : <>
                <p>No requirements have been estabilished.</p>
                </>}
            </ul>
            <p className='flex gap-4 items-center text-lg font-bold text-white'><BsListTask className='text-2xl' /> Description</p>
            <div className="max-h-44 overflow-y-auto h-full text-white">{document.data.description}</div>
          </div>

       <CompetitionAd />

        </div>
</div>
        }

      {document && document.data && 
      <div className="flex flex-col gap-1 py-1 px-4">
        <p className='text-xl flex gap-2 items-center  font-semibold text-white'><FaBookOpen className='text-white'/> Reading Activity of the users</p>
        <div className="max-w-5xl w-full">
          <BaseSwiper slidesOnXlScreen={2} additionalClasses='w-full gap-2'>
            <SwiperSlide className='w-full max-w-xs'>
          <div className="w-full max-w-xs h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
          {document.data.members.sort((a, b) => b.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}
          
          </div>
            </SwiperSlide>
             <SwiperSlide className='w-full max-w-xs'>
          <div className="w-full max-w-xs h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
          {document.data.members.sort((a, b) => b.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}
          </div>
            </SwiperSlide>
           <SwiperSlide className="w-full max-w-xs">
          <div className="w-full max-w-xs h-72  bg-dark-gray p-2 flex flex-col gap-2 rounded-lg">
           
          {document.data.members.sort((a, b) => b.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0) - a.user.ReadingProgress.map((item) => item.pagesRead).reduce((a, b) => a + b, 0)).map((member, index) => (
               <RankingListItem key={member.user.id} image={member.user.photoURL} username={member.user.nickname} pagesAmount={member.user.ReadingProgress.map((item)=>item.pagesRead).reduce((a, b) => a + b, 0)} rankingPlace={index + 1} />
             ))}
          </div>
            </SwiperSlide>
          </BaseSwiper>
          
          
         
      </div>
      </div>   
   
      }
      

    </div>
  );
}

export default Club;
