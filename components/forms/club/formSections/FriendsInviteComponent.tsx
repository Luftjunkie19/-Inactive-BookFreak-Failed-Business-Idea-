'use client';
import { Avatar, Checkbox, Chip, Select, SelectItem, useCheckbox } from '@nextui-org/react';
import { SharedSelection } from '@nextui-org/system';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'hooks/useAuthContext';
import Image from 'next/image';
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form';

type Props = {}

function FriendsInviteComponent({}: Props) {
    const {user}=useAuthContext();
    const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(new Set([]));
    const {register, setValue}=useFormContext();
  const { data: document } = useQuery({
      queryKey: ['userProfileData'],
      queryFn: () => fetch('/api/supabase/user/get', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ id:user?.id, include:{
           Club:true,
        
           friendsStarted: {
             include: {
               invitee: true
             }
           },
            friends: {
             include: {
               Invitor: true
             }
           },
           
          }}),
       }).then((res) => res.json())
   });

   const {
    children,
    isSelected,
    isFocusVisible,
    isFocused,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    defaultSelected: true,
  });

   const [, scrollerRef] = useInfiniteScroll({
    hasMore: true,
    isEnabled: isFocusVisible,
    shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
  });



  return (
    <div className="flex flex-col w-full max-w-3xl self-end gap-2">
    {document && document.data &&
   
   <Select
       selectedKeys={selectedKeys}
       onSelectionChange={(keys) => {
     
         setSelectedKeys(keys);
       }}
    
     className='max-w-xs w-full'
   items={[...document.data.friends, ...document.data.friendsStarted]}
   label={<p className='text-white text-base'>Invite Friends</p>}
   selectionMode="multiple"
     placeholder="Select a user"
     labelPlacement='outside'
     scrollRef={scrollerRef}
     data-hover={false}
     aria-checked={'false'}
     classNames={{
           'innerWrapper': 'bg-dark-gray text-white py-2',
           'trigger':'bg-dark-gray text-white border-2 border-primary-color py-2',
       'popoverContent': 'bg-dark-gray border-2 border-primary-color text-white',
           'value':'bg-dark-gray',
   }}
     renderValue={(items) => {
     return (
       <div className="flex flex-wrap gap-2">
         {items.map((item) => (
           <Chip key={item.key} classNames={{'content':'flex items-center gap-2'}}>
             <Image alt='' className='w-6 h-6 rounded-full' width={40} height={40} src={item.data.invitee.photoURL ?? item.data.Invitor.photoURL}/>
             {item.data.invitee.nickname ?? item.data.Invitor.nickname}</Chip>
         ))}
       </div>
     );
   }}
 >
     {(user) => (
       <SelectItem aria-checked={'false'}
    data-hover={false} data-focus={false} className='hover:bg-primary-color rounded-lg duration-400 transition-all' classNames={{
         'wrapper': 'hover:bg-primary-color rounded-lg duration-400 transition-all',
       'base': 'hover:bg-primary-color rounded-lg duration-400 transition-all',
         
     }} key={user.invitee.id === user.id ? user.Invitor.id : user.invitee.id} textValue={user.invitee.id === user.id ? user.Invitor.nickname : user.invitee.nickname }>
       <div className="flex gap-2 items-center">
         <Avatar  alt={user.invitee.id === user.id ? user.Invitor.nickname : user.invitee.nickname } className="px-1" size="sm" src={user.invitee.id === user.id ? user.Invitor.photoURL : user.invitee.photoURL } />
         <div className="flex flex-col">
           <span className="text-small">{user.invitee.id === user.id ? user.Invitor.nickname : user.invitee.nickname}</span>
           <span className="text-tiny text-default-400">{user.invitee.id === user.id ? user.Invitor.email : user.invitee.email}</span>
         </div>
       </div>
     </SelectItem>
   )}
 </Select>
   }

   
   <div className="flex items-center w-full gap-6 py-3">
     <div className="flex flex-col gap-2">
       <p className='text-white'>Do you want to have special requirements to join ?</p>
          <div className="flex gap-2 items-center">
         <Checkbox {...register('hasRequirements', {
           onChange(event) {
             setValue('hasRequirements', event.target.value);
           }
         })} color='default' />
         <p className='text-white text-sm'>Yes, I want to have special requirements.</p>
     </div>
</div>             
       
       
     <div className="flex flex-col gap-2">
         <p className='text-white'>Is your club free to join?</p>
       <div className="flex gap-2 items-center">
       <Checkbox data-checked={false} aria-checked={'false'} classNames={{'base':'checked:bg-primary-color checked:text-white'}} {...register('isFreeToJoin', {
           onChange(event) {
             setValue('isFreeToJoin', event.target.value);
           }
         })} color='primary' />
            <p className='text-white text-sm'>Yes, my club is free to join</p>
       </div>
     </div>
       


   </div>
</div>
  )
}

export default FriendsInviteComponent