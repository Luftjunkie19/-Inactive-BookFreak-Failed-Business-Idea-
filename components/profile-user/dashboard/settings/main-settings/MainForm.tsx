'use client';
import { User } from '@supabase/supabase-js';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import useStorage from 'hooks/storage/useStorage';
import { createClient } from 'lib/supabase/client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';
import ReactFlagsSelect from 'react-flags-select';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaImage, FaUserFriends } from 'react-icons/fa';
import { IoLockClosed, IoNotifications, IoPerson } from 'react-icons/io5';



type Props = {document:{data:any | null, error: any | null}, user:User | null, }

interface UserBasicInfo {
  nickname: string
  email: string
  nationality: string 
  description: string
  profileImg: string
  backgroundImg:string
}


function MainForm({document,user }: Props) {
  const { register, setValue, getValues, clearErrors, handleSubmit, setError, formState} = useForm<UserBasicInfo>(document && document.data && {
    defaultValues: {
      nickname: document.data.nickname, 
      email: document.data.email,
      nationality: document.data.nationality ?? undefined,
      description: document.data.description,
      profileImg: document.data.photoURL,
    backgroundImg: document.data.backgroundImg
    }
  }); 
    
  const supabase = createClient();

  
  const [backgroundImage, setBackgroundImage] = useState<{ file: File, url: string } | null>();
  const [nationality, setNationality] = useState<string>(getValues('nationality'));

      const inputRef = useRef<HTMLInputElement>(null);
      const backgroundInputRef = useRef<HTMLInputElement>(null);
      const navigate = useRouter();

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

      const submitForm = async (formData) => {
    clearErrors();
    try {
      if (user && Object.keys(formState.errors).length === 0) {
        if (formData['email'] !== document.data.email) {
        await supabase.auth.updateUser({ email: formData['email'] });
        }
        
        let profileImg;
        let backgroundImg;

        if (profileImage && profileImage.file) { 
          const { data:uploadImg, error } = await uploadImage(profileImage.file, 'profileImages', `${user.id}/${profileImage.file.name}`);
          if (error && !uploadImg) {
            console.error(error);
            toast.error(`Profile Img: ${error.message}`);
            return;
          }
          if (uploadImg) {
            
            const url = await uploadImageUrl(uploadImg.path, 'profileImages');
            profileImg = url;
          }else{
            profileImg=document.data.photoURL;
          }
          
        }
        
        if (backgroundImage && backgroundImage.file) {
          
             const { data:uploadImg, error } = await uploadImage(backgroundImage.file, 'backgroundProfileImages', `${user.id}/${backgroundImage.file.name}`);
          if (error && !uploadImg) {
            console.error(error);
            toast.error(`Background: ${error.message}`);
            return;
          }
          if (uploadImg) {
            
            const url = await uploadImageUrl(uploadImg.path, 'backgroundProfileImages');
            backgroundImg = url;
          }else{
            backgroundImg=document.data.backgroundImg;
          }

        }

        console.log(profileImg, backgroundImg);

  
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
              photoURL: profileImg,
              backgroundImg: backgroundImg
            },
            where: { id: user.id }
          })
        });
  
        const { data, error } = await res.json();
  
        if (error) {
          throw error;
          }
  
        toast.success('Successfully updated !');
        navigate.push(`/profile/${user.id}`)
      }
      else{
        toast.error('Error updating user, please try again !');
      }

    } catch (err) {
      console.log(err);
 }
      
          }


  return (
      <>
      <div className='bg-dark-gray cursor-pointer flex h-52 justify-center items-center relative top-0 left-0'>
              <input ref={backgroundInputRef} onChange={(e) => {
                handleSelect(e, 'backgroundImg');
              }} type="file" name="" id="" className="hidden" />
            <div onClick={() => {
              backgroundInputRef.current?.click();
            }} className="flex justify-center relative group overflow-hidden  top-0 left-0 cursor-pointer w-full h-full items-center flex-col">
              <div className="absolute top-0 left-0 w-full h-full group-hover:translate-y-0 -translate-y-full group-hover:opacity-100 opacity-0 duration-500 transition-all bg-primary-color/75 flex justify-center items-center flex-col gap-2">
             <FaImage className='self-center text-6xl text-white' />
                <p className='text-white text-4xl font-semibold'>Change Image</p>
              </div>
              {!backgroundImage && !document.data.backgroundImg ? <>
               <FaImage className='self-center text-8xl text-primary-color' />
              <p className='text-sm text-center text-gray-500'>Wanna ad or change any img click one of those 2 and change for a better fitting one !</p>
              </> :
                <Image alt='' src={backgroundImage ? backgroundImage.url : document.data.backgroundImg} className='w-full h-full object-cover' width={50} height={50} />}
          </div>
            <div onClick={() => {
              inputRef.current!.click();
                }} className="flex gap-8 items-center absolute hover:before:opacity-100 before:opacity-0 before:transition-all before:top-0 before:left-0 before:absolute before:rounded-full before:w-full before:h-full before:bg-dark-gray/75 -bottom-12 left-4 m-2">
              <input onChange={(e) => {
                handleSelect(e, 'profileImg');
              }} ref={inputRef} type="file" accept='image/*' name="" className='hidden' id="" />
            
            <Image  src={profileImage?.url ?? document.data.photoURL} alt='' width={60} height={60} className='lg:w-48 cursor-pointer lg:h-48 sm:w-28 sm:h-28 rounded-full' />
        
            </div>
            
          </div>


          <form onSubmit={handleSubmit(submitForm, (errors) => {
            Object.values(errors).forEach((error) => {
              toast.error(error.message ?? "Something went wrong !");
            })
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
      </>
  )
}

export default MainForm