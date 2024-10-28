'use client';


import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  FaHeart,
  FaPencilAlt,
  FaShare,
  FaTrash,
} from 'react-icons/fa';
import { MdBookmarkAdd, MdBookmarkRemove } from 'react-icons/md';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import uniqid from 'uniqid';
import { useClipboard } from 'use-clipboard-copy';

import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/BookPageTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
// import LikersList from '../../../components/book/LikersList';
import RecensionsForBook from '../../../components/book/RecensionsForBook';
// import CompetitionMembers
//   from '../../components/CommunityComponents/CompetitionMembers';
import Loader from '../../../components/Loader';
import { modalActions } from '../../../context/ModalContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
// import EditBook from '../Forms&FormsPages/EditBook';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Chip, DropdownItem, Modal, ModalBody, ModalContent, ModalHeader, SelectItem, Tab, Tabs, useDisclosure } from '@nextui-org/react';
import { IoMdBookmarks } from 'react-icons/io';
import { IoBook, IoChatbubbleSharp, IoToday } from 'react-icons/io5';
import { FaBookBookmark, FaBookOpen, FaStar, FaStarOfLife } from 'react-icons/fa6';
import { Separator } from '@/components/ui/separator';
import { GrUpdate } from 'react-icons/gr';
import RemoveBtn from 'components/buttons/RemoveBtn';
import { Rating } from 'primereact/rating';
import { GoStar, GoStarFill } from 'react-icons/go';
import { GiWhiteBook } from 'react-icons/gi';
import { BsBookmarkHeartFill, BsBookmarkPlusFill, BsBookmarkStarFill, BsFillCalendarDateFill } from 'react-icons/bs';
import Button from 'components/buttons/Button';
import MultipleDropDown from 'components/drowdown/MultipleDropDown';
import BookAd from 'components/advertisements/BookAd';
import LabeledInput from 'components/input/LabeledInput';
import Recension from 'components/elements/recension/Recension';
import SingleDropDown from 'components/drowdown/SingleDropDown';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format, formatDistanceToNow } from 'date-fns';
import { HiBookmark } from 'react-icons/hi';
import ModalComponent from 'components/modal/ModalComponent';
import Link from 'next/link';
import useUsersChat from 'hooks/useUsersChat';

function Book({ params }: { params: { bookId: string } }) {
  const { bookId: id } = params;
  const dispatch=useDispatch();
  const navigate = useRouter();
  const { user } = useAuthContext();
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const [showLikers, setShowLikers] = useState(false);
  const [addShelf, setAddShelf] = useState(false);

  const { data: document, isError, isFetching, isLoading } = useQuery({
    queryKey: ['book'], queryFn: () => fetch('/api/supabase/book/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        where: { id: id },
        include:{lovedBy:{user:true, book:true}}
      })
    }).then((res) => res.json())
  });


  
  const { data: documents } = useQuery({
    queryKey: ['inviteUsers'], queryFn: () => fetch('/api/supabase/user/getAll', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        where: undefined,
        include: {chats:{include:{users:true}}},
         take:undefined,
            skip:undefined,
            orderBy:undefined
      })
    }).then((res) => res.json())
  });

  const queryClient = useQueryClient();


  const { mutate, mutateAsync } = useMutation({
    mutationKey: ['changeBookLoverState'],
    mutationFn: async () => {
      if (!document.data.lovedBy.find((item) => item.user.id === user!.id)) {
        const response = await fetch('/api/supabase/bookLover/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({data:{userId:user!.id, bookId:id, bookLoverDate:new Date()}})
        });
      } else {
                const response = await fetch('/api/supabase/bookLover/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
                  body: JSON.stringify({ where:{userId:user!.id}})
        });

         }
    }, onSuccess: async () => {
      await queryClient.refetchQueries({'queryKey':['book'], 'type':'active'})
    }
  })




  const { isOpen, onOpenChange, onClose, onOpen } = useDisclosure();


    const { isOpen:isShareModalOpen, onOpenChange:onOpenShareModalChange, onClose:onShareModalClose, onOpen:onShareModalOpen } = useDisclosure();

  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const isOpened = useSelector((state:any) => state.modal.isOpened);
  const clipboard = useClipboard();

  const copyPathName = () => {
    clipboard.copy(window.location.href);
    toast.success('Successfully copied !');
    // dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.copied[selectedLanguage]}`, alertType:"success"}));
  };

  // const removeFromShelf = () => {
  //   if (user) {
  //     if(readers.filter((doc:any)=>doc.bookReadingId===id).length === 1){
  //       removeFromDataBase(`bookReaders`, `${id}`);
  //     }else{
  //       removeFromDataBase(`bookReaders`, `${id}/readers/${user.uid}`);
  //       removeFromDataBase(`bookRecensions`, `${id}/recensions/${user.uid}`);
      
  //     }
  //   }

  // };

  // const addToShelf = (hasStarted, hasFinished, readPages) => {
  //   if (user) { 
  //        
  // };

  //   const updateReaderState = (hasStarted, hasFinished, readPages) => {
  //     if (user) {   
  //       if (document.data.pagesNumber > readPages) {
  //         removeFromDataBase(`bookRecensions`, `${id}/recensions/${user.uid}`);
  //       }
    
  //       addToDataBase("bookReaders", `${id}/readers/${user.uid}`, {
  //         bookRate: 0,
  //         bookReadingId: id,
  //         displayName: user.displayName,
  //         email: user.email,
  //         hasFinished,
  //         id: user.uid,
  //         pagesRead: readPages,
  //         startedReading: hasStarted,
  //         dateOfFinish: hasFinished ? new Date().getTime() : null,
  //         recension: "",
  //         photoURL: user.photoURL,
  //       });
  //   }
  //   }
  // };

 

