'use client';
import { Suspense, useCallback, useRef, useState } from 'react';
import React from 'react'

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import uniqid from 'uniqid';

import Select from 'react-tailwindcss-select';

import { bookCategories } from 'assets/CreateVariables';
import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import { snackbarActions } from '../../../context/SnackBarContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import LabeledInput from 'components/input/LabeledInput';
import Image from 'next/image';
import { HiOutlineUpload } from 'react-icons/hi';
import Button from 'components/buttons/Button';
import SingleDropDown from 'components/drowdown/SingleDropDown';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import ModalComponent from 'components/modal/ModalComponent';
import { MdCurrencyExchange, MdEditDocument } from 'react-icons/md';
import { PiStackPlusFill } from 'react-icons/pi';
import { useForm } from 'react-hook-form';
import { Option, SelectValue } from 'react-tailwindcss-select/dist/components/type';
import { useQuery } from '@tanstack/react-query';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import toast from 'react-hot-toast';
import useStorage from 'hooks/storage/useStorage';
import 'intro.js/introjs.css';
import '../../../stylings/hint-tourguide.css';
import { HiOutlineInformationCircle } from 'react-icons/hi2';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDisclosure } from '@nextui-org/react';
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { FaBitcoin, FaBook, FaEthereum, FaTicket } from 'react-icons/fa6';
import { IoTicketSharp } from 'react-icons/io5';
import { SiChainlink, SiSolana } from 'react-icons/si';
import { BsFileEarmarkRuledFill } from 'react-icons/bs';
import { FaInfoCircle } from 'react-icons/fa';



export  const requirementOptions=[
    { value: 'rule1', label: 'Min. Read Pages of Genre' },
    { value: 'rule2', label: 'Min. Read Books of Genre' },
    { value: 'rule3', label: 'Min. Read Books Amount' },
    { value: 'rule4', label: 'Min. Read Pages Amount' },
    { value: 'rule5', label: 'Peculiar Question' }
    ]


export interface Requirement{
  id:string,
  requirementType: 'rule1' | 'rule2' | 'rule3' | 'rule4' | 'rule5' | null,
  requiredBookType?: string,
  requiredBookRead?: number,
  requiredPagesRead?: number,
  requirementQuestion?: string,
  requirementQuestionPossibleAnswers?: string[],
}

export type Competition = {
 competitionTitle: string,
  competitionsName: string,
    competitionLogo:File,
    expiresAt:  Date | null ,
    description: string,
    prizeType: 'money' | 'item' | null,
    chargeId?: string  ,
  prizeHandedIn: false,   
  prizeDescription?:string,
    prize: {
      moneyPrize?: {
        amount: number | null,
        currency: string | null,
      },
      itemPrize?: {
        title: string | null,
        typeOfPrize: SelectValue,
        bookReferenceId?: SelectValue,
        voucherFor?: string,
        voucherEventLink?:string
      },
  },
    requirements?:Requirement[]
}

