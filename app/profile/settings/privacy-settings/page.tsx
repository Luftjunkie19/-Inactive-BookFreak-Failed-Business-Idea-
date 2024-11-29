"use client";
import { Popover, PopoverContent, PopoverTrigger, useDisclosure } from '@nextui-org/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import ProfileDashboardBar from 'components/Sidebars/left/profile/ProfileDashboardBar'
import { useAuthContext } from 'hooks/useAuthContext';
import { useRouter } from 'next/navigation';

import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { BiWorld } from 'react-icons/bi';
import { BsPersonArmsUp } from 'react-icons/bs';
import { FaBookOpen, FaLock, FaUserFriends } from 'react-icons/fa';
import { FaBaby, FaBook, FaRankingStar, FaShield } from 'react-icons/fa6';
import { FiActivity } from 'react-icons/fi';
import { GiBookshelf } from 'react-icons/gi';
import { MdLocationCity, MdOutlineDescription, MdPrivacyTip } from 'react-icons/md'
import { PiGenderIntersexBold } from 'react-icons/pi'
import { SiBookstack } from 'react-icons/si';
import { TbBooks, TbWorld } from 'react-icons/tb';

type Props = {}

type privacyVisibility = {
  publiclyVisible: string[],
  onlyFriendsVisible: string[],
  onlyMeVisible:string[],
}