//   const closeListsOfUsers = () => {

//   };

//   const recommendToUser = async (receiverId: string) => {
//     if (user) {
//        const firstPossibility = `${user.uid}-${receiverId}`;
//     const secondPossibility = `${receiverId}-${user.uid}`;

//     const existingChat1 = await getdocument.data("usersChats", firstPossibility);
//     const existingChat2 = await getdocument.data("usersChats", secondPossibility);

//     let chatId;

//     if (existingChat1 || existingChat2) {
//       chatId = existingChat1 ? firstPossibility : secondPossibility;
//     } else {
//       chatId = firstPossibility;

//       addToDataBase("usersChats", firstPossibility, {
//         chatId: firstPossibility,
//         createdAt: new Date().getTime(),
//       });

//       addToDataBase("entitledToChat", `${firstPossibility}/${user.uid}`, {
//         entitledUserId: user.uid,
//         entitledChatId: firstPossibility,
//       });

//       addToDataBase("entitledToChat", `${firstPossibility}/${receiverId}`, {
//         entitledUserId: receiverId,
//         entitledChatId: firstPossibility,
//       });
//     }
   
//     const messageId = `${chatId}/${new Date().getTime()}${uniqid()}`;

//     addToDataBase("usersChatMessages", messageId, {
//       content: document.data.photoURL,
//       message: `Hi, I want to recommend you the book ${document.data.title} written by ${document.data.author}.`,
//       chatId: chatId,
//       sender: {
//         id: user.uid,
//       },
//       receiver: {
//         id: receiverId,
//       },
//       sentAt: new Date().getTime(),
//     });

//     addToDataBase("recommendations", messageId, {
//       content: document.data.photoURL,
//       message: `Hi, I want to recommend you the book ${document.data.title} written by ${document.data.author}.`,
//       chatId: chatId,
//       messageId,
//       sender: {
//         id: user.uid,
//       },
//       receiver: {
//         id: receiverId,
//       },
//       sentAt: new Date().getTime(),
//     });
// // dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.send[selectedLanguage]}`, alertType:"success"}));
//     }

