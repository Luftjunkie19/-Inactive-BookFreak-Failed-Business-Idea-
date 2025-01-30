'use client';
import uniqid from 'uniqid';
import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import React from 'react'
import Button from 'components/buttons/Button'
import { FaBookmark, FaImage, FaUser } from 'react-icons/fa6'
import LabeledInput from 'components/input/LabeledInput'
import { useAuthContext } from 'hooks/useAuthContext';
import { toast } from 'react-hot-toast';
import useStorage from 'hooks/storage/useStorage';
import { useFieldArray, useForm } from 'react-hook-form';
import ModalComponent from 'components/modal/ModalComponent';
import { useDisclosure } from '@nextui-org/react';
import { MdDelete, MdEmojiEmotions } from 'react-icons/md';
import Link from 'next/link';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Mention, MentionItemTemplateOptions } from 'primereact/mention';

import useLoadFetch from 'hooks/useLoadFetch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import  EmojiPicker from "emoji-picker-react";

import "../../stylings/mention.css";

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

  

  const { register, control, handleSubmit, formState, reset, resetField, watch,getValues, setError, clearErrors, setValue} = useForm({
    
  });
  const { errors, isSubmitted, isSubmitting} = formState;

  const { fields, append, remove, replace, update } = useFieldArray({
    name: "postImages",
    control,
  });

    const extractedMentions = (content: string) => {
  const mentions = Array.from(content.matchAll(/@[\w\u00C0-\u017F]+/g)).map((match) => match[0]);
  return mentions.map((item)=>item.substring(1));
  };


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
          'type': 'pattern'
        });
        throw new Error('No content provided into the textarea.');
      }

      if (!user) {
        setError('You must be logged in to create a post.', {
          'message': 'You must be logged in to create a post.',
          'type': 'pattern'
        });
        throw new Error('You must be logged in to create a post.', {
          'cause': 'You must be logged in to create a post.'
        });
      }


      let postArray: { url: string, description: string }[] = [];


      // const usersMentionedInComment = extractedMentions(getValues('postContent')).map((item) => {
      
      //   if(mentionedUsers.find((user) => user.nickname.trim() === item.trim())){
      //     return mentionedUsers.find((user) => user.nickname.trim() === item.trim());
      //   }
      // });

//       console.log(usersMentionedInComment);

//       if (usersMentionedInComment.length > 0) {

     
//   usersMentionedInComment.map( (item) => {
//      fetch('/api/supabase/notification/create', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         data: {
//           type: 'postMention',
//           sentBy: userDocument.data.id,
//           directedTo: item.id,
//           mentionedInPostId: uniqueId
//         }
//       }),
//     }).then((item)=>console.log(item.json()));

