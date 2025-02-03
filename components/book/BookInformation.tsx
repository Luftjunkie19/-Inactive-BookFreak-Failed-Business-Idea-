import { SelectItem, useDisclosure } from '@nextui-org/react';
import { User } from '@supabase/supabase-js';
import Button from 'components/buttons/Button';
import ModalComponent from 'components/modal/ModalComponent';
import useUsersChat from 'hooks/useUsersChat';
import Image from 'next/image';
import React from 'react'
import toast from 'react-hot-toast';
import { FaBookOpen, FaHeart, FaShare, FaStar } from 'react-icons/fa6';
import alertMessages from '../../assets/translations/AlertMessages.json';
import { useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import MultipleDropDown from 'components/drowdown/MultipleDropDown';
import Link from 'next/link';
import { BsBookmarkPlusFill, BsBookmarkStarFill, BsFillCalendarDateFill } from 'react-icons/bs';
import { IoToday } from 'react-icons/io5';
import { HiBookmark } from 'react-icons/hi';
type Props = {
    userId: string,
    data: any,
    documents: any,
    user: User | null,
    bookId: string
    
}

function BookInformation({data,documents, userId, user, bookId}: Props) {
    const { isOpen: isShareModalOpen, onOpenChange: onOpenShareModalChange, onClose: onShareModalClose, onOpen: onShareModalOpen } = useDisclosure();
      const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();
    const queryClient = useQueryClient();


    const { createIfNotExistingChat, sendSharingMessage } = useUsersChat();
      const selectedLanguage = useSelector(
        (state:any) => state.languageSelection.selectedLangugage
      );


  const sendSharedMessage = async (userObj) => {
    try {
      const chatExistence = userObj.chats.find((item) => item.users.find((item) => item.id === userId));
      console.log(chatExistence);
  
      if (user && !chatExistence) {
        const chatId = await createIfNotExistingChat([userObj.id, userId], user);
        console.log(chatId);
        await sendSharingMessage(chatId.data.id, 'book', userId, undefined, undefined, bookId, undefined,userObj.id);
      } else {
        await sendSharingMessage(chatExistence.id, 'book', userId, undefined, undefined, bookId,undefined, userObj.id);
      }

      toast.success(alertMessages.notifications.successfull.copied[selectedLanguage]);
      onShareModalClose();
      
    } catch (err) {
      console.log(err);
    } 
    }
    

     const {  mutateAsync } = useMutation({
        mutationKey: ['changeBookLoverState'],
        mutationFn: async () => {
            if (!data.lovedBy.find((item) => item.user.id === user!.id)) {
                const response = await fetch('/api/supabase/bookLover/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ data: { userId: user!.id, bookId, bookLoverDate: new Date() } })
                });
            } else {
                const response = await fetch('/api/supabase/bookLover/delete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ where: { userId: user!.id, id: data.lovedBy.find((item) => item.user.id === userId).id } })
                });
        
                console.log(await response.json())

            }
        }, onSuccess: async () => {
            await queryClient.invalidateQueries({ 'queryKey': ['book', bookId], 'type': 'all' })
        }
    });

     const createOrUpdateShelf = async (shelfName: string) => {
    try {
      if (user) {
  const userDocument = await fetch('/api/supabase/user/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: user && user.id,
          include: { BookLover: { include:{user: true, Book: true} }, bookShelfs: { include:{user: true, books: true} } }
        })
      }).then((res) => res.json());
      console.log(userDocument);  
      