//   };

  const { createIfNotExistingChat, createOrRedirectNotExistingChat, sendSharingMessage } = useUsersChat();


  const sendSharedMessage = async (userObj) => {
    try {
      const chatExistence = userObj.chats.find((item) => item.users.find((item) => item.id === user!.id));
      console.log(chatExistence);
  
      if (user && !chatExistence) {
        const chatId = await createIfNotExistingChat([userObj.id, user.id], user);
        console.log(chatId);
        await sendSharingMessage(chatId.data.id, 'book', user.id, undefined, undefined, id);
      } else {
        await sendSharingMessage(chatExistence.id, 'book', user!.id, undefined, undefined, id);
      }

      toast.success('Successfully addded !');
      onShareModalClose();
      
    } catch (err) {
      console.log(err);
    } 
}
 



  return (
    <div className={` overflow-x-hidden w-full p-2`}>
      {document && document.data && <>
        <div className="flex justify-center items-center p-2">
        <div className="flex justify-between max-w-5xl w-full items-center ">
          <Image src={document.data.bookCover} className='w-52 h-72 rounded-lg object-cover' width={35} height={59} alt='' />
          <div className="text-white flex flex-col w-full max-w-xl gap-2">
            <p className='text-4xl font-black'>{document.data.title}</p>
            <p className='text-lg'>{document.data.bookAuthor}</p>
            <p className='font-light'>{document.data.genre}</p>
            <div className="">
              <div className="flex items-center gap-12">
                <Button onClick={mutateAsync} type='transparent' additionalClasses='flex gap-2'>
                  <FaHeart className='text-3xl text-white' />
                    <p className='text-xs self-end font-light'>{document.data.lovedBy.length === 0 ? 'Nobody liked this book yet' : <>
                      {document.data.lovedBy.map((item) => (<Link key={item.user.id} href={`/profile/${item.user.id}`}>{item.user.nickname}</Link>))}
                      {" "}
                      likes it
                    </>}</p>
                </Button>

                <Button onClick={onShareModalOpen} type='blue' additionalClasses='flex gap-4 items-center'>
                  Share <FaShare/>
                  </Button>
                  
                  <ModalComponent modalBodyContent={<div className='w-full min-h-48 max-h-72 flex gap-4 justify-center items-center'>
                    <div className="flex flex-col gap-4 overflow-y-auto w-full h-full">
                         {documents && documents.data && documents.data.map((item) => (
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
            </div>
            <div className="flex gap-1 ">
                <div className="flex gap-1 items-center">
      
              <FaStar className='text-4xl text-yellow-600'/>
                  <p className=' text-yellow-600 font-semibold text-4xl'>{isNaN(((document.data.recensions).reduce((a, b) => a.rating + b.rating, 0) / document.data.recensions.length)) ? (0).toFixed(2) :  ((document.data.recensions).reduce((a, b) => a.rating + b.rating, 0) / document.data.recensions.length).toFixed(2)}</p>
              </div>
                <p className='text-gray-400 font-light self-end text-sm'>out of {document.data.recensions.length} reviews</p>
            </div>
            <div className='flex gap-4'>
                <Button onClick={() => {
                  onOpen();
              }} type='blue' additionalClasses='flex transition-all duration-500 hover:scale-95 hover:bg-dark-gray hover:text-primary-color hover:border-primary-color  gap-4 self-end items-center px-12 h-fit py-2 '>
                  Read it <FaBookOpen />
                </Button>
                
                <ModalComponent modalBodyContent={<div className='w-full min-h-48 max-h-72 flex gap-4 justify-center items-center'>
                  <Link className='bg-primary-color h-28 max-w-36 w-full justify-center rounded-lg  p-2 flex flex-col text-white items-center gap-2' href={`/profile/dashboard/book-progress?bookId=${document.data.id}?readToday=false`}>
                  <BsFillCalendarDateFill className='text-2xl' />
                    <p>In the past</p>
                  </Link>
                  <Link className='bg-primary-color h-28 max-w-36 w-full justify-center items-center text-white p-2 rounded-lg flex flex-col gap-2' href={`/profile/dashboard/book-progress?bookId=${document.data.id}?readToday=true`}>
                  <IoToday className='text-2xl' />
                    <p>Today</p>
                  </Link>
                </div>}  modalTitle='When have you been reading ?' isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} />

              <MultipleDropDown label='Insert to shelf'>
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
                 Want to read <HiBookmark className='text-primary-color text-xl' />
                     </div>
                </SelectItem>
              </MultipleDropDown>
            </div>
          </div>
        </div>
      </div>
        
        <div className="flex gap-6 items-center py-4 w-full">
          <div className="flex max-w-lg w-full flex-col gap-1">
            <p className='text-white text-lg font-semibold'>Description</p>
            <div className="overflow-y-auto min-h-56 max-h-56 h-full bg-dark-gray text-white rounded-lg p-2 max-w-lg w-full">
              {document.data.bookDescription}
            </div>
       </div>
            
          <div className="max-w-sm w-full"> 
            
<p className='text-white text-lg font-semibold'>Book Details</p>
            <div className="overflow-y-auto text-white min-h-56 max-h-56 h-full bg-dark-gray flex flex-col gap-1 rounded-lg p-2 max-w-sm w-full">
              <p>Full title: {document.data.fullTitle}</p>
              <p>Genre: {document.data.genre}</p>
              <p>Pages: {document.data.pages}</p>
              <p>Released: {formatDistanceToNow(new Date(document.data.releaseDate))}</p>
            </div>
    </div>
  

          
         <BookAd/>
    

        </div>
        
      
          <RecensionsForBook  hasReadBook={false} hasRecension={document.data.recensions.find((item)=>item.user.id === user?.id)} recensions={document.data.recensions} publishRecension={function (recension: string, rate: number): void {
            console.log(recension, rate);
          } } />
          
          

      
   

      
      </>}

    </div>
  );
}

export default Book;
