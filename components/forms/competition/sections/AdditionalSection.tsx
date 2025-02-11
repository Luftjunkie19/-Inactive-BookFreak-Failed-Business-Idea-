import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useDisclosure } from '@nextui-org/react';
import { Requirement, requirementOptions } from 'app/form/competition/page';
import { bookCategories } from 'assets/CreateVariables';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import ModalComponent from 'components/modal/ModalComponent';
import React, { useCallback, useState } from 'react'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { BsFileEarmarkRuledFill } from 'react-icons/bs';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { PiStackPlusFill } from 'react-icons/pi';
import Select from 'react-tailwindcss-select';
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';
import uniqid from 'uniqid';
type Props = {}

function AdditionalSection({ }: Props) {
    const [modalRequirementContent, setModalRequirementContent]=useState<Requirement>();
     const { isOpen:isAnswerModalOpen, onOpen:onAnswerModalOpen, onOpenChange:onAnswerModalOpenChange, onClose:onAnswerModalClose} = useDisclosure();
    const {control, watch, register, setValue} = useFormContext();

    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const currentRequirements=watch('requirements');
    
    const manageRequiredNumber = useCallback((e, item:Requirement, propertyName:string) => {
        const foundRequirementIndex= currentRequirements.findIndex((el) => el.id === item.id);
        if(foundRequirementIndex === -1){
          toast.error('Upsi !')
          return;
        }
      currentRequirements[foundRequirementIndex][propertyName]= +e.target.value;
    }, [currentRequirements])

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
  
    const { fields, remove } = useFieldArray({
        control,
        name:'requirements'
    });
        const { register:registerRequirement, reset:resetRequirement, setFocus:setRequirementFocus, setValue:setRequirementValue, setError:setRequirementError, clearErrors:clearRequirementErrors, getValues:getRequirementValues, getFieldState:getRequirementFieldState, handleSubmit:handleRequirementSubmit, watch:watchRequirement} = useForm<Requirement>();


  return (
      <>
      <div className="flex flex-col gap-2 pb-2">
              <div className="">
                <p className='text-xl text-white font-semibold'>Additional Conditions</p>
                <p className='text-xs text-gray-400'>You can add additional conditions users have to fullfill in order to join the competition.</p>
              </div>
      
              <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-52 max-w-2xl min-h-48  bg-dark-gray py-4 px-2 rounded-lg  h-full">
                  {currentRequirements && currentRequirements.map((item, index) => (<div onDoubleClick={() => {
                      remove(index);
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
      
                setValue('requirements', [...currentRequirements,  {
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
                setRequirementValue('requirementType', (value as any).value);
         } } options={requirementOptions} value={requirementOptions.find((item)=>item.value === watchRequirement('requirementType')) as SelectValue} primaryColor={''} />
         
      
      {watchRequirement('requirementType') && (watchRequirement('requirementType') === 'rule1' || watchRequirement('requirementType') === 'rule2') &&  <div className='h-fit flex flex-col gap-1'>
        <p className='text-white'>Book Genre</p>
        <Select {...registerRequirement('requiredBookType')} classNames={{
             menuButton(value) {
               return 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color'
             },
           }} value={bookCategories.find((item)=>item.value === watchRequirement('requiredBookType')) as SelectValue} onChange={(values) => {
             setRequirementValue('requiredBookType', (values as any).value);
         }} primaryColor='blue' options={bookCategories}/>
      </div>}
      
         {watchRequirement('requirementType') && (watchRequirement('requirementType') === 'rule1' || watchRequirement('requirementType') === 'rule4') &&
         <>
         <LabeledInput {...registerRequirement('requiredPagesRead', {
          onChange:(event)=>{
            setRequirementValue('requiredPagesRead', +event.target.value);
          }
         })}  min={'0'}  inputType='number' additionalClasses="max-w-sm w-full p-2" label="Pages Number" type={"dark"} />
         </>
         }
      
         {watchRequirement('requirementType') && (watchRequirement('requirementType')=== 'rule2' || watchRequirement('requirementType')=== 'rule3') &&
                  <LabeledInput  {...registerRequirement('requiredBookRead', {
                    onChange: (e) => {
                       setRequirementValue('requiredBookRead', +e.target.value);
             }
           })} min={'0'} inputType='number' additionalClasses="max-w-sm w-full p-2" label="Books Number" type={"dark"} />
         }
         
         {watchRequirement('requirementType') && watchRequirement('requirementType')=== 'rule5' && 
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
          


      </>
  )
}

export default AdditionalSection