function PrivacySettingsPage({ }: Props) {
  const { user } = useAuthContext();
  const { data: document } = useQuery({
    queryKey: ['profile'],
    queryFn: () => fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: user!.id, include: {
          recensions: true,
          notifications: true,
          'BookLover': true,
          'Comment': true,
          'Result': true,
          'addedBooks': true,
          'bookShelfs': true,
          'ReadingProgress': true,
          'Club': true,
          'Post': true,
        },
      }),
    }).then((res) => res.json())
  });
  const [visibilityPopover, setVisibilityPopover] = useState<privacyVisibility>({
    'onlyFriendsVisible': document && document.data ? document.data.onlyFriendsAvailable : [],
    'publiclyVisible':   document && document.data ? document.data.publiclyAvailable : [],
    'onlyMeVisible':   document && document.data ? document.data.onlyMeVisible : [],
  });
  const queryClient = useQueryClient();
  const navigation = useRouter();

  const { mutateAsync } = useMutation({
    mutationKey: ['profile'],
    mutationFn: async () => {
      const response = await fetch('/api/supabase/user/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          where:{id: user!.id,},
          data: {
            onlyFriendsAvailable: visibilityPopover.onlyFriendsVisible,
            publiclyAvailable: visibilityPopover.publiclyVisible,
            onlyMeVisible: visibilityPopover.onlyMeVisible,
          }
        }),
      });
      const fetchedRes = await response.json();

      if (!fetchedRes.error) {
        toast.success('Successfully updated !');
      } else {
        toast.error('Something went not as expected.');
        throw new Error('Not correct')
      }
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({ 'type': 'active', 'queryKey': ['profile'] }); 
      navigation.push(`/`);
    }
  })



  function VisibilityPopover({propertyName} :{propertyName:string}) {

const setVisibility = (
  visibilityType: 'onlyFriendsVisible' | 'publiclyVisible' | 'onlyMeVisible', 
  property: string
) => {
  setVisibilityPopover((prev) => {
    const newVisibilityPopover = Object.keys(prev).reduce((acc, key) => {
      if (key === visibilityType) {
        // Add property to the target visibilityType array
        acc[key] = prev[key].includes(property) ? prev[key] : [...prev[key], property];
      } else {
        // Remove property from all other arrays
        acc[key] = prev[key].filter((item) => item !== property);
      }
      return acc;
    }, {} as typeof prev);

    return newVisibilityPopover;
  });
};


    const selectedState = visibilityPopover.onlyFriendsVisible.find((item) => item === propertyName) ? (<div className='flex items-center gap-2'>
     <FaUserFriends className='text-2xl text-primary-color'/>
      <p>Only Friends</p>
    </div>) : visibilityPopover.onlyMeVisible.find((item) => item === propertyName) ? (<div className='flex items-center gap-2'>
     <FaLock className='text-2xl text-primary-color'/>
      <p>Only Me</p>
    </div>) : visibilityPopover.publiclyVisible.find((item) => item === propertyName) ? (<div className='flex items-center gap-2'>
     <TbWorld className='text-2xl text-primary-color'/>
      <p>Public</p>
    </div>) : (<p>Visibility</p>)


    return ( <Popover classNames={{
    'content': 'bg-dark-gray rounded-lg text-white outline-none border border-primary-color ',
    'arrow':'bg-primary-color text-primary-color',
    "base":'outline-none'
}} placement="bottom" showArrow offset={10}>
<PopoverTrigger className='text-white cursor-pointer' as='button'>
{selectedState}
</PopoverTrigger>
<PopoverContent className="max-w-56 min-w-44 w-full">
<div className="w-full flex flex-col gap-2">
<div onClick={()=>setVisibility('publiclyVisible', propertyName)} className="flex cursor-pointer group p-2 justify-between items-center gap-2">
<p className='text-white transition-all group-hover:text-primary-color'>Public</p>
<BiWorld className='group-hover:text-primary-color transition-all text-lg' />
</div>
<div  onClick={()=>setVisibility('onlyFriendsVisible', propertyName)} className="flex cursor-pointer group p-2 justify-between items-center gap-2">
<p className='text-white group-hover:text-primary-color transition-all'>Only Friends</p>
<FaUserFriends className='group-hover:text-primary-color transition-all text-lg' />
</div>
<div onClick={()=>setVisibility('onlyMeVisible', propertyName)} className="flex cursor-pointer group p-2 justify-between items-center gap-2">
<p className='text-white transition-all group-hover:text-primary-color'>Only Me</p>
<FaLock className='group-hover:text-primary-color transition-all text-lg' />
</div>
</div>
</PopoverContent>
</Popover>)
  };

  
   

  return (
    <div className='flex'>
      <ProfileDashboardBar/>
      <div className="sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] px-3 py-2 overflow-y-auto w-full">
        <p className='text-white text-2xl font-semibold flex items-center gap-2'>Privacy Settings <MdPrivacyTip className='text-2xl text-primary-color' /></p>
        <p className='text-white'>Handle your privacy settings, including who can see your profile </p>

        <div className="flex flex-col max-h-80 overflow-y-auto gap-2">
        <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <PiGenderIntersexBold className='text-2xl' />  Gender</p>
         <VisibilityPopover propertyName={'gender'} />
        </div>

        <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
            <p className='text-white flex text-lg items-center gap-2'> <FaBook  className='text-2xl text-primary-color' /> Favourite Book</p>
    <VisibilityPopover propertyName={'favBook'}  />
        </div>

        <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
            <p className='text-white flex text-lg items-center gap-2'> <FaBookOpen  className='text-2xl text-primary-color' /> Currently Reading</p>
  <VisibilityPopover propertyName={'currentBook'} />
        </div>

        <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
           <div className="flex flex-col gap-2">
           <p className='text-white flex text-lg items-center gap-2'> <FiActivity  className='text-2xl text-primary-color' /> User Activity</p>
           <p className='text-white text-xs'>(Posts, Comments, Reactions, Recensions)</p>
           </div>
        <VisibilityPopover propertyName={'userActivity'} />
        </div>

        <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <MdLocationCity  className='text-2xl text-primary-color' /> Living Town</p>
                 <VisibilityPopover propertyName='livingPlace' />
            </div>

            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <FaBaby  className='text-2xl text-primary-color' /> Birth Place</p>
        <VisibilityPopover propertyName='birthPlace' />
            </div>

            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <BsPersonArmsUp  className='text-2xl text-primary-color' /> Hobbies List</p>
           <VisibilityPopover propertyName='hobbies' />
          </div>
          
           <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <MdOutlineDescription  className='text-2xl text-primary-color' /> Description</p>
            <VisibilityPopover propertyName='description' />
          </div>
          
           <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <SiBookstack  className='text-2xl text-primary-color' /> Added Books</p>
            <VisibilityPopover propertyName='addedBooks' />
          </div>
          
           <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <TbBooks  className='text-2xl text-primary-color' /> Read Books</p>
            <VisibilityPopover propertyName='readBooks' />
          </div>
          
            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <GiBookshelf   className='text-2xl text-primary-color' /> Bookshelfs</p>
            <VisibilityPopover propertyName='bookshelfs' />
          </div>
          
            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <FaRankingStar  className='text-2xl text-primary-color' /> Competitions</p>
            <VisibilityPopover propertyName='competitions' />
          </div>
          
             <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <FaShield  className='text-2xl text-primary-color' /> Club</p>
            <VisibilityPopover propertyName='club' />
            </div>



        </div>
      
      <Button onClick={mutateAsync} type='blue' additionalClasses='px-4 mt-4'>Update</Button>
      </div>
    </div>
  )
}

export default PrivacySettingsPage