//   });
// }




      if (!images || images.length > 0) {

        for (let index = 0; index < images.length; index++) {
          const postImg = images[index];
        

          const { data: imageObj, error } = await uploadImage(postImg.fileObj, `postImages`, `${user!.id}/${uniqueId}/${postImg.fileObj?.name}`);

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
            images: postArray,
            ownerId: user.id,
          }
        }),
      });
      const { data, error } = await fetchData.json();

      console.log(data, error);

      
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
      const uptd = await queryClient.invalidateQueries({ 'queryKey': ['posts'], 'type': 'all' });
      const uptd2 = await queryClient.invalidateQueries({ 'queryKey': ['swiperPosts'], 'type': 'all' });

      await Promise.all([uptd, uptd2]);

      toast.success('Successfully created a post ✅');
 

    } catch (err) {
      console.log(err);
      if (errors.root) {
        console.log(errors.root);
      }
    }
  };

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [emojiListOpen, setEmojiListOpen] = useState<boolean>(false);
  const [searchPhrase, setSearchedPhrase] = useState<string>('');
  const [mentionedUsers, setMentionedUsers] = useState<any[]>([]);


  const { data, error, isFetching, isLoading } = useQuery({
      queryKey: ['mentionUsers'],
      'queryFn': () => fetch('/api/supabase/user/getAll', {
            method: 'POST',
            headers: {
            },
           body: JSON.stringify({
             where: undefined,
             take: undefined,
             skip: undefined,
             orderBy: undefined,
             include: {
              friends:true,
              friendsStarted:true
             },
           })
         }).then((item)=>item.json())
    });

    const users:any[]= data && data.data && data.data.filter((item)=>item.id !== user?.id).map((userItem)=>{
      return {
        id: userItem.id,
        nickname: userItem.nickname,
        photoURL: userItem.photoURL,
        dateOfJoin:userItem.dateOfJoin,
        isFriend: [...userItem.friendsStarted, ...userItem.friends].filter((friendItem) => friendItem.inviterUserId === user?.id).map((friendItem) => {
          return {
            inviteeId: friendItem.inviteeId,
            inviterUserId: friendItem.inviterUserId
          }
        }).find((friendItem) => {
          return friendItem.inviteeId === user!.id || friendItem.inviterUserId === user!.id
        }),
      }
    });
  


  const itemTemplate = (suggestion: any, options: MentionItemTemplateOptions) => {
      return    options.trigger==='@' ?  (
        <div onClick={() => {
          setMentionedUsers([...mentionedUsers, { id: suggestion.id, nickname: suggestion.nickname }]);
          console.log(mentionedUsers);
            }} className="flex items-center gap-4 max-w-xs w-full">
                <Image alt={suggestion.nickname} src={suggestion.photoURL} width={32} height={32} className='rounded-full'/>
              
            <div className="flex flex-col gap-1">
                    <small className=" text-sm font-semibold text-white">{suggestion.nickname}</small>
              {suggestion.isFriend && <small className='text-xs bg-primary-color text-white px-[0.375rem] py-[0.125rem] rounded-full flex gap-2 items-center justify-center'>
                <FaUser/>
                Friend</small>}
     </div>
          
            </div>
          ) : (<div className="flex items-center gap-4 max-w-xs w-full">
          <p>{suggestion.hashTagName}</p>
          <p>{2137} posts</p>
        </div>);
    }



  return (<>
    <form id='activityManager' onSubmit={handleSubmit(createPost, (errors) => {
      if (errors) {
        console.log(errors);
        Object.values(errors).map((item: any) => {
          toast.error(item.message);
        });
      }
      })} className='xl:max-w-xl 2xl:max-w-3xl my-2 self-center w-full bg-white rounded-xl shadow-md'>
      
   

      <div className="w-full shadow-xl px-2 py-1 border-b border-primary-color">
  
        { userDocument ?  <div className="flex gap-2 items-center">
                  <Image width={45} height={54} src={userDocument.data.photoURL} className='w-8 h-8 rounded-full ' alt='' />
            <p>{userDocument.data.nickname}</p>
        </div> : <p className='flex items-center gap-2'>If you want to continue, <Link href="/login" className='text-primary-color hover:underline hover:font-bold transition-all duration-400'>Login</Link></p>}
      
        
      
      </div>
      
          
          <div className="flex flex-col gap-2 w-full">
        {users &&
     <Mention delay={-24} data-pr-autohide panelStyle={{maxWidth:'24rem', width:'100%'}}  suggestions={users.filter((item)=>(item.nickname.toLowerCase().includes(searchPhrase.toLowerCase())))} itemTemplate={itemTemplate}   {...register('postContent', {
             minLength: 1, 
          required: 'The minimum content of at least 1 charachter is required.',
          onChange: (e) => {
            setValue('postContent', e.target.value);
          }
        })}    
          field={'nickname'}
          onSearch={(e) => {
            setSearchedPhrase(e.query);
          }}
          panelClassName='bg-dark-gray border-1 z-10 border-primary-color text-white max-w-xs w-full'
          inputClassName='border-none text-sm bg-white shadow-none font-inherit outline-none p-1 min-h-44 max-h-56 h-full w-full resize-none'
           placeholder={`What's bookin', my friend ? Describe what you've been doing recently...`} 
          trigger={'@'} /> 
        }

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

          <div className='relative top-0 left-0'>
            <button onClick={()=>setEmojiListOpen(!emojiListOpen)}><MdEmojiEmotions className='text-3xl text-primary-color' /></button>
               <EmojiPicker open={emojiListOpen} onEmojiClick={(e)=>{
              setEmojiListOpen(false);
              console.log(e);
              setValue('postContent', `${getValues('postContent')}${e.emoji}`);
               }}  theme='dark' className="absolute z-10 -bottom-40  left-0" />
  </div>

          
    
              </div>
              <Button disableState={isSubmitting} isSubmit type='blue' additionalClasses='px-6 py-[0.375rem]'>Publish</Button>
        </div>
    </form>
  </>)
}

export default ActivityManager