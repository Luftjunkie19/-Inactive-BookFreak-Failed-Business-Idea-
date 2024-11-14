'use client';
import React, { useRef, useState } from 'react'
import Link from "next/link";
import uniqid from 'uniqid';
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
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
import { Option, SelectValue } from 'react-tailwindcss-select/dist/components/type';
import { bookCategories } from 'assets/CreateVariables';

type Props = {}

function Page() {
    const { competitionId} = useParams();
    const navigation = useRouter();
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [modalRequirementContent, setModalRequirementContent]=useState<Requirement>();
    const [requirementType, setRequirementType] = useState<SelectValue>(null);
    const [requirements, setRequirements] = useState<Requirement[]>([]);
    const [bookGenreSelect, setBookGenreSelect] = useState<SelectValue>(null);
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
  const { register:registerRequirement, reset:resetRequirement, setFocus:setRequirementFocus, setValue:setRequirementValue, setError:setRequirementError, clearErrors:clearRequirementErrors, getValues:getRequirementValues, getFieldState:getRequirementFieldState, handleSubmit:handleRequirementSubmit } = useForm<Requirement>();
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
   values: {
          'competitionLogo': undefined,
          'competitionTitle': document.data.competitionName,
          'competitionsName': document.data.comeptitionType,
          'description': document.data.description,
          'chargeId': document.data.chargeId,
          'expiresAt': new Date(document.data.endDate),
          'prize': document.data.prize,
          'prizeDescription': document.data.prizeDescription,
          'prizeType':document.data.prizeType,
          'prizeHandedIn':document.data.prizeHandedIn,
         
        }
    
    });

    const deleteCompetition = async () => {
      try {
       const deletedCompetition = await fetch('/api/supabase/competition/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: competitionId,
          }),
        });

        const fetched= await deletedCompetition.json();
        if(!fetched.data){
          toast.error('Something went wrong');
          throw new Error(fetched.error);
        }
        navigation.push('/search/competitions');
        toast.success('Successfully deleted the competition !');
      } catch (err) {
        console.error(err);
      }
    };

    const queryClient= useQueryClient();
    const {mutateAsync}=useMutation({
      'mutationKey':['competition', competitionId],
      mutationFn: async ()=>{
        const response = await fetch('/api/supabase/competition/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            id:competitionId,
            data:{
              competitionName:getValues('competitionTitle'),
              competitionType:getValues('competitionsName'),
              description: getValues('description'),
              endDate: getValues('expiresAt'),
              
            }
            })
        });
      },
      onSuccess: async (data, variables, context)=> {
        await queryClient.refetchQueries({queryKey: ['competition', competitionId], 'exact': true, 'type':'active'});
      },
    })
  
  return (
      <div className='w-full flex'>
          <DashboardBar/>
          <div className="w-full overflow-y-auto sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] overflow-x-hidden px-4 py-2 flex flex-col gap-6">
              <div className="">
              <p className='text-white flex gap-2 text-2xl items-center'><FaInfoCircle className='text-primary-color'/> Competition Info</p>
              <p className='text-sm font-light text-gray-400'>Provide Changes to the competititon if something unexpected popped into your head</p>           
              </div>
              <form onSubmit={handleSubmit(async()=>{
                await mutateAsync();
                navigation.push(`/competition/${competitionId}`);
              }, async (errors)=>{})} className="flex flex-col gap-2">
              <div className="flex gap-6 w-full sm:flex-col 2xl:flex-row 2xl:items-center">
              <div className="flex sm:flex-wrap lg:flex-row sm:gap-6 2xl:gap-3 p-1 items-center">
                  {document && document.data && <Image src={document.data.competitionLogo} alt='' className='h-44 w-44 rounded-full' width={60} height={60}/>}
                  <div className="flex flex-col gap-1 self-end">
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
              <div className="flex flex-col gap-1 max-w-sm w-full">
              <p className="text-white text-base">Expiration Date</p>
            <Popover>
      <PopoverTrigger asChild className='max-w-sm w-full'>
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

                  <div className="flex-col gap-1 flex max-w-sm w-full">
                    <p className="text-white text-base">Competition Type</p>
                  <Select classNames={{
              menuButton: (value) => 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color',
          }} primaryColor=''  value={competitionTypes.find((item) => item.value === getValues('competitionsName')) as SelectValue} {...register('competitionsName')} onChange={(value) => {
            // setCompetitionName((value as any));
            setValue('competitionsName', (value as any).value);
}} options={competitionTypes} />
                  </div>
              
                  </div>

                    <div className="flex flex-col gap-2 pb-2">
        <div className="">
          <p className='text-xl text-white font-semibold'>Additional Conditions</p>
          <p className='text-xs text-gray-400'>You can add additional conditions users have to fullfill in order to join the competition.</p>
        </div>

                      <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-64 max-w-3xl  bg-dark-gray py-4 px-2 rounded-lg  h-full">
                       
                        {
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
                  
                  <div className="flex flex-col gap-1">
                      <p className='text-white'>Description</p>
                      <textarea {...register('description', {required: true, validate:{
                        noValueEntered: (value) => value.trim() !== '' || 'You have to enter the description',
                      }})} defaultValue={getValues('description')} placeholder='Enter Description' className="w-full text-white max-w-3xl h-60 p-2 rounded-lg bg-dark-gray outline-none border border-primary-color"/>
                  </div>

                  <Button isSubmit type="blue" additionalClasses='w-fit px-8 hover:bg-blue-400 transition-all hover:scale-95'>Update</Button>
              </form>
                 <div className="flex flex-col gap-2">
              <p className='text-white flex gap-2 text-2xl items-center'><GiTargetPrize  className='text-primary-color'/> Competition&apos;s Prize</p>
              <p className='text-sm font-light max-w-2xl text-gray-400'>You can handle the competition&apos;s prize as you wish ? Want to swap the prize for a different one ? Do it here !</p>           
             
                  <div className="flex overflow-x-auto gap-4 items-center">
                      <Button type="blue" additionalClasses='w-fit px-4 text-nowrap flex gap-2 items-center'>Swap Prize <IoMdSwap/> </Button>
                      <Button type="blue" additionalClasses='w-fit px-4 flex text-nowrap gap-2 items-center'>Change Details <FaPencilAlt /></Button>
                  </div>
             
              </div>
               <div className="flex flex-col gap-2 pb-2">
              <p  className='text-white flex gap-2 text-2xl items-center'><MdDelete   className='text-red-400'/> Competition&apos;s Deletion</p>
              <p className='text-sm font-light max-w-2xl text-gray-400'>You can handle the competition&apos;s deletion as you wish ? Your situation changed or because of another reasons you have to delete or terminate the competition ? Feel free to do it.</p>           
             
                  <div className="flex gap-4 items-center">
                      <Button type='transparent' additionalClasses='w-fit bg-yellow-600 hover:scale-95 transition-all hover:bg-yellow-400 px-4 flex gap-2 items-center'>Terminate <FaPauseCircle /> </Button>
                      <Button onClick={deleteCompetition} type="black" additionalClasses='w-fit px-4 hover:bg-red-600 hover:scale-95 transition-all flex gap-2 bg-red-400 items-center'>Cancel <MdDelete /></Button>
                  </div>
             
              </div>
          </div>
    </div>
  )
}

export default Page