'use client';

import Button from 'components/buttons/Button';
import { useAuthContext } from 'hooks/useAuthContext';
import { useRequest } from 'hooks/useRequest';
import Image from 'next/image';
import React from 'react'
import toast from 'react-hot-toast';
import { useClipboard } from 'use-clipboard-copy';

type Props = {document:{data:any | null, error:any | null}, id:string};

function Header({ document, id}: Props) {
    const clipboard = useClipboard();
      const { user } = useAuthContext();
        const { sendJoinRequest} = useRequest();
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
  <>
    <div className="relative top-0 left-0 bg-dark-gray max-h-60 h-full">
            {document && document.data &&
            <div className="absolute z-10 -bottom-16 flex gap-6 items-center  left-0 m-3">
                <Image src={document.data.clubLogo} alt='' width={60} height={60} className='w-44 z-10 h-44 object-cover rounded-lg' />
                <div className="flex flex-col gap-1">
                  <p className="text-2xl font-bold text-white">{document.data.clubName}</p>
                 <p className='text-white'>{document.data.members.length} Members</p>
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
  
      </>
  )
}

export default Header