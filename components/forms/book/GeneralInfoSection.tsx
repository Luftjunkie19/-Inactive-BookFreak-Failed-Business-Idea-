'use client';

import { bookCategories } from 'assets/CreateVariables';
import LabeledInput from 'components/input/LabeledInput';
import Image from 'next/image';
import React, { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlineUpload } from 'react-icons/hi';
import { RiBook2Fill } from 'react-icons/ri';
import 'react-tailwindcss-select/dist/index.css'
import Select from "react-tailwindcss-select";
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';

type Props = {}
interface coverImage {
  file: File | null,
  url: string | null,
}
function GeneralInfoSection({ }: Props) {
    const [genreSelected, setGenreSelected] = useState<SelectValue>(null);
    const { clearErrors, register, setValue, watch } = useFormContext();
  const [editCover, setEditCover] = useState<coverImage | null>(null);
      const fileInputRef = useRef<HTMLInputElement>(null);
      const triggerInputFile = () => {
        fileInputRef.current?.click();
    }
      const handleSelect = (e) => {
    clearErrors('coverImage');
    setEditCover(null);


    let selected = e.target.files[0];

    console.log(selected);



      if (!selected) {
      //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.selectAnything[selectedLanguage]}`, alertType: "error" }));
      toast.error('No image Selected');
      setEditCover(null);
      return;
    }


    if (selected.size > 200000) {
      setEditCover(null);
      toast.error('To Big File !');
      return;
    }

    if (!selected.type.includes("image")) {
      //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]}`, alertType: "error" }));
           toast.error('Inappropriate Image Selected !');
      setEditCover(null);
      return;
    }

  

    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setEditCover({
          file: selected,
          url:fileReader.result as string,
        });
        setValue('coverImage', selected);
      };
          clearErrors('coverImage');
    }
  };

    
  return (
     <div className="flex py-2 items-center gap-12">

        <div onClick={triggerInputFile} className="w-52 group cursor-pointer relative top-0 left-0 h-72 overflow-hidden rounded-lg bg-white justify-center items-center flex">
          <input onChange={handleSelect} ref={fileInputRef} type="file"  className="hidden" id="" />
            {editCover && editCover.url ? <>   
              <Image width={60} height={60} src={editCover.url} alt="" className="w-full duration-400 transition-all rounded-lg object-cover h-full" /> 
              <div className="h-full flex items-center gap-3 flex-col justify-center group-hover:top-0 duration-500 transition-all w-full absolute bg-dark-gray/50 rounded-lg -top-full left-0">
              <HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-white'>Upload Image</p>
              </div>
            </>
             : <div className="flex w-full flex-col items-center gap-2">
<HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-dark-gray'>Upload Image</p>
          </div>
       }  
 </div>
        <div className="flex flex-col gap-2 max-w-2xl w-full">
<p className="text-2xl text-white font-semibold flex gap-2 items-center"><RiBook2Fill className="text-4xl"/>  <span>General Book Information</span></p>
<div className="grid gap-4 grid-flow-dense xl:grid-cols-2">
              <LabeledInput {...register('title', {
                required: 'You have to provide the book title in order to insert the book to our database !',
                onChange: (e) => {
                  setValue('title', e.target.value)
                },
                validate: {
                  notEmpty: (value) => value.trim() !== '' || 'The book field cannot be empty !',
                },
              })}  additionalClasses="max-w-xs p-2 w-full" label="Book Title" type={"dark"}  />
              <LabeledInput {...register('originalTitle', {
                           onChange: (e) => {
                  setValue('originalTitle', e.target.value)
                }
                        })} additionalClasses="max-w-xs w-full p-2" label="Original Book Title" type={"dark"} />
              <LabeledInput  {...register('author', {
                                  onChange: (e) => {
                  setValue('author', e.target.value)
                },
                required: 'You have to provide the book title in order to insert the book to our database !',
                validate: {
                  notEmpty: (value) => value.trim() !== '' || 'The author field cannot be empty !',
                },  
              })} additionalClasses="max-w-xs w-full p-2" label="Author" type={"dark"} />

                <div className="flex flex-col gap-1">
              <p className='text-white'>Accessible Book Types</p>
              <Select  {...register('genre', {
              required:'You have to provide the genre to problemlessly insert the book !'
            })} classNames={{
                'tagItemText': '',
                'tagItemIconContainer': '',
                'list': '',
                'menu': '',
                menuButton: (value)=>'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color'
                
                  }} value={genreSelected} primaryColor='' onChange={(value) => {
                    console.log(value);
                    setGenreSelected(value);
                if(value) setValue('genre', (value as any));
              }} options={bookCategories} />
          </div>
</div>
        </div>


      </div>
  )
}

export default GeneralInfoSection