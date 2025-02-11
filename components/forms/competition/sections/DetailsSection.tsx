'use client';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import LabeledInput from 'components/input/LabeledInput';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { HiOutlineInformationCircle, HiOutlineUpload } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import Select from 'react-tailwindcss-select';
import translations from '../../../../assets/translations/FormsTranslations.json';
import alertMessages from '../../../../assets/translations/AlertMessages.json';
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';
import Image from 'next/image';
type Props = {}

function DetailsSection({ }: Props) {
    const [previewImage, setPreviewImage] = useState<string>();
    const [competitionName, setCompetitionName] = useState<SelectValue>();
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
    const { register, setValue, watch, clearErrors } = useFormContext();
    const competitionLogoFileRef = useRef<HTMLInputElement>(null);
   const handleSelect = (e) => {
    clearErrors('competitionLogo');

    let selected = e.target.files[0];

  if (!selected) {
    toast.error('No image selected');
  }

  
  if (selected?.size > 1048576) {
        toast.error('To big Image selected');
      return;
    }

  if (!selected.type.includes("image")) {
        toast.error(alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]);
      //dispatch(snackbarActions.showMessage({ message: `${alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]}`, alertType: "error" }));
      return;
    }


        setValue('competitionLogo', selected);  
      
    if (selected.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setPreviewImage(fileReader.result as string);
      };
          clearErrors('competitionLogo');
      return;
    }
  };

       const competitionTypes = [
    { value: "Reading Blitz", 
      label: translations.competitionTypes.first[selectedLanguage] 
    },
    {
      value: "Quest for Companions",
      label: translations.competitionTypes.second[selectedLanguage],
    },
    { 
      value: "SkillForge Trials", 
      label: translations.competitionTypes.third[selectedLanguage] 
    },
  ];

  return (
          <div className="flex py-4 gap-12">

          <div className="w-56 cursor-pointer h-56 rounded-lg bg-white justify-center items-center flex">
        <input className='hidden' {...register('competitionLogo', {
          validate: {
                  noValue: ()=> watch('competitionLogo') || 'No image uploaded !'
                }
              })}  onChange={handleSelect} ref={competitionLogoFileRef} type='file' name='' />
              {previewImage ? <div onClick={()=>{
          competitionLogoFileRef?.current?.click();
              }} className='relative group top-0 left-0 h-full w-full rounded-lg overflow-hidden'>
                  <div className="absolute z-10 top-full left-0 w-full h-full bg-dark-gray/50 group-hover:top-0 transition-all flex justify-center items-center flex-col gap-2">
                      <HiOutlineUpload className='text-5xl text-primary-color' />
                      <p className='text-xs text-center text-white'>Upload Different Logo</p>
                  </div>
                  <Image width={50} height={60} className='w-full h-full rounded-lg object-cover' src={previewImage} alt='' />
              </div> : <div  onClick={()=>{
          competitionLogoFileRef?.current?.click();
              }} className='flex w-full flex-col items-center gap-2'>
                      <HiOutlineUpload className='text-5xl text-primary-color' />
                      <p className='text-xs text-center text-dark-gray'>Upload Different Logo</p>
              </div>}
</div>
          
          
<div className="grid max-w-2xl h-fit self-center w-full gap-4 grid-flow-dense xl:grid-cols-2">
        <LabeledInput  {...register('competitionTitle', {
              onChange(event) {
                setValue('competitionTitle', event.target.value);
              },
                  validate: {
                noTitleProvided:(value)=>    watch('competitionTitle').trim().length >= 15 || 'You have to call your competition with at least 15 characters'
              },
            })} additionalClasses="max-w-xs w-full p-2" label="Competition Name" type={"dark"} />
          
          <div  className="flex flex-col gap-1">
            <div className="flex gap-2 items-center">
              <p className='text-white hint-btn'>Competition Type</p>
                <TooltipProvider>
      <Tooltip delayDuration={50}>
              <TooltipTrigger type='button' className='text-primary-color'>
              <HiOutlineInformationCircle className="text-2xl animate-pulse text-primary-color" />
        </TooltipTrigger>
        <TooltipContent alignOffset={4} sideOffset={10} className=' bg-dark-gray sm:min-w-72 lg:min-w-96 xl:min-w-[28rem] max-w-lg w-full overflow-x-hidden border-primary-color text-white' side='bottom' align='start'>
          <p>Types Of Competition Rules</p>
                    <div className="flex flex-col gap-2">
                  <div className="flex gap-1 flex-col">
                     
                          
<p>1. Reading Blitz</p>
<p>
Speed and efficiency are key in this competition. It rewards you for setting reading goals, staying organized, and meeting your targets within a set timeframe.
</p>


<p>2. Quest for Companions</p>
<p>Here, the emphasis is on collaboration and engagement with others. You earn recognition by sharing recommendations, starting discussions, and building connections within the reading community. </p>

<p>3. Skillforge Trials</p>
<p>
This competition focuses on testing your reading consistency and skill. You earn rewards for hitting reading milestones, staying consistent, and achieving personal goals.
</p>
                  </div>

          </div>
              </TooltipContent>
                </Tooltip>
                </TooltipProvider>

            </div>
            
            <Select  classNames={{
              'menu':'bg-dark-gray w-full max-w-xs transition-all rounded-lg border-2 border-primary-color p-1 offset-2 absolute -bottom-32 left-0',
              menuButton: (value) => 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color',
          }} primaryColor='' value={competitionName as SelectValue} {...register('competitionsName', {
                validate: {
                noCompetitionTypeSelected:(value)=> watch('competitionsName') || 'You have not selected the competition type.'
              },
          })} onChange={(value) => {
            setCompetitionName(value);
            setValue('competitionsName', (value as any).value);
}} options={competitionTypes} />
          </div>

             <div className="flex flex-col gap-1">
              <p className="text-white text-base">Expiration Date</p>
            <Popover>
      <PopoverTrigger asChild>
        <div className="flex gap-2 cursor-pointer items-center text-white bg-dark-gray py-2 px-4 h-fit max-w-xs w-full rounded-lg border-2 border-primary-color"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {watch('expiresAt') ? format(watch('expiresAt'), "PPP") : <span>Pick a date</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
                <Calendar classNames={{
                  'day_selected': 'bg-primary-color text-white',
            
                  }}
                     {...register('expiresAt', {
                       valueAsDate: true,
                       validate: {
                         noValue: (value) => {
                           if (!value) {
                             return 'No appropriate Date has been passed !';
                           }
                         },
                         todaysDate: (value) => {
                           if (value && value.getTime() < new Date().getTime()) { 
                             return `You cannot select dates earlier than today's date.`
                           }
                         },
                       },
            })}
          mode="single"
          selected={watch('expiresAt')}
                  onSelect={(day, selectedDate) => {
                    if (selectedDate.getTime() < new Date().getTime()) {
                      toast.error(`You cannot select dates earlier than today's date.`);
                      return;
                      }
                    
                      setValue('expiresAt', selectedDate);
          }}
                
                  
        />
      </PopoverContent>
            </Popover>
</div>
                       
          </div>
          </div>
  )
}

export default DetailsSection