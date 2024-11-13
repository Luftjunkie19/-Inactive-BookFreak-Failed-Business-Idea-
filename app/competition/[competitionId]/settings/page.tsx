'use client';
import React, { useRef, useState } from 'react'
import Link from "next/link";
import { FaInfo, FaUpload, FaUserGear } from "react-icons/fa6";
import { IoGitPullRequestSharp } from 'react-icons/io5';
import { MdAdminPanelSettings, MdDelete } from 'react-icons/md';
import translations from '../../../../assets/translations/FormsTranslations.json';
import image from '../../../../assets/Logo.png'
import { FaInfoCircle, FaPauseCircle, FaPencilAlt, FaUsers } from 'react-icons/fa';
import { RiArrowGoBackFill } from 'react-icons/ri';
import DashboardBar from 'components/Sidebars/left/competition/DashboardBar';
import AdvertisementBar from 'components/Sidebars/right/AdvertisementBar';
import Image from 'next/image';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import { IoMdDocument, IoMdSwap } from 'react-icons/io';
import { DatePicker, SelectItem, useDisclosure } from '@nextui-org/react';
import ModalComponent from 'components/modal/ModalComponent';
import SingleDropDown from 'components/drowdown/SingleDropDown';
import { PiStackPlusFill } from 'react-icons/pi';
import { GiTargetPrize } from 'react-icons/gi';
import ConditionItem from 'components/condition/ConditionItem';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Competition, Requirement, requirementOptions } from 'app/form/competition/page';
import { useForm } from 'react-hook-form';
import { Ht } from 'react-flags-select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Select from 'react-tailwindcss-select';
import { useSelector } from 'react-redux';
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';

type Props = {}

