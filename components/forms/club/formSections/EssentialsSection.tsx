'use client';
import React, { useRef, useState } from 'react'
import alertMessages from '../../../../assets/translations/AlertMessages.json';
import translations from '../../../../assets/translations/FormsTranslations.json';

import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlineUpload } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import LabeledInput from 'components/input/LabeledInput';

type Props = {}

function EssentialsSection({}: Props) {
      const [previewImage, setPreviewImage] = useState<string>();
const { register, setValue, watch} = useFormContext();
  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleSelect = (e) => {

    let selected = e.target.files[0];


    if (selected?.size > 200000) {
      toast.error(alertMessages.notifications.wrong.tooBigFile[selectedLanguage]);
      return;
    }

    if (!selected?.type.includes("image")) {
      toast.error(alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]);     
      return;
    }

    if (selected === null) {
      toast.error(alertMessages.notifications.wrong.selectAnything[selectedLanguage]);
   
      return;
    }

    if (selected?.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setPreviewImage(fileReader.result as string);
      };
      setValue('clubLogo', selected);
      return;
    }


  };



  return (
    <div className="flex sm:flex-col 2xl:flex-row gap-4 w-full">
    <div onClick={() => {
              if(fileInputRef.current){
                fileInputRef.current.click();
              }
            }} className="w-56 cursor-pointer group h-56 rounded-lg bg-white justify-center items-center flex">
              <input {...register('clubLogo', {
                'required': 'You have to upload an image for a logo',
             
              })} ref={fileInputRef} onChange={handleSelect}  type="file" name="" className="hidden" id="" />
              {previewImage ? <div className='w-full h-full rounded-lg relative top-0 left-0 overflow-hidden'>
                <div className="absolute z-10  flex w-full h-full flex-col items-center justify-center gap-2 top-full left-0 bg-dark-gray/40 duration-400 transition-all group-hover:top-0">
                <HiOutlineUpload className="text-5xl text-primary-color" />
              <p className='text-xs text-white'>Upload Different One</p>
                </div>
                
            </div> :  <div className="flex w-full flex-col items-center gap-2">
    <HiOutlineUpload className="text-5xl text-primary-color" />
              <p className='text-xs text-dark-gray'>Upload Club&apos;s Logo</p>
              </div>}
            </div>
    
            <LabeledInput {...register('clubName', {
              required:'You have to put your club a name',
                  onChange(event) {
                setValue('clubName', event.target.value);
                  },
                })} containerStyle='max-w-xs w-full 2xl:self-end' additionalClasses="max-w-xs w-full p-2" label="Club name" type={"dark"}  />
            </div>
  )
}

export default EssentialsSection