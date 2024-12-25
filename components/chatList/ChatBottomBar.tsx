import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from 'components/buttons/Button'
import useStorage from 'hooks/storage/useStorage'
import uniqid from 'uniqid';
import React, { useEffect, useMemo, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaImage, FaMicrophone, FaPaperPlane } from 'react-icons/fa6'
import Image from 'next/image';
import { removeImageFromBucket } from 'lib/supabase/RemoveImageFromStorage';
import { useAudioRecorder } from 'hooks/useAudioRecorder';
import AudioMessageCompontent from './chat-bubbles/AudioMessage';





type Props = { isAllowedToType: boolean | any, 
  directUserId?: string,
  userId?: string, 
  chatId: string, 
  updateQueryName: 'competition' | 'userChat' | 'club',
  conversationId?: string
}

function ChatBottomBar({ isAllowedToType, directUserId, conversationId, userId, chatId, updateQueryName}: Props) {
  const [messageContent, setMessageContent] = useState<string>();
  const [images, setImages] = useState<{ url: string, date: Date }[]>([]);
  const [recordedAudio, setRecordedAudio] = useState<File>();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { uploadImage, uploadImageUrl} = useStorage();
  const queryClient = useQueryClient();
  




     const uploadFile = async () => {
        const { data: uploadData, error } = await uploadImage(new Blob([(audioBlob as Blob)], {'type':'audio/mp3'}), 'ChatAudioMessage', `${chatId}/${userId}/${uniqid('messsageImage')}`);
       console.log(uploadData, error);
       
       if (!uploadData) { 
         toast.error('Failed to upload file');
         return;
       }

       const upload = await uploadImageUrl(uploadData.path, 'ChatAudioMessage');

       console.log(upload);

       return upload;
      };



  const { mutateAsync } = useMutation({
    'mutationFn': async () => {


      const audioMessagePath= await uploadFile();


      await fetch('/api/supabase/message/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            sentAt: new Date(),
            senderId: userId,
            content: messageContent,
            chatId,
            images,
            audioMessagePath: audioMessagePath ?? null
          }
        }),
      });

      await fetch(`/api/supabase/notification/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            receivedAt: new Date(),
            type: "directMessage",
            newMessage: {
              chatId,
              content: images.length > 0 ? `${images.length}` : messageContent,
              isSentImages: images.length > 0 ? true : false,
            },
            sentBy: userId,
            directedTo: directUserId
          }
        }),
      });

      setMessageContent('');
      setImages([]);
    }, onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: [updateQueryName, conversationId], type: 'active' });
    }
  });

  const openFileWindow = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const selectImages = (e) => {
    const filteredFiles = Array.from(e.target.files).filter((item:File)=> item.type.includes('image') && item.size < 100000);
   
    console.log(filteredFiles);

    if (filteredFiles.length === 0) { 
      toast.error('No files has fit the requirements');
    }

    filteredFiles.map(async (item: File) => {
      const { data: imageData, error } = await uploadImage(item, 'chatMessageImages', `${chatId}/${uniqid('messsageImage')}`);
      console.log(imageData, error);
   
      if (!imageData) {
        toast.error('Somethin went not correct.');
        return
      }

      const imageUrl = await uploadImageUrl(imageData.path, 'chatMessageImages');

      console.log(imageUrl);

      if (imageUrl) {
        setImages((value) => [...value, { url: imageUrl, date: new Date() }]);
      }
    });
    
  
  }

  const removeImage = async (image:{url:string, date:Date}) => {
    const removed = await removeImageFromBucket('chatMessageImages', [image.url]);
    console.log(removed);
    setImages((value) => value.filter((item) => item.url !== image.url));
  }

    const { isRecording, audioBlob, startRecording, stopRecording, requestPermission, permission, audioChunksRef, mediaRecorderRef } = useAudioRecorder();

 

   
  const handleRecordClick = async () => {

    console.log(permission);

       if (!isRecording && permission==='granted') {
          startRecording();
    }


    // Request permission if not granted
    if (!isRecording && (permission ==='denied' || permission === 'prompt')) {
      await requestPermission();
      startRecording();
      
    }

 
    
    if (isRecording) {
      stopRecording();


      const blobToFile=new File([(audioBlob as Blob)], `${chatId}/${userId}/${uniqid('messsageAudio')}`, { type: (audioBlob as Blob).type })
  
      const fileReader = new FileReader();

      fileReader.readAsDataURL(blobToFile);

      fileReader.onload = () => { 
        setAudioUrl(fileReader.result as string);
      }

      setRecordedAudio(blobToFile);

    
    }
  };




  return (<>
    <div className="flex items-center p-2 gap-3 overflow-x-auto ">
     
      { audioUrl && <>
    <AudioMessageCompontent audioUrl={audioUrl}/>
      </>}
      {images && images.length > 0 && images?.map((item) => (<Image onClick={async () => { await removeImage(item); }} width={40} height={50} className='w-12 border cursor-pointer object-cover h-12 rounded-lg' src={item.url} key={new Date(item.date).getTime()} alt={''} />))}
    </div>  
    <div className="w-full chat-bottom-bar px-2 py-3 flex justify-between text-white items-center bg-primary-color ">
    <div className="flex gap-1 items-center text-xl">
        <Button onClick={openFileWindow} disableState={Boolean(isAllowedToType) ? true : false} type='transparent'>
          <input multiple onChange={selectImages} ref={fileInputRef} type="file" name="filePicker" id="filePicker" className='hidden' />
          <FaImage /></Button>
      <Button additionalClasses={`transition-all duration-500 ${isRecording ? 'text-red-500 bg-white ' : ''} `}  onClick={handleRecordClick}  disableState={Boolean(isAllowedToType) ? true : false} type='transparent'><FaMicrophone /></Button>
    </div>
    <input value={messageContent} onChange={(e)=>setMessageContent(e.target.value)} disabled={Boolean(isAllowedToType) ? true : false } className='max-w-3xl h-fit overflow-y-auto w-full bg-transparent text-white p-2 outline-none border-none' placeholder='Enter message...' />
      <Button onClick={mutateAsync} disableState={Boolean(isAllowedToType) ? true : false } type='transparent' additionalClasses='text-2xl text-white'><FaPaperPlane /></Button>
  </div>
  </>
  )
}

export default ChatBottomBar