import { useParams } from 'next/navigation';
import React from 'react'
import Image from 'next/image'
import Button from 'components/buttons/Button';
import { IoVideocam } from 'react-icons/io5';
import { BsThreeDots } from 'react-icons/bs';
import { useAuthContext } from 'hooks/useAuthContext';


type Props = {chatUsers:any[]}

function UserChatTopBar({chatUsers}: Props) {
  const {chatId}=useParams();
    const { user } = useAuthContext();


    

  return (
    <div className=' bg-dark-gray/70 w-full py-2 px-3 flex items-center'>
    <div className="flex-1 flex items-center gap-2">
     
        <Image src={chatUsers.find((chatUser)=> chatUser.id !== user!.id) && chatUsers.find((chatUser)=> chatUser.id !== user!.id).photoURL} alt='' height={50} className='w-8 h-8 rounded-full' width={50}/>

        <div className="flex flex-col text-white">
            <p className='text-sm'>{chatUsers.find((chatUser)=> chatUser.id !== user!.id) && chatUsers.find((chatUser)=> chatUser.id !== user!.id).nickname}</p>
            <p className='text-xs font-light'>Last activity 2 hours ago</p>
        </div>
    </div>
            <div className="flex items-center gap-3">
                <Button onClick={()=>{
                //   makeCall("meeting-1");
                }}  additionalClasses='text-white text-2xl' type='transparent'>
                    <IoVideocam/>
                </Button>
                <Button additionalClasses='text-white text-2xl' type='transparent'>
                    <BsThreeDots />
                </Button>
            </div>
        </div>
  )
}

export default UserChatTopBar