if (userDocument && userDocument.data) {
      const res = await fetch('/api/supabase/shelf/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            shelfId: userDocument.data.bookShelfs.find((item) => item.name === shelfName) && userDocument.data.bookShelfs.find((item) => item.name === shelfName)!.id || crypto.randomUUID(),
            userId: user!.id,
            name: shelfName,
            belovedBooksIds: [{ id:bookId }],   
            wantsToDelete:false,
          }
        }),
      });
      const fetchedRes = await res.json();
      console.log(fetchedRes);

      if (userDocument.data.bookShelfs.find((item) => item.name === shelfName).books.find((book) => book.id === bookId)) {
          const res = await fetch('/api/supabase/shelf/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: {
            shelfId: userDocument.data.bookShelfs.find((item) => item.name === shelfName)!.id,
            userId: userId,
            name: shelfName,
            belovedBooksIds: [{ id:bookId }],
            wantsToDelete:true,
          }
        }),
      });
      const fetchedRes = await res.json();
      console.log(fetchedRes);
      }

    }
}
      
     } catch (err) {
      console.log(err);
}
    }


  return (
      <div className="flex flex-col gap-2 mx-auto max-w-5xl w-full p-2">
        <div className="flex justify-between max-w-5xl w-full items-center ">
          <Image src={data.bookCover} className='w-52 h-72 rounded-lg object-cover' width={35} height={59} alt='' />
          <div className="text-white flex flex-col w-full max-w-xl gap-2">
            <p className='text-4xl font-black'>{data.title}</p>
            <p className='text-lg'>{data.bookAuthor}</p>
            <p className='font-light'>{data.genre}</p>
            <div className="">
            
            </div>
            <div className="flex gap-1 ">
                <div className="flex gap-1 items-center">
      
              <FaStar className='text-4xl text-yellow-600'/>
                  <p className=' text-yellow-600 font-semibold text-4xl'>{isNaN(((data.recensions).reduce((a, b) => a.rating + b.rating, 0) / data.recensions.length)) ? (0).toFixed(2) :  ((data.recensions).reduce((a, b) => a.rating + b.rating, 0) / data.recensions.length).toFixed(2)}</p>
              </div>
                <p className='text-gray-400 font-light self-end text-sm'>out of {data.recensions.length} reviews</p>
            </div>
            <div className='flex gap-4'>
                <Button onClick={() => {
                  onOpen();
              }} type='blue' additionalClasses='flex transition-all duration-500 hover:scale-95 hover:bg-dark-gray hover:text-primary-color hover:border-primary-color  gap-4 self-end items-center px-12 h-fit py-2 '>
                  Read it <FaBookOpen />
                </Button>
                
                <ModalComponent modalBodyContent={<div className='w-full min-h-48 max-h-72 flex gap-4 justify-center items-center'>
                  <Link className='bg-primary-color h-28 max-w-36 w-full justify-center rounded-lg  p-2 flex flex-col text-white items-center gap-2' href={`/profile/dashboard/book-progress?bookId=${data.id}?readToday=false`}>
                  <BsFillCalendarDateFill className='text-2xl' />
                    <p>In the past</p>
                  </Link>
                  <Link className='bg-primary-color h-28 max-w-36 w-full justify-center items-center text-white p-2 rounded-lg flex flex-col gap-2' href={`/profile/dashboard/book-progress?bookId=${data.id}?readToday=true`}>
                  <IoToday className='text-2xl' />
                    <p>Today</p>
                  </Link>
                      </div>} modalTitle='When have you been reading ?' isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />
                      
            <ModalComponent modalBodyContent={<div className='w-full min-h-48 max-h-72 flex gap-4 justify-center items-center'>
                  <Link className='bg-primary-color h-28 max-w-36 w-full justify-center rounded-lg  p-2 flex flex-col text-white items-center gap-2' href={`/profile/dashboard/book-progress?bookId=${data.id}?readToday=false`}>
                  <BsFillCalendarDateFill className='text-2xl' />
                    <p>In the past</p>
                  </Link>
                  <Link className='bg-primary-color h-28 max-w-36 w-full justify-center items-center text-white p-2 rounded-lg flex flex-col gap-2' href={`/profile/dashboard/book-progress?bookId=${data.id}?readToday=true`}>
                  <IoToday className='text-2xl' />
                    <p>Today</p>
                  </Link>
                </div>}  modalTitle='When have you been reading ?' isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />


              <MultipleDropDown selectFunction={createOrUpdateShelf} label='Insert to shelf'>
                  <SelectItem key={'favourite'}>
                    <div className='flex text-base w-full gap-2 items-center'>
                  Favourite <BsBookmarkStarFill className='text-yellow-700 text-xl'  />
                    </div>
                </SelectItem>
                  <SelectItem key={'wishlist'} className='flex w-full gap-2 items-center' >
                    <div className='flex text-base w-full gap-2 items-center'>    
                  Wishlist <BsBookmarkPlusFill className='text-primary-color text-xl' />
                     </div>
                </SelectItem>
                  <SelectItem key={'wantread'} className='flex w-full gap-2 items-center'>
                     <div className='flex w-full text-base gap-2 items-center'>
                 Want to read <HiBookmark  className='text-primary-color text-xl' />
                     </div>
                </SelectItem>
              </MultipleDropDown>
            </div>
        </div>
        
      </div>
      
        <div className="flex items-center gap-12" >
                <Button onClick={mutateAsync} type='transparent' additionalClasses='flex gap-2 items-center'>
                    <FaHeart className={`text-3xl ${user && data.lovedBy.find((item) => item.userId === userId) ? 'text-red-400' : 'text-white'} `} />
                    <p className='text-lg text-white'>{data.lovedBy.length}</p>
                </Button>

                <Button onClick={onShareModalOpen} type='blue' additionalClasses='flex gap-4 items-center'>
                  Share <FaShare/>
                  </Button>
                  
                  

              </div>

<ModalComponent modalBodyContent={<div className='w-full min-h-48 max-h-72 flex gap-4 justify-center items-center'>
                    <div className="flex flex-col gap-4 overflow-y-auto w-full h-full">
                         {documents && documents.data && documents.data.filter((item)=>item.id !== userId).map((item) => (
                      <div key={item.id} className='text-white flex justify-between items-center'>
                        <div className="flex items-center gap-2">
                          <Image alt='' width={50} height={60}  src={item.photoURL} className='w-12 h-12 rounded-full'/>
                          <p className='text-sm'>{item.nickname}</p>
                        </div>

                             <Button onClick={async () => {
                               await sendSharedMessage(item);
                        }} type='blue'>Share</Button>
                      </div>
                    ))}
                 </div>
                 
                </div>}  modalTitle='Share with any of your friends' isOpen={isShareModalOpen} onOpenChange={onOpenShareModalChange} onClose={onShareModalClose} />
                  
      

      </div>
  )
}

export default BookInformation