function Page() {
    const { competitionId} = useParams();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [modalRequirementContent, setModalRequirementContent]=useState<Requirement>();
     const { isOpen:isAnswerModalOpen, onOpen:onAnswerModalOpen, onOpenChange:onAnswerModalOpenChange, onClose:onAnswerModalClose} = useDisclosure();
     const answerModal=(item:Requirement)=>{
      return(<ModalComponent modalSize='sm' isOpen={isAnswerModalOpen} modalTitle='Q&A' modalBodyContent={<div>
        <p className="text-white">{item.requirementQuestion}</p>
        <p className='text-base text-white'>{item && item.requirementQuestionPossibleAnswers && item.requirementQuestionPossibleAnswers.join(', ')}</p>
      </div>} onClose={()=>{
          setModalRequirementContent(undefined);
          onAnswerModalClose();
      }} onOpenChange={()=>{
        onAnswerModalOpenChange();
      }}/>)
     }
    const imageInputRef=useRef<HTMLInputElement>(null);
    const selectedLanguage = useSelector(
      (state:any) => state.languageSelection.selectedLangugage
    );    

    const competitionTypes = [
      { value: "First read, first served", label: translations.competitionTypes.first[selectedLanguage] },
      {
        value: "Lift others, rise",
        label: translations.competitionTypes.second[selectedLanguage],
      },
      { value: "Teach to fish", label: translations.competitionTypes.third[selectedLanguage] },
    ];

  const { data: document } = useQuery({
    queryKey: ['competition'],
    queryFn: () => fetch('/api/supabase/competition/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: competitionId, include: {
          prize: true,
          members: {
            include: {
              user: true,
            },
          },
          chat: {
            include: { messages: true },
          },
          rules: true,
        }
      })
    }).then((res) => res.json())
  });

  const [previewImage, setPreviewImage] = useState<string>();

  const handleSelect = (e) => {

    let selected = e.target.files[0];


    if (selected?.size > 200000) {
      return;
    }

    if (!selected?.type.includes("image")) {
      // setError(
      //   alertMessages.notifications.wrong.inAppropriateFile[selectedLanguage]
      // );
     
      return;
    }

    if (selected === null) {
      // setError(
      //   alertMessages.notifications.wrong.selectAnything[selectedLanguage]
      // );

      return;
    }

    if (selected?.type.includes("image")) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(selected);
      fileReader.onload = () => {
        setPreviewImage(fileReader.result as string);
      };
                  setValue('competitionLogo', selected);
      return;
    }


  };

      const { register, reset, getValues, setError, clearErrors, setValue, handleSubmit } = useForm<Competition>(document && document.data && {
        
   defaultValues: {
          'competitionLogo': undefined,
          'competitionTitle': document.data.competitionName,
          'competitionsName': document.data.competitionsName,
          'description': document.data.description,
          'chargeId': document.data.chargeId,
          'expiresAt': new Date(document.data.endDate),
          'prize': document.data.prize,
          'prizeDescription': document.data.prizeDescription,
          'prizeType':document.data.prizeType,
          'prizeHandedIn':document.data.prizeHandedIn,
         
        }
    
    });

  return (
      <div className='w-full flex'>
          <DashboardBar/>
          <div className="w-full overflow-y-auto sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] overflow-x-hidden px-4 py-2 flex flex-col gap-6">
              <div className="">
              <p className='text-white flex gap-2 text-2xl items-center'><FaInfoCircle className='text-primary-color'/> Competition Info</p>
              <p className='text-sm font-light text-gray-400'>Provide Changes to the competititon if something unexpected popped into your head</p>           
              </div>
              <div className="flex flex-col gap-2">
              <div className="flex gap-6 w-full sm:flex-col 2xl:flex-row 2xl:items-center">
              <div className="flex sm:flex-wrap lg:flex-row gap-3 p-1 items-center">
                  {document && document.data && <Image src={document.data.competitionLogo} alt='' className='h-44 w-44 rounded-full' width={60} height={60}/>}
                  <div className="flex flex-col gap-1">
                      <p className='text-white font-light text-xs'>Uploaded file can be up to 50MB</p>
                      <input ref={imageInputRef} onChange={handleSelect} className='hidden' type="file" name="" id="" />
                      <Button onClick={()=>{
                        if(imageInputRef && imageInputRef.current){
                          imageInputRef.current.click();
                        }
                      }} type='blue' additionalClasses='items-center gap-2 flex w-fit'>Upload <FaUpload/></Button>
                          </div>
              </div>
                                  <LabeledInput {...register('competitionTitle', {required:'Competition name is required'})} defaultValue={getValues('competitionTitle')}  additionalClasses='p-2 min-w-80 max-w-xs w-full' label='Competition Name' type='dark'/>
            

              </div>        
              <div className="flex sm:flex-col lg:flex-row items-center w-full gap-6">
              <div className="flex flex-col gap-1">
              <p className="text-white text-base">Expiration Date</p>
            <Popover>
      <PopoverTrigger asChild>
        <div className="flex gap-2 cursor-pointer items-center text-white bg-dark-gray py-2 px-4 h-fit max-w-xs w-full rounded-lg border-2 border-primary-color"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getValues('expiresAt') ? format(new Date(getValues('expiresAt')), "PPP") : <span>Pick a date</span>}
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
          selected={new Date(getValues('expiresAt'))}
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

                   
<Select classNames={{
              menuButton: (value) => 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color',
          }} primaryColor=''  value={competitionTypes.find((item) => item.value === getValues('competitionsName')) as SelectValue} {...register('competitionsName')} onChange={(value) => {
            // setCompetitionName((value as any));
            setValue('competitionsName', (value as any).value);
}} options={competitionTypes} />
              
                  </div>

                    <div className="flex flex-col gap-2 pb-2">
        <div className="">
          <p className='text-xl text-white font-semibold'>Additional Conditions</p>
          <p className='text-xs text-gray-400'>You can add additional conditions users have to fullfill in order to join the competition.</p>
        </div>

                      <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-64 max-w-3xl  bg-dark-gray py-4 px-2 rounded-lg  h-full">{
                      document && document.data.rules.map((item)=>(<div onDoubleClick={()=>{

          }} key={item.id} className="flex cursor-pointer hover:bg-primary-color/40 transition-all duration-400 gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
            <div onClick={()=>{console.log(item)}} className='flex-1 flex flex-col gap-1 text-white'>
              <p>{requirementOptions.find((el)=>el.value === item.requirementType) && requirementOptions.find((el)=>el.value === item.requirementType)!.label}</p>
              <p className='text-xs'>{item.requiredBookType} {item.requirementQuestion}</p>
            </div>

{item.requirementQuestionPossibleAnswers && <>
<Button onClick={()=>{
  onAnswerModalOpen();
  setModalRequirementContent(item);
}} type='blue'>Answers</Button>
</>
}


{item.requiredBookRead &&  
<LabeledInput defaultValue={item.requiredBookRead} onChange={(e)=>{
    
              }} inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />}

            {item.requiredPagesRead && 
              <LabeledInput defaultValue={item.requiredPagesRead} onChange={(e)=>{
      
              }} inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />
            }
                              </div>))}
                             
                </div> 

        <Button onClick={onOpen} additionalClasses='w-fit px-4 py-2 flex items-center gap-2' type='blue'>New Condition <PiStackPlusFill/></Button>
   
                      {modalRequirementContent && answerModal(modalRequirementContent)}
   
                      <ModalComponent modalSize='xl' modalFooterContent={<div className='flex gap-3 items-center'>
            <Button type='blue' additionalClasses="w-fit  px-4 py-2">
        Append
      </Button>
 </div>} modalTitle='Additional Conditions' modalBodyContent={<div className='flex flex-col gap-3'>
                                    
          <SingleDropDown label='Type of Rule' >
     <SelectItem key={'rule1'}>Min. Read Pages of Genre</SelectItem>
         <SelectItem key={'rule1'}>Min. Read Books of Genre</SelectItem>
     <SelectItem key={'rule2'}>Min. Read Books Amount</SelectItem>
     <SelectItem key={'rule2'}>Min. Read Pages Amount</SelectItem>
          <SelectItem key={'rule2'}>Peculiar Question</SelectItem>
   </SingleDropDown>
   
  <LabeledInput  additionalClasses="max-w-sm w-full p-2" label="Question" type={"dark"} />


           <SingleDropDown label='Answer Accessment'>
     <SelectItem key={'rule1'}>Manual</SelectItem>
         <SelectItem key={'rule1'}>Expected Answers</SelectItem>
   </SingleDropDown>
   
     <textarea placeholder='Enter answers...' className="w-full text-white bg-secondary-color p-2 h-52 overflow-y-auto  resize-none outline-none rounded-md border-2 border-primary-color"  />

                        
                      </div>} isOpen={isOpen} onOpenChange={onOpenChange} />

      </div>
                  
                  <div className="flex flex-col gap-1">
                      <p className='text-white'>Description</p>
                      <textarea placeholder='Enter Description' className="w-full text-white max-w-3xl h-60 p-2 rounded-lg bg-dark-gray outline-none border border-primary-color"/>
                  </div>

                  <Button type="blue" additionalClasses='w-fit px-8'>Update</Button>
              </div>
                 <div className="flex flex-col gap-2">
              <p className='text-white flex gap-2 text-2xl items-center'><GiTargetPrize  className='text-primary-color'/> Competition&apos;s Prize</p>
              <p className='text-sm font-light max-w-2xl text-gray-400'>You can handle the competition&apos;s prize as you wish ? Want to swap the prize for a different one ? Do it here !</p>           
             
                  <div className="flex overflow-x-auto gap-4 items-center">
                      <Button type="blue" additionalClasses='w-fit px-4 text-nowrap flex gap-2 items-center'>Swap Prize <IoMdSwap/> </Button>
                      <Button type="blue" additionalClasses='w-fit px-4 flex text-nowrap gap-2 items-center'>Change Details <FaPencilAlt /></Button>
                  </div>
             
              </div>
               <div className="flex flex-col gap-2">
              <p className='text-white flex gap-2 text-2xl items-center'><MdDelete   className='text-red-400'/> Competition&apos;s Deletion</p>
              <p className='text-sm font-light max-w-2xl text-gray-400'>You can handle the competition&apos;s deletion as you wish ? Your situation changed or because of another reasons you have to delete or terminate the competition ? Feel free to do it.</p>           
             
                  <div className="flex gap-4 items-center">
                      <Button type='transparent' additionalClasses='w-fit bg-yellow-600 px-4 flex gap-2 items-center'>Terminate <FaPauseCircle /> </Button>
                      <Button type="black" additionalClasses='w-fit px-4 flex gap-2 bg-red-400 items-center'>Cancel <MdDelete /></Button>
                  </div>
             
              </div>
          </div>
    </div>
  )
}

export default Page