function CreateCompetition() {
  const { user } = useAuthContext();
  const [expirationDate, setExpirationDate] = useState<Date>();
  const competitionLogoFileInputRef = useRef<HTMLInputElement>(null);
  const [requirementType, setRequirementType] = useState<SelectValue>(null);
  const [bookReference, setBookReference] = useState<SelectValue>(null);
  const [previewImage, setPreviewImage] = useState<string>();
  const [competitionName, setCompetitionName] = useState<SelectValue>(null);
  const [modalRequirementContent, setModalRequirementContent]=useState<Requirement>();
  const { register, reset, setFocus, setValue, setError, clearErrors, getValues, getFieldState, handleSubmit } = useForm<Competition>();
    const { register:registerRequirement, reset:resetRequirement, setFocus:setRequirementFocus, setValue:setRequirementValue, setError:setRequirementError, clearErrors:clearRequirementErrors, getValues:getRequirementValues, getFieldState:getRequirementFieldState, handleSubmit:handleRequirementSubmit } = useForm<Requirement>();
  const [bookGenreSelect, setBookGenreSelect] = useState<SelectValue>(null);
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const dispatch=useDispatch();
  const router=useRouter();
  const {uploadImage, uploadImageUrl, getImageUrl}=useStorage();

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
  
  
   const allPrizes = [
    { value: "book", label: `${translations.book[selectedLanguage]} 📘` },
    {
      value: "voucher",
      label: "Voucher 🎟️",
    },
     { value: "ticket", label: `${translations.ticket[selectedLanguage]} 🎫` },
     {
      value: "money",
      label: `${translations.money[selectedLanguage]} 🤑`,
    },
  ];


 
  const [chosenPrize, setChosenPrize]=useState<SelectValue>(null);

  const { data, error } = useQuery({
    queryKey: ["books"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch("/api/supabase/book/getAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          take: undefined,
          where: undefined,
          skip: undefined,
          include: undefined,
          select:undefined
        })
      });
      const fetchedRes = await response.json();

      return fetchedRes;
      },
  });


  const manageRequiredNumber = useCallback((e, item:Requirement, propertyName:string) => {
    const foundRequirementIndex= requirements.findIndex((el) => el.id === item.id);
    if(foundRequirementIndex === -1){
      toast.error('Upsi !')
      return;
    }
  requirements[foundRequirementIndex][propertyName]= +e.target.value;
}, [requirements])


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

 const submitForm = async (formData: Competition) => {
       clearErrors();
    const competitionId = crypto.randomUUID();
    const competitionChatId = crypto.randomUUID();
    const prizeId = crypto.randomUUID();
    try {

      if(!user){
        toast.error('You are not allowed to add!')
        return;
      }


      const { data: imageData, error } = await uploadImage(formData.competitionLogo, 'competitionLogo', `${competitionId}/${uniqid('competitionLogo')}`);
      console.log(imageData, error);
   
      if (!imageData) {
        setError('competitionLogo', {
          'message': 'Failed to upload the image.',
          'type': 'error',
        });
             toast.error('Somethin went not correct.');
        return;
      }
      const imageUrl = await uploadImageUrl(imageData.path, 'competitionLogo');

     
      const fetchPrize = await fetch('/api/supabase/prize/create', {
        body: JSON.stringify({data:{
          id: prizeId,
          prizeName: formData['prize'].itemPrize!.title || undefined,
          isPrizeItem: formData['prize'].itemPrize && formData['prize'].itemPrize.typeOfPrize ? true : false,
          itemType: formData.prize.itemPrize && formData.prize.itemPrize.typeOfPrize &&  (formData.prize.itemPrize.typeOfPrize as Option)['value'],
          voucherFor:  formData['prize'].itemPrize && formData['prize'].itemPrize.voucherFor ? formData['prize'].itemPrize.voucherFor : undefined,
          voucherLinkTo: formData['prize'].itemPrize && formData['prize'].itemPrize.voucherEventLink ? formData['prize'].itemPrize.voucherEventLink : undefined,
          chargeId: formData.chargeId,
          prizeDescription: formData.prizeDescription || undefined,
          bookReferenceId: formData.prize.itemPrize && formData.prize.itemPrize.bookReferenceId ? (formData.prize.itemPrize.bookReferenceId as Option).value : undefined,
          isCryptoPrize: false,
          prizeImage: undefined,
          prizeMoneyAmount: formData['prize'].moneyPrize ? formData['prize'].moneyPrize.amount : undefined,
          prizeMoneyCurrency: formData['prize'].moneyPrize ?  formData['prize'].moneyPrize.currency : undefined,
        }}),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const fullPrize = await fetchPrize.json();

      console.log(fullPrize);


      


      const fetchCompetitionObject = await fetch('/api/supabase/competition/create', {
        body: JSON.stringify({data:{
          competitionName: formData['competitionTitle'],
          competitionType: formData['competitionsName'],
          competitionLogo: imageUrl,
          startDate: new Date(),
          endDate: formData['expiresAt'],
          id: competitionId,
          chatId: competitionChatId,
          prizeId: prizeId,
          description: formData['description'],
          prizeHandedIn: false,
          chargeId: formData['chargeId'] ?? null,
        }}),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      


      const { data:competition, error: fullErr } = await fetchCompetitionObject.json();



    

      const fetchRequirements= await fetch('/api/supabase/requirement/createMany', {
        method:"POST",
          body:JSON.stringify({data:requirements.map((item)=>({...item, competitionId}))}),
          headers:{
            'Content-Type':'application/json',
          },
      });

      const fetchMember= await fetch('/api/supabase/member/create', {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({data:{userId:user.id, competitionId:competition.id, isAdmin:true, isCreator:true, isOwner:true}}),
      });
      
  
      toast.success('Yeah, you did it !');
      setChosenPrize(null);
      setExpirationDate(undefined);
      setCompetitionName(null);
      clearErrors();
      reset();
      setPreviewImage(undefined);
      router.push('/');

    } catch (err) {
      console.log(err);
    }
  };

    const formula1=`TP = 2 \\cdot \\text{BR} + 10 \\cdot \\left[\\text{G} \\geq 3\\right] + 5 \\cdot \\text{S} + 15 \\cdot \\left[\\left(\\text{ABPD} < 5\\right) \\land \\left(\\text{BR} \\geq 5\\right)\\right]`;
    
    const formula2=`\\text{TP} = \\text{BR} + \\text{Rec. Sent} + 
  \\begin{cases} 
    10 & \\text{Rec. Accepted} \\geq 3 \\\\ 
    0 & \\text{otherwise} 
    \\end{cases} + 
    \\begin{cases} 
    15 & \\text{Disc. Initiated} \\geq 5 \\\\ 
    0 & \\text{otherwise} 
    \\end{cases} + 
    5 \\cdot \\text{Collab. Streaks} + 
    \\begin{cases} 
    20 & \\text{Feedback} \\geq 10 \\\\ 
    0 & \\text{otherwise} 
    \\end{cases}`;
  
    const formula3 = `
    \\text{TP} = 0.5 \\cdot \\text{PR} + 5 \\cdot \\text{BC} + (\\text{TA} \\cdot \\frac{\\text{A}}{2}) + \\left\\lfloor \\frac{\\text{AD}}{30} \\right\\rfloor 
    \\\\ 
    + \\left( \\text{if } \\frac{\\left| \\text{AD} - \\text{PD} \\right|}{\\text{PD}} \\leq 0.1, \\ 2, \\ 0 \\right) 
    - \\left( \\text{if } \\text{AD} < 0.5 \\cdot \\text{PD}, \\ 5, \\ 0 \\right)
  `;


     const { isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
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
  
  



  return (
    <MathJaxContext>
    <form onSubmit={handleSubmit(submitForm, (errors) => {
      if (errors) {
        console.log(errors);
        Object.values(errors).map((item) => toast.error(item.message || (item.prize && item.prize?.itemPrize?.typeOfPrize?.message)))
      }
    })} className={`w-full sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden p-4`}>

      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <p className='text-2xl text-white font-bold'>Read, Absorb, Evolve !</p>
        <p className='text-white'>Are you an author, a book company or someone who wants to compete with other people ? Create the competition now and Read !</p>
     </div>

      <div className="flex py-4 gap-12">

        <div onClick={() => {
          competitionLogoFileInputRef!.current!.click();
        }} className="w-56 cursor-pointer h-56 rounded-lg bg-white justify-center items-center flex">
          <input onChange={handleSelect} ref={competitionLogoFileInputRef} type="file" name="" className="hidden" id="" />
          {previewImage ? <div className='relative group top-0 left-0 h-full w-full rounded-lg overflow-hidden'>
            <div className="absolute z-10 top-full left-0 w-full h-full bg-dark-gray/50 group-hover:top-0 duration-400 transition-all  flex justify-center items-center flex-col gap-2">
              <HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-center text-white'>Upload Different Logo</p>
            </div>
            <Image width={50} height={35} className='w-full h-full rounded-lg object-cover' src={previewImage} alt='' />
          </div> : 
          
          <div className="flex w-full flex-col items-center gap-2">
<HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-center text-dark-gray'>Upload Competition&apos;s Logo</p>
          </div>
          } 
        </div>

        
<div className="grid max-w-2xl h-fit self-center w-full gap-4 grid-flow-dense xl:grid-cols-2">
            <LabeledInput {...register('competitionTitle', {
              onChange(event) {
                setValue('competitionTitle', event.target.value);
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
          }} primaryColor=''  value={competitionName} {...register('competitionsName')} onChange={(value) => {
            setCompetitionName((value as any));
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
          {expirationDate ? format(expirationDate, "PPP") : <span>Pick a date</span>}
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
          selected={expirationDate}
                  onSelect={(day, selectedDate) => {
                    if (selectedDate.getTime() < new Date().getTime()) {
                      toast.error(`You cannot select dates earlier than today's date.`);
                      return;
                      }
                      setExpirationDate(selectedDate);
                      setValue('expiresAt', selectedDate);
          }}
                
                  
        />
      </PopoverContent>
            </Popover>
</div>
                       
</div>
      

      </div>

      <div className="flex gap-2 flex-col pb-2">
        <p className='text-xl text-white font-semibold'>Detailed Prize</p>

        <div className="grid xl:grid-cols-2 2xl:grid-cols-3 items-center gap-2 max-w-6xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
          <p className='text-white'>Winner Prize</p>
          <TooltipProvider>
      <Tooltip delayDuration={50}>
              <TooltipTrigger type='button' className='text-primary-color'>
              <HiOutlineInformationCircle className="text-2xl animate-pulse text-primary-color" />
        </TooltipTrigger>
        <TooltipContent alignOffset={4} sideOffset={10} className=' bg-dark-gray sm:min-w-72 lg:min-w-96 xl:min-w-[28rem] max-w-lg w-full overflow-x-hidden border-primary-color text-white' side='bottom' align='start'>

                    <div className="flex flex-col gap-3">
     <div className="flex flex-col gap-1">
            <p className="flex gap-2 text-lg items-center"><FaBook className=' text-primary-color'/> Book</p>
                          <p>Setting this as your competition's prize will allow you to choose a book to be given to the winner.
                            The prize can be changed whenever you want.</p>
     </div>
     <div className="flex flex-col gap-1">
             <p className="flex gap-2 text-lg items-center"><IoTicketSharp className=' text-primary-color'/> Voucher</p>
         <p>Selecting Voucher as your competition's prize, you will allow users or you to win a voucher for anything that you specify. You can change the prize whenever you want.</p>
     </div>
     <div className="flex flex-col gap-1">
        <p className="flex gap-2 text-lg items-center"><FaTicket className=' text-primary-color' /> Ticket</p>
        <p>Selecting Ticket as your competition's prize, you will allow users or you to win a ticket for anything that you specify. You can change the prize whenever you want.</p>
     </div>
      
      <div className="flex flex-col gap-1">
      <p className="flex gap-2 text-lg items-center"> <FaBitcoin className="text-orange-500 text-xl" /> <SiChainlink className=' text-primary-color text-xl' /> <FaEthereum className="text-xl" /> <SiSolana className="text-purple-800 text-xl" /> Crypto</p>
                          <p>
                            You allow the users to win a crypto currency, that you set specifically for this competition !
                            The prize can be changed, however it will charge your account with a specific amount of the currency. 
                            </p>
     </div>

     <div className="flex flex-col gap-1">
        <p className="text-lg flex gap-2 items-center"><MdCurrencyExchange className="text-green-400" /> Money</p>
        <p>You allow the users to win (fiat) money, that you set specifically for this competition ! </p>                  
     </div>
             
              
        
          
                        
          </div>
              </TooltipContent>
                </Tooltip>
                </TooltipProvider>
          </div>
          <Select   {...register('prize.itemPrize.typeOfPrize', {
          required:'The Prize is required'
        })} isMultiple={false} onChange={(values) => {
            setChosenPrize(values);
            setValue('prize.itemPrize.typeOfPrize', values);
          }} classNames={{
            menuButton: (value) => 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color',
           tagItemText: '',
          tagItemIconContainer: '',
                
            }} value={chosenPrize} options={allPrizes}  primaryColor='blue' />
          </div>
          {chosenPrize && (chosenPrize as any).value === 'book' &&
            <>
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Book Title" type={"dark"} />
            {data && data.data && 
            <div className="flex flex-col gap-1">
              <p className='text-white'>BookFreak&#39;s DB Reference</p>
              <Select classNames={{
                menuButton: () =>'bg-dark-gray  h-fit flex max-w-xs w-full rounded-lg border-2  text-white border-primary-color',
         
              }} {...register('prize.itemPrize.bookReferenceId')} options={data.data.map((item) => ({ label: item.title, value: item.id}))} onChange={(values) => {
                setBookReference(values);
                setValue('prize.itemPrize.bookReferenceId', values);
              }} value={bookReference} primaryColor=''/>

            </div>
     }
      
            </>
          }

          {chosenPrize && (chosenPrize as any).value === 'voucher' &&
            <>
          <LabeledInput additionalClasses="max-w-xs w-full p-2" label="What is the Voucher for" type={"dark"} />
          <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Link to the Voucher's Prize" type={"dark"}  />
            </>
          }

          {chosenPrize && (chosenPrize as any).value === 'ticket' && <>
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Ticket's Event Name" type={"dark"}  />
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Ticket's Event Type" type={"dark"} />
          </>}

                        

          {
            chosenPrize && (chosenPrize as any).value === 'money' &&  <LabeledInput additionalClasses="max-w-xs w-full p-2 outline-none" label='Money Prize' type={'dark'} min={0.5} step={0.5} max={10} inputType='number' />
          }
                       
          {chosenPrize && (chosenPrize as any).value !== 'money' &&
          <div className="flex gap-1 flex-col col-span-full">
             <span className="text-lg text-white font-semibold">Other Prize&#39;s Description</span>
              <textarea {...register('prizeDescription', {
                onChange: (e) => {
                  setValue('prizeDescription', e.target.value);
        }
      })} className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
          </div>
       }   

        </div> 
      </div>

      <div className="flex flex-col gap-2 pb-2">
        <div className="">
          <p className='text-xl text-white font-semibold'>Additional Conditions</p>
          <p className='text-xs text-gray-400'>You can add additional conditions users have to fullfill in order to join the competition.</p>
        </div>

        <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-52 max-w-2xl min-h-48  bg-dark-gray py-4 px-2 rounded-lg  h-full">
          {requirements.map((item)=>( <div onDoubleClick={()=>{
            setRequirements(requirements.filter((element)=>element.id !== item.id));
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
                manageRequiredNumber(e, item, 'requiredBookRead');
              }} inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />}

            {item.requiredPagesRead && 
              <LabeledInput defaultValue={item.requiredPagesRead} onChange={(e)=>{
                manageRequiredNumber(e, item, 'requiredPagesRead');
              }} inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />
            }
                              </div>))}
                             
                             
          </div> 
          
<div className="flex items-center gap-2">
           <Button onClick={onOpen} additionalClasses='w-fit  px-4 py-2 flex items-center gap-2' type='blue'>New Condition <PiStackPlusFill /></Button>
              <TooltipProvider>
      <Tooltip delayDuration={50}>
              <TooltipTrigger type='button' >
              <HiOutlineInformationCircle className="text-2xl animate-pulse text-primary-color" />
        </TooltipTrigger>
              <TooltipContent alignOffset={4} sideOffset={10} className=' bg-dark-gray overflow-x-hidden max-w-sm w-full border-primary-color text-white flex flex-col gap-2' side='bottom' align='start'>
                <p className="flex gap-2 items-center text-lg"><BsFileEarmarkRuledFill className="text-primary-color text-xl"/> Requirements</p>
                <p className='text-sm'>Add a new requirement to the competition, to select only these users, that will be appropriate to your competition. And won't decrease your fun from being BookFreak's part !</p>
              </TooltipContent>
                </Tooltip>
                </TooltipProvider>
</div>


       
        <ModalComponent modalSize='xl' modalFooterContent={<div className='flex gap-3 items-center'>
            <Button onClick={handleRequirementSubmit((formData: Requirement) => {
          console.log(formData);

          setRequirements([...requirements, {
              id:uniqid('req'),
              requirementType: formData.requirementType,
              requiredBookRead: formData.requiredBookRead,
              requiredPagesRead: formData.requiredPagesRead,
              requiredBookType: formData.requiredBookType,
              requirementQuestionPossibleAnswers: formData.requirementQuestionPossibleAnswers,
              requirementQuestion: formData.requirementQuestion
            }])
            
            toast.success('Requirement Successfully inserted !');
            resetRequirement();
            setRequirementType(null);
            setBookGenreSelect(null);

            onClose()

         }, (err) => {
          console.log(err);
 })} type='blue' additionalClasses="w-fit  px-4 py-2">
        Append
      </Button>
        </div>} modalTitle='Additional Condition' modalBodyContent={<div  className='flex flex-col min-h-80 gap-3'>


   <Select {...registerRequirement('requirementType')}  placeholder='Requirement Type' classNames={{
          menuButton:()=>'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color'
        }} onChange={(value) => {
          setRequirementType(value);
          setRequirementValue('requirementType', (value as any).value);
   } } options={requirementOptions} value={requirementType} primaryColor={''} />
   

{requirementType && ((requirementType as Option).value === 'rule1' || (requirementType as Option).value === 'rule2') &&  <div className='h-fit flex flex-col gap-1'>
  <p className='text-white'>Book Genre</p>
  <Select {...registerRequirement('requiredBookType')} classNames={{
       menuButton(value) {
         return 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color'
       },
     }} value={bookGenreSelect} onChange={(values) => {
       setBookGenreSelect((values as Option));
       setRequirementValue('requiredBookType', (values as any).value);
   }} primaryColor='blue' options={bookCategories}/>
</div>}

   {requirementType && ((requirementType as Option).value === 'rule1' || (requirementType as Option).value === 'rule4') &&
   <>
   <LabeledInput {...registerRequirement('requiredPagesRead', {
    onChange:(event)=>{
      setRequirementValue('requiredPagesRead', +event.target.value);
    }
   })}  min={'0'}  inputType='number' additionalClasses="max-w-sm w-full p-2" label="Pages Number" type={"dark"} />
   </>
   }

   {requirementType && ((requirementType as Option).value === 'rule2' || (requirementType as Option).value === 'rule3') &&
            <LabeledInput  {...registerRequirement('requiredBookRead', {
              onChange: (e) => {
                 setRequirementValue('requiredBookRead', +e.target.value);
       }
     })} min={'0'} inputType='number' additionalClasses="max-w-sm w-full p-2" label="Books Number" type={"dark"} />
   }
   
   {requirementType && (requirementType as Option).value === 'rule5' && 
     <>     
     <LabeledInput  {...registerRequirement('requirementQuestion', {
      onChange(event) {
        setRequirementValue('requirementQuestion', event.target.value);
      },
     })} additionalClasses="max-w-sm w-full p-2" label="Question" type={"dark"} />
            <textarea {...registerRequirement('requirementQuestionPossibleAnswers', {
              onBlur: (e) => {
                setRequirementValue('requirementQuestionPossibleAnswers', e.target.value.split(', '))
              }
            })}  placeholder='Enter answers, separating the with commas (, )' className="w-full text-white bg-secondary-color p-2 h-52 overflow-y-auto  resize-none outline-none rounded-md border-2 border-primary-color"  />
     </>
   }                 
                      </div>} isOpen={isOpen} onOpenChange={onOpenChange} />

      </div>




         <label className="flex flex-col gap-3">
          <span className="text-xl text-white font-semibold">Description</span>
        <textarea {...register('description', {
         required:'You need to insert the description either...',
          onChange(event) {
            setValue('description', event.target.value)
          },
      })} className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
      </label>

      {modalRequirementContent && answerModal(modalRequirementContent)}

      <Button isSubmit type='blue' additionalClasses="w-fit px-8 py-2 text-lg my-4">
        Insert
      </Button>

    </form>
    </MathJaxContext>
  );
}

export default CreateCompetition;
