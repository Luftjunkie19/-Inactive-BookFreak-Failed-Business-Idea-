'use client';

import { Book } from 'app/form/book/page';
import Button from 'components/buttons/Button';
import useStorage from 'hooks/storage/useStorage';
import { useAuthContext } from 'hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useForm, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import uniqid from 'uniqid';
import GeneralInfoSection from './GeneralInfoSection';
import BookDetailsSection from './BookDetailsSection';
import AdditionalSection from './AdditionalSection';

type Props = {}

function Form({ }: Props) {
    const { user } = useAuthContext();
    

    const { uploadImage, uploadImageUrl, getImageUrl } = useStorage();
  const {  setError, handleSubmit, getValues, clearErrors, getFieldState, formState, reset} = useFormContext();
    const router = useRouter();
  const { isSubmitted, errors } = formState;

  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);

    const submitForm = async (formData: Book) => {
      
        const bookId = uniqid();
        const publishingHouseId = uniqid();
        const authorId = uniqid();
        
        
        try {
            
            if (!user) {
                toast.error('You are not allowed to add any book.');
                return;
            }
     
   
   
   if (!formData.coverImage) {
     setError('coverImage', {
       'message': 'You have to upload any image as a cover to insert the book item.',
       type: 'required',
     });
     return;
   }

      const { data: imageData, error } = await uploadImage(formData.coverImage, 'bookCovers', `${bookId}/${uniqid('bookImage')}`);
      console.log(imageData, error);
   
      if (!imageData) {
        setError('coverImage', {
          'message': 'Failed to upload the image.',
          'type': 'error',
        });
             toast.error('Somethin went not correct.');
        return;
      }

      const imageUrl = await uploadImageUrl(imageData.path, 'bookCovers');

         const fetchPublishingHouse = await fetch('/api/supabase/publishingHouse/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData['publishingHouse'],
            id: publishingHouseId
          })
        });

      const { data: publishingHouseObj, error: publishingHouseError } = await fetchPublishingHouse.json();

     
      const fetchAuthor = await fetch('/api/supabase/author/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData['author'],
          id: authorId
        })
      });

      const { data: authorObj, error: authorError } = await fetchAuthor.json();
    

      
      const fetchData = await fetch('/api/supabase/book/create', {
        method: 'POST',
        body: JSON.stringify({
         
        id: bookId,
        userId: user.id,
            bookCover: imageUrl,
            title: formData['title'],
        bookAddedAt: new Date(),
        fullTitle: formData['originalTitle'],
        pages: formData['pages'],
        accessibleTypes: (formData['bookFormat'] as any).map((item)=>item.value),
        volume: formData['volume'],
        volumeNumber: formData['volumeNumber'],
        genre: (formData['genre'] as any).value,
        bookAuthor: formData['author'],
            isbn: formData['isbn'],
        bookDescription: formData['bookDescription'],
        bookPublishingHouse: formData['publishingHouse'],
        releaseDate: formData['releaseDate'],
        serie: formData['serie'] ? parseFloat(formData['serie']) : null,
        language: formData['language'],
        authorId: formData['author'] && formData['author'].trim().length > 0 ? authorId : null,
        publishingHouseId: formData['publishingHouse'] && formData['publishingHouse'].trim().length > 0 ? publishingHouseId : null
      
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { data:bookData, error:bookError } = await fetchData.json();

      console.log(bookData, bookError);

 
      reset();
   toast.success('Successfully inserted Book !');
   
 } catch (error) {
   console.log(error);
   toast.error(JSON.stringify(error));
  }
    
  
    
  };




    return (
      <>
      
        <form onSubmit={handleSubmit(submitForm, (errors) => {
      
          console.log(Object.values(getValues()).map((item) => {
            if (item === undefined) {
              return null;
            }
            return item;
          }));
  
          
          
          Object.values(errors).map((item) => (toast.error((item as any).message, {
            'className': 'delay-250 bg-dark-gray text-white border-primary-color border max-w-sm w-full',
          })))
      })}>
            
            <GeneralInfoSection />
            <BookDetailsSection />
            <AdditionalSection />
    
  
        <Button isSubmit  type='blue' additionalClasses="w-fit px-6 py-2 text-lg my-4">
          Insert
        </Button>
  </form>
      </>
     

  )
}

export default Form