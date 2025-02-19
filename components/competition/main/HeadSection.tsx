import { User } from '@supabase/supabase-js';
import { useQueryClient } from '@tanstack/react-query';
import Button from 'components/buttons/Button'
import { useRequest } from 'hooks/useRequest';
import Image from 'next/image'
import React, { useMemo } from 'react'
import toast from 'react-hot-toast';
import { useClipboard } from 'use-clipboard-copy';

type Props = { document: { data?: any, error?: any }, id:string, user:User | null}

function HeadSection({document, id, user}: Props) {

    const { sendJoinRequest } = useRequest();
  const clipboard = useClipboard();
  
  const queryClient = useQueryClient();
    
  const copyLinkTo = () => {
    clipboard.copy(location.href);
  }

  const hasSentRequest = useMemo(() => {
   return document && user && document.data && document.data.requests.find((item) => item.userId === user.id) ? true : false
  }, [document, user]);

  const sendCompetitionRequest = async () => {
    try { 
      if (user && document && !hasSentRequest) {
        await sendJoinRequest(user, 'competition', id as string, document.data.members.find((item) => item.isCreator).user.id);
        toast.success('Successfully sent the request to join the competition !');
await queryClient.invalidateQueries({ queryKey: ['competition', id], type: 'all' });
        return;
      }     

      toast.error('You have already sent the request to join the competition !')

    } catch (err) {
      console.error(err);
      toast.error('Error sending the request to join the competition !');
    }
  }


    return (
   
      <div className="flex flex-col sm:gap-14 xl:gap-0">
      <div className={`relative w-full bg-dark-gray top-0 left-0 h-64 `}>
          {document && document.data && 
        <div className="absolute z-10 -bottom-16 flex gap-6 items-center  left-0 m-3">
            <Image src={document.data.competitionLogo} alt='' width={60} height={60} className='sm:w-24 sm:h-24 xl:w-44 z-10 xl:h-44 object-cover rounded-lg' />
            <div className="flex flex-col gap-1">
              <p className="text-2xl font-bold text-white">{document.data.competitionName}</p>
              <p className='text-white'>{document.data.members && document.data.members.length} Members</p>
              <div className="flex">
                  {document && document.data.members.map((item) => (<Image key={item.id} src={item.user.photoURL} alt="" width={60} height={60} className='w-8 h-8 rounded-full object-cover' />))}
                  
              </div>
            </div>
          
        </div>
          }
      </div>

      <div className="flex overflow-x-auto justify-end items-center gap-2 p-2">
        <Button onClick={copyLinkTo} additionalClasses='px-6 py-[0.375rem]' type={'blue'} >
Share
        </Button>

        {document && document.data && document.data.members && user && !document.data.members.find((item)=>item.user.id === user.id) &&   
           <Button disableState={hasSentRequest} onClick={sendCompetitionRequest} additionalClasses='px-6 py-[0.375rem] text-nowrap' type={hasSentRequest ? 'dark-blue' : 'white-blue'} >
              {hasSentRequest ? "Request Sent ✅" : "Request To Join"}
        </Button>
        }
</div>

      </div>
  )
}

export default HeadSection