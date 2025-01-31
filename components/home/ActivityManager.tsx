'use client';
import uniqid from 'uniqid';
import { useCallback, useRef, useState, useEffect} from 'react';
import Image from 'next/image';
import React from 'react';
import Button from 'components/buttons/Button';
import { FaBookmark, FaImage, FaUser } from 'react-icons/fa6';
import LabeledInput from 'components/input/LabeledInput';
import { useAuthContext } from 'hooks/useAuthContext';
import { toast } from 'react-hot-toast';
import useStorage from 'hooks/storage/useStorage';
import { useFieldArray, useForm } from 'react-hook-form';
import ModalComponent from 'components/modal/ModalComponent';
import { useDisclosure } from '@nextui-org/react';
import { MdDelete, MdEdit, MdEmojiEmotions } from 'react-icons/md';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Mention, MentionItemTemplateOptions } from 'primereact/mention';
import useLoadFetch from 'hooks/useLoadFetch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import EmojiPicker from 'emoji-picker-react';
import "../../stylings/mention.css";
import Cropper from 'react-easy-crop';
type Props = {};

type PreviewImage = {
  url: string;
  description: string;
  fileObj: File;
};

type Post = {
  postContent: string;
  postImages: PreviewImage[];
};

function ActivityManager({}: Props) {
  const { user } = useAuthContext();
  const { element: userDocument } = useLoadFetch();
  const { uploadImage, uploadImageUrl } = useStorage();

  const [selectedEditImg, setSelectedEditImg] = useState<PreviewImage>();
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
  }

  const {
    register,
    control,
    handleSubmit,
    formState,
    reset,
    resetField,
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm<Post>({});

  const { errors, isSubmitting, isLoading:isFormSubmitLoading } = formState;

  const { fields, append, remove, replace } = useFieldArray({
    name: 'postImages',
    control,
  });

  const extractedMentions = useCallback((content: string) => {
    const mentions = Array.from(content.matchAll(/@[\w\u00C0-\u017F]+/g)).map(
      (match) => match[0]
    );
    return mentions.map((item) => item.substring(1));
  }, []);

  const queryClient = useQueryClient();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFileInput = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

    const selectImages = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
      const file = files[index];


       if (file.size > 100000) {
        toast.error(`Something went wrong with upload of file ${file.name}.`);
        return;
      }

      if (file.type.startsWith('image/')) {
          const reader = new FileReader();
           reader.onload = (event) => {
           append({
             url: event.target?.result as string,
              description: '',
              fileObj: file,
            });
          };

          reader.readAsDataURL(file);
      } else {
          toast.error('Only image files are allowed.');
            return;
         }
     }
    }, [append]);



  const createPost = async (formData: Post) => {
    const uniqueId = uniqid();
    const postContent = formData.postContent;
    const images = formData.postImages;
    try {
      if (!postContent || postContent.trim().length === 0) {
        setError('postContent', {
          message: 'The minimum content of at least 1 character is required.',
          type: 'pattern',
        });
        throw new Error('The minimum content of at least 1 character is required.');
      }

      if (!user) {
        setError('root', {
          message: 'You must be logged in to create a post.',
          type: 'pattern',
        });
        throw new Error('You must be logged in to create a post.', {
          cause: 'You must be logged in to create a post.',
        });
      }

      let postArray: { url: string; description: string }[] = [];


      if (images && images.length > 0) {
        for (const image of images) {
          const { data: imageObj, error } = await uploadImage(
            image.fileObj,
            `postImages`,
            `${user.id}/${uniqueId}/${image.fileObj?.name}`
          );

          if (!imageObj || error) {
             console.log(imageObj, error);
            return;
          }

          const imageUrl = await uploadImageUrl(imageObj.path, `postImages`);

          if (imageUrl) {
             postArray.push({ url: imageUrl, description: image.description });
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
          },
        }),
      });

      const { data, error } = await fetchData.json();

      if (error) {
        setError('root', {
          message: 'Error with post creation!',
          type: 'validate',
        });
        return;
      }

      reset();
      setValue('postImages', []);
      setValue('postContent', '');
     replace([]);
      clearErrors();

      const uptd = await queryClient.invalidateQueries({ queryKey: ['posts'], type: 'all' });
        const uptd2 = await queryClient.invalidateQueries({ queryKey: ['swiperPosts'], type: 'all' });

        await Promise.all([uptd, uptd2]);


      toast.success('Successfully created a post ✅');
    } catch (err) {
      console.error(err);
      if (errors.root) {
          toast.error(errors.root.message);
      }
    }
  };

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [emojiListOpen, setEmojiListOpen] = useState<boolean>(false);
  const [searchPhrase, setSearchedPhrase] = useState<string>('');



  const { data, error, isFetching, isLoading } = useQuery({
      queryKey: ['mentionUsers'],
      queryFn: async () => {
        const response = await fetch('/api/supabase/user/getAll', {
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
             })
           if(!response.ok){
              throw new Error('Failed to fetch users');
           }
          const res = await response.json();
             return res;

           }
      });


    const users:any[]= data?.data?.filter((item)=>item.id !== user?.id).map((userItem)=>{
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
    }) || [];


  const itemTemplate = (suggestion: any, options: MentionItemTemplateOptions) => {
      return    options.trigger==='@' ?  (
        <div onClick={() => {
          console.log(suggestion);


          }} className="flex items-center gap-4 max-w-xs w-full"
        >
         <Image alt={suggestion.nickname} src={suggestion.photoURL} width={32} height={32} className='rounded-full'/>

           <div className="flex flex-col gap-1">
                 <small className=" text-sm font-semibold text-white">{suggestion.nickname}</small>
              {suggestion.isFriend && <small className='text-xs bg-primary-color text-white px-[0.375rem] py-[0.125rem] rounded-full flex gap-2 items-center justify-center'>
                  <FaUser/>
                  Friend</small>}
            </div>
       </div>
    ) : (
      <div className="flex items-center gap-4 max-w-xs w-full">
        <p>{suggestion.hashTagName}</p>
        <p>{2137} posts</p>
      </div>
    );
  };




  return (
    <>
      <form
        id="activityManager"
        onSubmit={handleSubmit(createPost, (errors) => {
          if (errors) {
            console.log(errors);
            Object.values(errors).map((item: any) => {
              toast.error(item.message);
            });
          }
        })}
        className="xl:max-w-xl 2xl:max-w-3xl my-2 self-center  w-full bg-white rounded-xl shadow-md"
      >
        <div className="w-full  shadow-xl px-2 py-1 border-b border-primary-color">
          {userDocument ? (
            <div className="flex gap-2 items-center">
              <Image
                width={45}
                height={54}
                src={userDocument.data.photoURL}
                className="w-8 h-8 rounded-full "
                alt=""
              />
              <p>{userDocument.data.nickname}</p>
            </div>
          ) : (
            <p className="flex items-center gap-2">
              If you want to continue,{' '}
              <Link
                href="/login"
                className="text-primary-color hover:underline hover:font-bold transition-all duration-400"
              >
                Login
              </Link>
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2   w-full">
          {users && !isLoading ? (
              <Mention
                data-pr-autohide
               panelStyle={{maxWidth:'24rem', width:'100%', 'overflowY':'hidden'}}
               value={watch('postContent') ?? ''}
               suggestions={users.filter((item) =>
                 item.nickname.toLowerCase().includes(searchPhrase.toLowerCase())
               )}
               itemTemplate={itemTemplate}
              {...register('postContent', {
                minLength: 1,
               required: 'The minimum content of at least 1 character is required.',
               onChange: (e) => {
                 setValue('postContent',  e.target.value);
             },
              })}
               field={'nickname'}
             onSearch={(e) => {
                 setSearchedPhrase(e.query);
              }}
               panelClassName="bg-dark-gray border-1 z-10 border-primary-color text-white max-w-xs w-full"
              inputClassName="border-none text-sm bg-white shadow-none font-inherit outline-none p-1 min-h-44 max-h-44 h-full w-full resize-none"
             placeholder={`What's bookin', my friend ? Describe what you've been doing recently...`}
             trigger={'@'}
              />
           ) : (
            <Mention
                data-pr-autohide panelStyle={{maxWidth:'24rem', width:'100%', 'overflowY':'hidden'}}
              value={watch('postContent') ?? ''}
                {...register('postContent', {
                 minLength: 1,
                required: 'The minimum content of at least 1 character is required.',
                  onChange: (e) => {
                     setValue('postContent',  e.target.value);
                 },
               })}
                panelClassName="bg-dark-gray border-1 z-10 border-primary-color text-white max-w-xs w-full"
              inputClassName="border-none text-sm bg-white shadow-none font-inherit outline-none p-1 min-h-44 max-h-44 h-full w-full resize-none"
               placeholder={`What's bookin', my friend ? Describe what you've been doing recently...`}
           />
            )}
          <div className=" flex items-center gap-3 mx-2 my-1">
            {fields.map((field, index) => (
              <div
              
                 className="group p-0 w-full max-h-40 border-primary-color border-2 rounded-lg  h-full cursor-pointer relative top-0 left-0 max-w-40  outline-none"
                key={field.id}
              >
                <div className="flex items-center gap-2 z-10 p-2 justify-between absolute top-0 left-0 w-full">
                  <button onClick={(e) => {
                    e.preventDefault();
                    setSelectedEditImg(field);
                    onOpen();
                }} className="group w-7 h-7 flex justify-center items-center bg-primary-color rounded-full text-lg "><MdEdit className='text-white transition-all duration-300' /></button>
                 <button onClick={(e) => { e.preventDefault(); 
                    console.log('remove');
                  }} className="group bg-red-400 w-7 h-7 rounded-full flex justify-center items-center"><MdDelete className='text-white text-lg  transition-all duration-300' /></button>
               </div>
                <Image
                  onClick={() => {
                    setSelectedEditImg(field);
                    onOpen();
                  }}
                  src={(field as any).url}
                   alt=""
                  width={60}
                  height={60}
                    className="w-full object-cover relative outline-none  top-0 left-0 duration-400 transition-all h-full rounded-lg"
                />
                </div>
           ))}
            <ModalComponent
                modalFooterContent={
                  <div className="flex gap-3 items-center">
                    <Button
                    
                      additionalClasses="flex gap-2 items-center bg-red-400"
                      type="black"
                      onClick={onClose}
                    >
                      Delete <MdDelete />
                    </Button>
                   </div>
                }
                isOpen={isOpen}
                onOpenChange={onOpenChange}
               modalBodyContent={
                 <div className="w-full relative top-0 left-0 h-full">
                   
                   {selectedEditImg && selectedEditImg.url && <Cropper
                     image={selectedEditImg.url}
                     crop={crop}
                     zoom={zoom}
                     aspect={4 / 3}
                     onCropChange={setCrop}
                     onCropComplete={onCropComplete}
                     onZoomChange={setZoom}
                   />}
                 

                    </div>
                 }
             />
        </div>
        </div>

         <div className="w-full flex justify-between items-center shadow-xl border-t border-dark-gray px-2 py-1">
           <div className="flex gap-2 items-center">
             <TooltipProvider>
               <Tooltip delayDuration={50}>
                 <TooltipTrigger type="button" onClick={openFileInput} className="text-primary-color p-2">
                    <FaImage className="text-2xl" />
                   <input onChange={selectImages} multiple ref={fileInputRef} type="file" className="sm:hidden" />
                  </TooltipTrigger>
                 <TooltipContent alignOffset={4} sideOffset={10} className=" bg-dark-gray border-primary-color text-white" side="bottom" align="end">
                 <p>Select Images</p>
              </TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={50}>
                <TooltipTrigger type="button" className="text-dark-gray p-2">
                   <FaBookmark className="text-2xl" />
                </TooltipTrigger>
               <TooltipContent alignOffset={4} sideOffset={10} className=" bg-dark-gray border-primary-color text-white" side="bottom" align="end">
                  <p>Attach a book, you recently read</p>
                  </TooltipContent>
              </Tooltip>
             </TooltipProvider>

             <div className="relative top-0 left-0">
              <button
               onClick={(e) => {
                  e.preventDefault();
                   setEmojiListOpen(!emojiListOpen);
                 }}
               ><MdEmojiEmotions className="text-3xl text-primary-color" />
              </button>
               <EmojiPicker
                 open={emojiListOpen}
                  onEmojiClick={(e) => {
                    setEmojiListOpen(false);
                    setValue('postContent', (watch('postContent') || '') + e.emoji, { shouldTouch: true });
                  }}
                  theme="dark"
                   className={`absolute z-10 -bottom-50  left-0 ${
                     emojiListOpen ? 'opacity-100 scale-1' : 'opacity-0 scale-0'
                    } transition-all duration-400`}
               />
            </div>
          </div>
           <Button disableState={isSubmitting} isSubmit type={isSubmitting ? 'dark-blue' : 'blue'  } additionalClasses={`px-6 py-[0.375rem] transition-all duration-500 ${isFormSubmitLoading ? 'scale-90' : ''}`}>{isFormSubmitLoading ? 'Posting...' : 'Publish'}</Button>
        </div>
    </form>
    </>
   );
}

export default ActivityManager;

