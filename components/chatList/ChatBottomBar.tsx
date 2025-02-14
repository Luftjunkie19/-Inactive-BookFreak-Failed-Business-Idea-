'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from 'components/buttons/Button'
import useStorage from 'hooks/storage/useStorage'
import uniqid from 'uniqid';
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { FaImage, FaMicrophone, FaPaperPlane } from 'react-icons/fa6'
import Image from 'next/image';
import { removeImageFromBucket } from 'lib/supabase/RemoveImageFromStorage';
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
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [images, setImages] = useState<{ url: string, date: Date }[]>([]);
  const [recordedAudio, setRecordedAudio] = useState<File>();
  const [audioBlob, setAudioBlob] = useState<Blob|null>();
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, uploadImageUrl} = useStorage();
  const queryClient = useQueryClient();
 const mediaStream = useRef<MediaStream | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStream.current = stream;
      mediaRecorder.current = new MediaRecorder(stream);

      if(mediaRecorder.current){
          setIsRecording(true);
      }

      mediaRecorder.current.ondataavailable = (e: BlobEvent) => {
        if (e.data.size > 0) {
          chunks.current.push(e.data);
        }
      };

      mediaRecorder.current.onstop = () => {
        const recordedBlob = new Blob(chunks.current, { type: 'audio/webm' });
        setAudioBlob(recordedBlob);
        const url = URL.createObjectURL(recordedBlob);
        setAudioUrl(url);
        chunks.current = [];
      };

      mediaRecorder.current.start();
    } catch (error) {
      console.error('Error accessing microphone:', error);
       setIsRecording(false);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
      mediaRecorder.current.stop();
    }
    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => {
        track.stop();
      });
    }
  };

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
      try{
      let audioPath

      if(audioBlob){
        const audioMessagePath= await uploadFile();
        audioPath = audioMessagePath;
      }


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
            audioMessagePath: audioBlob ? audioPath : null
          }
        }),
});
        
   

     const notificationRes= await fetch(`/api/supabase/notification/create`, {
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
        
        const notificationData = await notificationRes.json();

        console.log(notificationData);

      setMessageContent('');
        setImages([]);
        setAudioUrl(null);
        setRecordedAudio(undefined)

      } catch (err) {
        console.log(err);
        }
    }, onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: [updateQueryName, conversationId], type: 'all' });
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




  

  return (<>
    <div className="flex items-center p-2 gap-3 overflow-x-auto">
     
      {audioUrl && <>
      
        <AudioMessageCompontent isEditable onClick={() => {
          setAudioBlob(undefined);
          setAudioUrl(null);
    }}  audioUrl={audioUrl} isAudioChatMesage={false}/>
      </>}
      {images && images.length > 0 && images?.map((item) => (<Image onClick={async () => { await removeImage(item); }} width={40} height={50} className='w-12 border cursor-pointer object-cover h-12 rounded-lg' src={item.url} key={new Date(item.date).getTime()} alt={''} />))}
    </div>  
    <div className="w-full rounded-t-lg chat-bottom-bar px-3 py-3 flex justify-center items-center  text-white  bg-primary-color ">
      <div className="flex w-full  max-w-6xl justify-between items-center">
    <div className="flex gap-1 items-center text-2xl">
        <Button onClick={openFileWindow} disableState={Boolean(isAllowedToType) ? true : false} type='transparent'>
          <input multiple onChange={selectImages} ref={fileInputRef} type="file" name="filePicker" id="filePicker" className='hidden' />
          <FaImage /></Button>
        <Button additionalClasses={`transition-all duration-500 ${isRecording ? 'text-red-500 bg-white ' : ''} `} onClick={() => {
          if (isRecording) {
            stopRecording();
          } else {
            startRecording();
          }
      }}  disableState={Boolean(isAllowedToType) ? true : false} type='transparent'><FaMicrophone /></Button>
    </div>
    <textarea value={messageContent} onChange={(e)=>setMessageContent(e.target.value)} disabled={Boolean(isAllowedToType) ? true : false } className='max-w-2xl w-full max-h-12 h-full rounded-md bg-dark-gray border-2 border-secondary-color  resize-none overflow-y-auto scrollbar-hide  text-white p-1 outline-none border-none ' placeholder='Enter message...' />
      <Button onClick={mutateAsync} disableState={Boolean(isAllowedToType) ? true : false } type='transparent' additionalClasses='text-2xl text-white'><FaPaperPlane /></Button>
      </div>
  </div>
  </>
  )
}

export default ChatBottomBar