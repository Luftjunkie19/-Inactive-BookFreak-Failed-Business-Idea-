
import React from "react";
import FormContainer from "components/forms/FormContainer";
import Form from 'components/forms/book/Form';
import { SelectValue } from "react-tailwindcss-select/dist/components/type";




export interface Book{
  title: string,
  originalTitle:string | null,
  author: string,
  coverImage: File | null,
  bookDescription: string,
  genre: SelectValue
  pages: number,
  isbn: number | null,
  releaseDate: Date | null,
  publishingCycle:string | null,
  publishingHouse: string | null,
  language: string,
  bookFormat: SelectValue,
  termsConsent: boolean,
  volume: string | null,
  volumeNumber: string | null,
  serie:string | null,
}

function CreateBook() {
  return (
    <div className={`px-6 py-4 sm:h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden flex flex-col gap-2 w-full `}>
      <div className="text-white">
      <p className='text-2xl font-bold'>Expand Our Bookish Database !</p>
      <p>Do we lack any book in our Database ? Insert it and help others finding this one !</p>
      </div>
     
 <FormContainer<Book>>
        <Form/>
        
       </FormContainer>

    </div>
  );
}

export default CreateBook;
