'use client';
import uniqid from 'uniqid';
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import React from 'react'
import img from '../../assets/default-avatar-profile-trendy-style-social-media-user-icon-187599373.jpg'
import Button from 'components/buttons/Button'
import { FaBookmark, FaImage } from 'react-icons/fa6'
import LabeledInput from 'components/input/LabeledInput'
import { useAuthContext } from 'hooks/useAuthContext';
import { toast } from 'react-hot-toast';
import useStorage from 'hooks/storage/useStorage';
import { useFieldArray, useForm } from 'react-hook-form';
import {DevTool} from '@hookform/devtools';
import ModalComponent from 'components/modal/ModalComponent';
import { useDisclosure } from '@nextui-org/react';
import { MdDelete } from 'react-icons/md';
import { useLogout } from 'hooks/useLogout';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import useSupabaseDatabaseActions from 'hooks/database/useSupabaseDatabaseActions';
import useSupabaseDatabaseElement from 'hooks/database/useSupabaseDatabaseElement';
import useLoadFetch from 'hooks/useLoadFetch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


type Props = {}

type PreviewImage= {
  url: string,
  description:string,
   fileObj:File,
}

type Post = {
  postContent: string,
  postImages: PreviewImage[],
}

function ActivityManager({ }: Props) {
  const { user } = useAuthContext();
  const { element: userDocument } = useLoadFetch();
  const { uploadImage, uploadImageUrl } = useStorage();
  const { logout } = useLogout();

 

  const { register, control, handleSubmit, formState, reset, resetField, watch, setError, clearErrors} = useForm({
    
  });
  const { errors, isSubmitted, isSubmitting} = formState;

  const { fields, append, remove, replace, update } = useFieldArray({
    name: "postImages",
    control,
  });



  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);


  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
}


  }

  const selectImages = (e:React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();


    const files = e.target.files;

    if (!files) { 
         toast.error('Something went wrong with upload.');
      return;
    }
    

    if (files.length === 0) {
      toast.error('No files selected.');
      return
    }

    for (let index = 0; index < files.length; index++) {
      const element = files[index];

      if (element.size > 100000) {
        toast.error(`Something went wrong with upload of file ${element.name}.`);
        return;
      }

      if (element.type.includes('image')) {
        const reader= new FileReader();
  
        reader.readAsDataURL(element);

        reader.onload = () => {
          append({
              url: reader.result as string,
            description: "",
            fileObj:element
          });
       
       return;
        }
        
    

           return;
      }

    
    }

  }




  const createPost = async (formData: Post) => {
    const uniqueId = uniqid();
    const postContent = formData['postContent'];
    const images = formData['postImages'];
    try {
      
      if (!postContent || postContent.toString().trim().length === 0) {
        setError('No content provided into the textarea.', {
          'message': 'No content provided into the textarea.',
          'type':'pattern'
                });
        throw new Error('No content provided into the textarea.');
      }

      if (!user) {
        setError('You must be logged in to create a post.', {
          'message': 'You must be logged in to create a post.',
          'type':'pattern'
                });
        throw new Error('You must be logged in to create a post.', {
          'cause':'You must be logged in to create a post.'
        });
      }


      let postArray:{url:string, description:string}[] = [];

      if (!images || images.length > 0) {

        for (let index = 0; index < images.length; index++) {
          const postImg = images[index];
        

          const { data:imageObj, error } = await uploadImage(postImg.fileObj, `postImages`, `${user.id}/${uniqueId}/${postImg.fileObj?.name}`);

          if (!imageObj || error) {
            console.log(imageObj, error);
            return;
          }

          
          const imageUrl = await uploadImageUrl(imageObj.path, `postImages`);

          console.log(postImg.description);

           if (imageUrl) {
            postArray = [...postArray, { url: imageUrl, description: postImg.description }];
          }
       
        
      }


   
      
      }

        const fetchData = await fetch('api/supabase/post/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
     body: JSON.stringify({
       data: {
           id: uniqueId,
          body: postContent,
          images:postArray,
          ownerId: user.id,
          header: 'Hello !'
          }
        }),
      });
      const { data, error } = await fetchData.json();

      
      if (error) {
        setError('Error with post creation !', {
          'message': 'Some data is inavalid perhaps',
          'type': 'validate'
        });
        return;
      }



      console.log(data, error);

   

      reset();
      replace([]);
      clearErrors();
      const uptd = await queryClient.refetchQueries({ 'queryKey': ['posts'], 'type': 'all' });
      const uptd2 = await queryClient.refetchQueries({ 'queryKey': ['swiperPosts'], 'type': 'all' });

      await Promise.all([uptd, uptd2]);

      toast.success('Successfully created a post ✅');
 




    } catch (err) {
      console.log(err);
         if (errors.root) {
        console.log(errors.root);
      }
    }
  }

  const { isOpen, onOpenChange, onOpen, onClose} = useDisclosure();







  return (<>
    <form onSubmit={handleSubmit(createPost, (errors) => {
      if (errors) {
        Object.values(errors).map((item: any) => {
          toast.error(item.message);
        });
      }
      
      })} className='xl:max-w-xl 2xl:max-w-3xl my-2 self-center w-full bg-white rounded-xl shadow-md'>
      
   

      <div className="w-full shadow-xl px-2 py-1 border-b border-primary-color">
        { userDocument ?  <div className="flex gap-2 items-center">
                  <Image width={45} height={54} src={userDocument.photoURL} className='w-8 h-8 rounded-full ' alt='' />
            <p>{userDocument.nickname}</p>
        </div> : <p className='flex items-center gap-2'>If you want to continue, <Link href="/login" className='text-primary-color hover:underline hover:font-bold transition-all duration-400'>Login</Link></p>}
      
        
      
          </div>
          
          <div className="flex flex-col gap-2 w-full">
        <textarea {...register('postContent', {
          min: 1, required: 'The minimum content of at least 1 charachter is required.'})} className='border-none text-sm outline-none p-1 min-h-44 max-h-56 h-full resize-none' placeholder={`What's bookin', my friend ? Describe what you've been doing recently...`}></textarea>
        <div className=" inline-flex items-center gap-3 p-2">
       {fields.map((field, index) => (
  <>
    <Button onClick={onOpen} additionalClasses='group p-0 outline-none border border-primary-color' type='transparent' key={field.id}>
      <Image src={(field as any).url} alt="" width={60} height={60} className='w-24 object-cover relative outline-none border-none top-0 left-0 before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-dark-gray/40  p-0 before:group-hover:top-0 duration-400 transition-all h-24 rounded-lg' />
    </Button>
           <ModalComponent
      modalFooterContent={
        <div className='flex gap-3 items-center'>
          <Button
            onClick={() => remove(index)}
            additionalClasses='flex gap-2 items-center bg-red-400'
            type='black'
          >
            Delete <MdDelete />
          </Button>
        </div>
      }
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      modalBodyContent={
        <div  className="w-full relative top-0 left-0 h-full">
          <Image src={(field as any).url} alt="" width={300} height={300} className="w-full h-full object-cover" />
          <LabeledInput
            key={field.id}
            inputType='text'
            placeholder='Enter Image Description...'
          defaultValue={(field as any).description}
            {...register(`postImages.${index}.description`, {
              onChange: (e) => {
                (field as any).description = e.target.value;
              },
              onBlur() {
                update(index, field)
              },
            })}
      
            additionalClasses='w-full p-2 absolute rounded-none h-12 bg-dark-gray/60 border-none bottom-0 left-0'
            type='dark'
          />
        </div>
      }
    />
  </>
))}

              </div>
          </div>
          

           <div className="w-full flex justify-between items-center shadow-xl border-t border-dark-gray px-2 py-1">
        <div className="flex gap-2 items-center">

  <TooltipProvider>
      <Tooltip delayDuration={50}>
              <TooltipTrigger type='button' onClick={openFileInput} className='text-primary-color p-2'>
            <FaImage className='text-2xl' />
            <input onChange={selectImages} multiple ref={fileInputRef} type='file' className='sm:hidden'/>
        </TooltipTrigger>
        <TooltipContent alignOffset={4} sideOffset={10} className=' bg-dark-gray border-primary-color text-white' side='bottom' align='end'>
          <p>Select Images</p>
              </TooltipContent>
            </Tooltip>

            
                 <Tooltip delayDuration={50}>
              <TooltipTrigger type='button' className='text-dark-gray p-2'>
                  <FaBookmark className='text-2xl'/>
        </TooltipTrigger>
        <TooltipContent alignOffset={4} sideOffset={10} className=' bg-dark-gray border-primary-color text-white' side='bottom' align='end'>
          <p>Attach a book, you recently read</p>
              </TooltipContent>
              
            </Tooltip>
          </TooltipProvider>   
 
              </div>
              <Button disableState={isSubmitting} isSubmit type='blue' additionalClasses='px-6 py-[0.375rem]'>Publish</Button>
        </div>
    </form>
  </>)
}

export default ActivityManager