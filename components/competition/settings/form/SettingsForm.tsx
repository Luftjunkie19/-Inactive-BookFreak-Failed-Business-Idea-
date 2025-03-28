'use client';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDisclosure } from '@nextui-org/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Competition, Requirement, requirementOptions } from 'app/form/competition/page';
import { bookCategories } from 'assets/CreateVariables';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import ModalComponent from 'components/modal/ModalComponent';
import { format } from 'date-fns';
import useStorage from 'hooks/storage/useStorage';
import { CalendarIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa6';
import { PiStackPlusFill } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import Select from 'react-tailwindcss-select';
import { Option, SelectValue } from 'react-tailwindcss-select/dist/components/type';
import alertMessages from '../../../../assets/translations/AlertMessages.json';
import translations from '../../../../assets/translations/FormsTranslations.json';
import uniqid from "uniqid";

type Props = {competitionId:string, document:{data:any | null, error:any | null}}

function SettingsForm({competitionId, document}: Props) {
    const navigation = useRouter();
        const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
        const { isOpen:isAnswerModalOpen, onOpen:onAnswerModalOpen, onOpenChange:onAnswerModalOpenChange, onClose:onAnswerModalClose} = useDisclosure();
   const selectedLanguage = useSelector(
      (state:any) => state.languageSelection.selectedLangugage
    );    
      const [previewImage, setPreviewImage] = useState<string>();
    
        const { register, reset, getValues, setError, clearErrors, setValue, handleSubmit, watch} = useForm<Competition>(document && document.data && {
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
    const { register:registerRequirement, reset:resetRequirement, setFocus:setRequirementFocus, setValue:setRequirementValue, setError:setRequirementError, clearErrors:clearRequirementErrors, getValues:getRequirementValues, getFieldState:getRequirementFieldState, handleSubmit:handleRequirementSubmit } = useForm<Requirement>();

    
        const competitionTypes = [
      { value: "First read, first served", label: translations.competitionTypes.first[selectedLanguage] },
      {
        value: "Lift others, rise",
        label: translations.competitionTypes.second[selectedLanguage],
      },
      { value: "Teach to fish", label: translations.competitionTypes.third[selectedLanguage] },
    ];
const {getImageUrl, uploadImageUrl, uploadImage } = useStorage();

const imageInputRef=useRef<HTMLInputElement>(null);
     const [modalRequirementContent, setModalRequirementContent]=useState<Requirement>();
    const [requirementType, setRequirementType] = useState<SelectValue>(null);
    const [requirements, setRequirements] = useState<Requirement[]>(document && document.data ? document.data.rules : []);
    const [bookGenreSelect, setBookGenreSelect] = useState<SelectValue>(null);
  const [competitionRuleType, setCompetitionRuleType] = useState<SelectValue>(document && document.data && competitionTypes.find((type) => type.value === document.data.competitionType) ? competitionTypes.find((type) => type.value === document.data.competitionType) as SelectValue : null);
  const [expiryDate, setExpiryDate] = useState<Date>(document && document.data && document.data.endDate ? new Date(document.data.endDate) : undefined);
  
    
  
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


  const manageRequiredNumber = useCallback((e, item: Requirement, propertyName: string) => {
    const foundRequirementIndex = requirements.findIndex((el) => el.id === item.id);
    if (foundRequirementIndex === -1) {
      toast.error('Upsi !')
      return;
    }
    requirements[foundRequirementIndex][propertyName] = +e.target.value;
  }, [requirements]);

    const queryClient= useQueryClient();
  const { mutateAsync } = useMutation({
    'mutationKey': ['competition', competitionId],
    mutationFn: async () => {
      let imageUrl: string | undefined = undefined;
      if (previewImage && getValues('competitionLogo')) {
        const { data, error } = await uploadImage(getValues('competitionLogo'), 'competitionLogo', `${competitionId}/${crypto.randomUUID()}`);

        if (error && !data) {
          console.error(error);
          return;
        }

        if (data) {
          const imageData = await uploadImageUrl(data.path, 'competitionLogo');
          if (imageData) {
            console.log(imageData);
            imageUrl = imageData;
          }
        }


      }

      const response = await fetch('/api/supabase/competition/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: competitionId,
          data: {
            competitionName: getValues('competitionTitle'),
            competitionType: getValues('competitionsName'),
            description: getValues('description'),
            endDate: getValues('expiresAt'),
            competitionLogo: imageUrl ?? document.data.competitionLogo,
          
            'rules': {
              'createMany': {
                'skipDuplicates': true,
                data: requirements.filter((item) => !document.data.rules.find((rule) => rule.id === item.id)).map((item) => ({
                  requiredBookRead: item.requiredBookRead && +item.requiredBookRead,
                  id: item.id,
                  requiredPagesRead: item.requiredPagesRead && +item.requiredPagesRead,
                  requirementType: item.requirementType,
                  requiredBookType: item.requiredBookType,
                  requirementQuestion: item.requirementQuestion,
                  requirementQuestionPossibleAnswers: item.requirementQuestionPossibleAnswers && item.requirementQuestionPossibleAnswers.length > 0 ? item.requirementQuestionPossibleAnswers : undefined,
                })),
              },
              'deleteMany': document.data.rules.filter((item) => !requirements.find((rule) => rule.id === item.id)).map((item) => ({ id: item.id })),

              
            }
              
          }
        })
      });

      const fetchedRes = await response.json();

      if (!fetchedRes.data) {
        console.log(fetchedRes);
        throw new Error('Something went not correctly');
      }

      toast.success('YEAH !');

    },
    onSuccess: async (data, variables, context) => {
      await queryClient.refetchQueries({ queryKey: ['competition', competitionId], 'exact': true, 'type': 'active' });
    },
  });

    const handleSelect = (e) => {

    let selected = e.target.files[0];


    if (selected?.size > 200000) {
      toast.error('To big Image selected');
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
                  setValue('competitionLogo', selected);
      return;
    }


  };

    

  return (
    <form onSubmit={handleSubmit(async()=>{
                await mutateAsync();
                navigation.push(`/competition/${competitionId}`);
              }, async (errors)=>{})} className="flex flex-col gap-4">
              <div id='first-form-section' className="gap-6 w-full grid sm:grid-cols-1 lg:grid-cols-2 items-center max-w-5xl">
              <div className="flex sm:flex-wrap lg:flex-row sm:gap-6 2xl:gap-3 p-1 items-center">
                  {document && document.data && <Image src={ previewImage ?? document.data.competitionLogo} alt='' className='h-44 w-44 rounded-full' width={60} height={60}/>}
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
                                  <LabeledInput containerStyle='self-end' {...register('competitionTitle', {required:'Competition name is required'})} defaultValue={getValues('competitionTitle')}  additionalClasses='p-2 min-w-80 max-w-xs w-full' label='Competition Name' type='dark'/>
            

              </div>        
              <div className="flex sm:flex-col lg:flex-row items-center w-full gap-6">
              <div className="flex flex-col gap-1 max-w-sm w-full">
              <p className="text-white text-base">Expiration Date</p>
            <Popover>
      <PopoverTrigger asChild className='max-w-sm w-full'>
        <div className="flex gap-2 cursor-pointer items-center text-white bg-dark-gray py-2 px-4 h-fit max-w-xs w-full rounded-lg border-2 border-primary-color"
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {getValues('expiresAt') ? format(expiryDate ?? getValues('expiresAt'), "PPP") : <span>Pick a date</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
                <Calendar fromDate={new Date(document.data.endDate)} disabled={new Date(document.data.endDate).getTime() <= new Date().getTime()} classNames={{
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
          selected={expiryDate ?? new Date(getValues('expiresAt') as any)}
                  onSelect={(day, selectedDate) => {
                    if (selectedDate.getTime() < new Date().getTime()) {
                      toast.error(`You cannot select dates earlier than today's date.`);
                      return;
                      }
                    setExpiryDate(selectedDate);
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
          }} primaryColor=''  value={competitionRuleType ?? competitionTypes.find((item)=>item.value === watch('competitionsName')) as SelectValue} {...register('competitionsName')} onChange={(value) => {
            // setCompetitionName((value as any));
            setCompetitionRuleType(value);
            setValue('competitionsName', (value as any).value);
}} options={competitionTypes} />
                  </div>
              
                  </div>

                    <div className="flex flex-col gap-2 pb-2">
        <div className="">
          <p className='text-xl text-white font-semibold'>Additional Conditions</p>
          <p className='text-xs text-gray-400'>You can add additional conditions users have to fullfill in order to join the competition.</p>
        </div>

                      <div className="flex flex-col gap-2 w-full overflow-y-auto min-h-44 max-h-44 max-w-3xl  bg-dark-gray py-4 px-2 rounded-lg  h-full">
                       
                        {
                      document && document.data && requirements.map((item)=>(<div onDoubleClick={()=>{
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

            onClose();

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

                  <Button isSubmit type="blue" additionalClasses='w-fit px-8 hover:bg-white hover:text-primary-color transition-all hover:scale-95'>Update</Button>
              </form>
  )
}

export default SettingsForm