'use client';


import {
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

import { useClipboard } from 'use-clipboard-copy';

import alertMessages from '../../assets/translations/AlertMessages.json';
import translations from '../../assets/translations/BookPageTranslations.json';
import reuseableTranslations
  from '../../assets/translations/ReusableTranslations.json';

import RecensionsForBook from '../../components/book/RecensionsForBook';


import { useAuthContext } from '../../hooks/useAuthContext';
// import EditBook from '../Forms&FormsPages/EditBook';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Chip, DropdownItem, Modal, ModalBody, ModalContent, ModalHeader, SelectItem, Tab, Tabs, useDisclosure } from '@nextui-org/react';

import { useQuery } from '@tanstack/react-query';

import BookDetails from './BookDetails';
import BookInformation from './BookInformation';


type Props = {id:string}

function BookContainer({id }: Props) {
     const { data: document, isError, isFetching, isLoading } = useQuery({
    queryKey: ['book', id], queryFn: () => fetch('/api/supabase/book/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        where: { id: id },
        include: {
            'lovedBy': {
              include: {
                'user': true,
            }},
            'recensions': {include:{'user':true} },
            'publishingHouse': true,
            'addedBy':true,
          }
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
          include: {
              chats: {
                  include: { users: true },
              },
             ReadingProgress:{include:{'book':true}},
             recensions:true,
          },
         take:undefined,
            skip:undefined,
            orderBy:undefined
      })
    }).then((res) => res.json())
  });


  const { user } = useAuthContext();

  return (
      <>
              {document && document.data && <>
    
              <BookInformation data={document.data} documents={documents} userId={user!.id} user={user} bookId={id} />

              <BookDetails bookData={document.data} />
        
        
              {
                  documents && documents.data && 
                <>
                   

          <RecensionsForBook  bookId={id}  hasReadBook={documents.data.find((userObj)=>userObj.id === user?.id).ReadingProgress.filter((item)=>item.bookId === id).reduce((prev, cur)=> prev + cur.pagesRead, 0) === document.data.pages} hasRecension={document.data.recensions.find((item)=>item.user.id === user?.id) ? true : false} recensions={document.data.recensions}  />
                </>
              }
      
      </>}
    </>
  )
}

export default BookContainer