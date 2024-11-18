
'use client';
import { SupabaseClient } from '@supabase/supabase-js';
import { useQuery } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import ProfileDashboardBar from 'components/Sidebars/left/profile/ProfileDashboardBar';
import useStorage from 'hooks/storage/useStorage';
import { useAuthContext } from 'hooks/useAuthContext';
import { createClient } from 'lib/supabase/client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { AiOutlineUserDelete } from 'react-icons/ai';
import { FaImage, FaUserFriends } from 'react-icons/fa';

interface UserBasicInfo {
  nickname: string
  email: string
  nationality: string 
  description: string
  profileImg: string
  backgroundImg:string
}

function Page() {
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

  const inputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const navigate = useRouter();
  const supabase = createClient();

  const { register, setValue, getValues, clearErrors, handleSubmit} = useForm<UserBasicInfo>(document && document.data && {
    defaultValues: {
      nickname: document.data.nickname, 
      email: document.data.email,
      nationality: document.data.nationality ?? undefined,
      description: document.data.description,
      profileImg: document.data.photoURL,
    backgroundImg: document.data.backgroundImg
    }
  }); 

  const [profileImage, setProfileImage] = useState<{ file: File, url: string } | null>(document && document.data && { file: undefined, url: document.data.photoURL });
  
   const handleSelect = (e, imageType:'profileImg' | 'backgroundImg') => {
    clearErrors('profileImg');
     imageType === 'profileImg' ? setProfileImage(null) : setBackgroundImage(null);

    let selected = e.target.files[0];

    console.log(selected);



      if (!selected) {
      //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.selectAnything[selectedLanguage]}`, alertType: "error" }));
      toast.error('No image Selected');
      imageType === 'profileImg' ? setProfileImage(null) : setBackgroundImage(null);
      return;
    }


    if (selected.size > 200000) {
       imageType === 'profileImg' ? setProfileImage(null) : setBackgroundImage(null);
      toast.error('To Big File !');
      return;
    }

    if (!selected.type.includes("image")) {
      //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]}`, alertType: "error" }));
           toast.error('Inappropriate Image Selected !');
        imageType === 'profileImg' ? setProfileImage(null) : setBackgroundImage(null);
      return;
    }

  

    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
          imageType === 'profileImg' ? setProfileImage({
          file: selected,
          url:fileReader.result as string,
        }) : setBackgroundImage({
          file: selected,
          url:fileReader.result as string,
        });
     
        imageType === 'profileImg' && setValue('profileImg', selected);
      };
         imageType === 'profileImg' &&  clearErrors('profileImg');
      return;
    }
  };

  const { uploadImage, uploadImageUrl} = useStorage();

  const [backgroundImage, setBackgroundImage] = useState<{ file: File, url: string } | null>();
  const [nationality, setNationality] = useState<string>(getValues('nationality'));
    
  const submitForm = async (formData) => {
    try {
      if (user) {
        if (formData['email'] !== document.data.email) {
        await supabase.auth.updateUser({ email: formData['email'] });
        }
        
        let profileImg;
        let backgroundImg;

        if (profileImage && profileImage.file) { 
          const { data:uploadImg, error } = await uploadImage(profileImage.file, 'profileImages', `${user.id}/${profileImage.file.name}`);
          if (error && !uploadImg) {
            console.error(error);
            return;
          }
          if (uploadImg) {
            
            const url = await uploadImageUrl(uploadImg.path, 'profileImages');
            profileImg = url;
          }
          
        }
        
        if (backgroundImage && backgroundImage.file) {
          
             const { data:uploadImg, error } = await uploadImage(backgroundImage.file, 'backgroundProfileImages', `${user.id}/${backgroundImage.file.name}`);
          if (error && !uploadImg) {
            console.error(error);
            return;
          }
          if (uploadImg) {
            
            const url = await uploadImageUrl(uploadImg.path, 'backgroundProfileImages');
            backgroundImg = url;
          }


        }


  
        const res = await fetch('/api/supabase/user/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              nickname: formData['nickname'],
              description: formData['description'],
              email: formData['email'],
              nationality: formData['nationality'],
              photoURL: profileImg ?? document.data.photoURL,
              backgroundImg: backgroundImg ?? document.data.backgroundImg
            },
            where: { id: user!.id }
          })
        });
  
        const { data, error } = await res.json();
  
        if (error) {
          throw error;
          }
  
        toast.success('Successfully updated !');
        navigate.push(`/profile/${user.id}`)
      }

    } catch (err) {
      console.log(err);
 }
      
          }

  return (
 
    <div className='flex w-full'>
      <ProfileDashboardBar/>
      
      <div className="sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] overflow-y-auto w-full">
        {document && document.data &&<div className='flex flex-col gap-12'>
          <div className='bg-dark-gray cursor-pointer flex h-52 justify-center items-center relative top-0 left-0'>
              <input ref={backgroundInputRef} onChange={(e) => {
                handleSelect(e, 'backgroundImg');
              }} type="file" name="" id="" className="hidden" />
            <div onClick={() => {
              backgroundInputRef.current?.click();
            }} className="flex justify-center cursor-pointer w-full h-full items-center flex-col">
              {!backgroundImage ? <>
               <FaImage className='self-center text-8xl text-primary-color' />
              <p className='text-sm text-center text-gray-500'>Wanna ad or change any img click one of those 2 and change for a better fitting one !</p>
              </> :
                
                <Image alt='' src={backgroundImage.url} className='w-full h-full object-cover' width={50} height={50} />}
          </div>
            <div className="flex gap-8 items-center absolute -bottom-12 left-4 m-2">
              <input onChange={(e) => {
                handleSelect(e, 'profileImg');
              }} ref={inputRef} type="file" accept='image/*' name="" className='hidden' id="" />
            <Image onClick={() => {
              inputRef.current!.click();
            }} src={profileImage?.url ?? document.data.photoURL} alt='' width={60} height={60} className='lg:w-48 cursor-pointer lg:h-48 sm:w-28 sm:h-28 rounded-full' />
            </div>
            
          </div>


          <form onSubmit={handleSubmit(submitForm, (errors) => {
            console.log(errors);
          })} className="flex flex-col p-3 gap-6">
          <div className="flex sm:flex-col lg:flex-row gap-4  lg:items-center w-full">
            <LabeledInput {...register('nickname', {
              validate: {
                noValue:(value)=> value.trim().length > 0 || 'You have to put a nickname !' 
              }
            })} defaultValue={getValues('nickname') ?? document.data.nickname} containerStyle='max-w-xs w-full' additionalClasses='p-2 max-w-xs w-full' type='dark' label="Nickname" />
              <LabeledInput {...register('email', {
                validate: {
                  noValue: (value) => value.trim().length > 0 || 'You have to pass any of your emails !',
                  emailNotValid: (value) => value.match(/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/) || 'You have to provide an valid email !',
              }
            })} defaultValue={getValues('email')  ?? document.data.email} containerStyle='max-w-xs w-full' additionalClasses='p-2 max-w-xs w-full' type='dark' label="Email" />
               <div className="flex flex-col gap-2 max-w-xs w-full">
<p className="text-white">Version Language</p>
            <ReactFlagsSelect className='max-w-xs w-full' {...register('nationality', {required:'You have to select any nationality.'})} searchable showOptionLabel selectButtonClassName='bg-dark-gray text-white border-primary-color font-inherit max-w-xs w-full' selected={nationality}  onSelect={function (countryCode: string): void {
                  setNationality(countryCode);
                  setValue('nationality', countryCode);
            } }/>
          </div>
            </div>
           <div className="flex flex-col gap-1">
                      <p className='text-white'>Description</p>
                      <textarea {...register('description')} defaultValue={getValues('description') ?? document.data.description} placeholder='Enter Description' className="w-full text-white max-w-3xl h-60 p-2 rounded-lg bg-dark-gray outline-none border border-primary-color"/>
                  </div>

            <Button isSubmit type='blue' additionalClasses='w-fit px-4'>Update</Button>
          </form>
          

          <div className="flex flex-col gap-1 p-2">
            <p className='text-white text-2xl flex gap-2 items-center'>Delete Account <AiOutlineUserDelete className='text-red-400' /></p>
            <p className='text-gray-400 text-sm max-w-3xl'>You can delete your account, if you don't feel comfortable anymore to be a member of BookFreak. Your all data, progress, chats will be removed permanently by clicking this button below.</p>
            <Button type='black' additionalClasses='bg-red-400 my-2 w-fit px-2'>Delete Account</Button>
          </div>

        </div>
         }
    
      </div>
      
    </div>
    
 
  )
}

export default Page