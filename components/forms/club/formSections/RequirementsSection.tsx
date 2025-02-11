'use client';
import React, { useState } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import ModalComponent from 'components/modal/ModalComponent';
import Button from 'components/buttons/Button';
import { useForm, useFormContext } from 'react-hook-form';
import { Requirement, requirementOptions } from 'app/form/competition/page';
import { SharedSelection, useDisclosure } from '@nextui-org/react';
import RequirementSelect from 'react-tailwindcss-select'
import { bookCategories } from 'assets/CreateVariables';
import { Option, SelectValue } from 'react-tailwindcss-select/dist/components/type';
import Image from 'next/image';
import LabeledInput from 'components/input/LabeledInput';
import emptyImg from '../../../assets/emptyBox.png'
import { IoIosAddCircle } from 'react-icons/io';

type Props = {}

function RequirementsSection({}: Props) {
const { register: registerRequirement, reset: resetRequirement, getValues: getRequirementValues, setError: setRequirementError, clearErrors: clearRequirementErrors, setValue: setRequirementValue, handleSubmit: handleRequirementSubmit } = useForm<Requirement>();
const {setValue, watch, register}=useFormContext();
  const [requirements, setRequirements] = useState<Requirement[]>([]);
const [modalRequirementContent, setModalRequirementContent] = useState<Requirement>();
  const { isOpen: isAnswerModalOpen, onOpen: onAnswerModalOpen, onOpenChange: onAnswerModalOpenChange, onClose: onAnswerModalClose } = useDisclosure();
const answerModal = (item: Requirement) => {
  return (<ModalComponent modalSize='sm' isOpen={isAnswerModalOpen} modalTitle='Q&A' modalBodyContent={<div>
    <p className="text-white">{item.requirementQuestion}</p>
    <p className='text-base text-white'>{item.requirementQuestionPossibleAnswers && item.requirementQuestionPossibleAnswers.join(', ')}</p>
  </div>} onClose={() => {
    setModalRequirementContent(undefined);
    onAnswerModalClose();
  }} onOpenChange={() => {
    onAnswerModalOpenChange();
  }} />)
};
  const [selectedBookType, setselectedBookType] = useState<SelectValue>(null);
const [selectedType, setSelectedType] = useState<SelectValue>(null);
const [selectedKeys, setSelectedKeys] = useState<SharedSelection>(new Set([]));


const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();

  return (
    <>
       <div className="flex max-w-6xl w-full gap-2 flex-col pb-2">
          <p className='text-xl text-white font-semibold'>Club Requirements</p>
            <ModalComponent modalSize='xl' modalFooterContent={<div className='flex gap-3 items-center'>
            <Button onClick={handleRequirementSubmit((data) => {
              setValue('requirements',[...watch('requirements'), { ...data, id: crypto.randomUUID() }]);
              resetRequirement();
              onClose();
              
              },(err)=>{})} type='blue' additionalClasses="w-fit  px-4 py-2">
          Append
        </Button>
   </div>} modalTitle='Additional Conditions' modalBodyContent={<div className='flex min-h-80 max-h-96 h-full flex-col gap-3'>
  
     <div className="flex flex-col gap-1">
       <p className='text-white'>Requirement Type</p>
     <RequirementSelect isSearchable isClearable
       classNames={{
         menuButton: () => 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color line-clamp-1  ',
         
           list: "overflow-y-scroll",
         
       }}
       onChange={(values)=>{
        console.log((values as Option).value);
        setSelectedType(values);
       setRequirementValue('requirementType', (values as any).value);
     }} 
     value={selectedType} primaryColor={''} options={requirementOptions}/>
      </div>
     
  {getRequirementValues('requirementType') && (getRequirementValues('requirementType') === "rule1" || getRequirementValues('requirementType') === 'rule2') &&  <div className='h-fit flex flex-col gap-1'>
    <p className='text-white'>Book Genre</p>
    <RequirementSelect {...registerRequirement('requiredBookType')} classNames={{
         menuButton: ()=> 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-wrap text-white line-clamp-1 border-primary-color',
       }} value={selectedBookType} onChange={(values) => {
         setselectedBookType(values);
         setRequirementValue('requiredBookType', (values as any).value);
     }} primaryColor='blue' options={bookCategories}/>
  </div>}
  
  
     {getRequirementValues('requirementType') && (getRequirementValues('requirementType') === "rule1" || getRequirementValues('requirementType') === "rule4") &&
     <LabeledInput {...registerRequirement("requiredPagesRead", {
       onChange(event) {
         setRequirementValue("requiredPagesRead", +(event.target.value as string));
       },
       })} additionalClasses="max-w-sm w-full p-2" label="Pages Amount" type={"dark"} />
     }
  
  
     
     {getRequirementValues('requirementType') && (getRequirementValues('requirementType') === "rule2" || getRequirementValues('requirementType') === "rule3") &&
     <LabeledInput {...registerRequirement("requiredBookRead", {
       onChange(event) {
         setRequirementValue('requiredBookRead', +(event.target.value as string));
       },
       })} additionalClasses="max-w-sm w-full p-2" label="Books Amount" type={"dark"} />
  }
     
  
  
     {getRequirementValues('requirementType') && getRequirementValues('requirementType') === 'rule5' && <>
     
      <LabeledInput {...registerRequirement('requirementQuestion', {
         onChange(event) {
           setRequirementValue('requirementQuestion', event.target.value);
         },
      })} additionalClasses="max-w-sm w-full p-2" label="Question" type={"dark"} />
       
  
  <textarea onBlur={(e) => {
  setRequirementValue('requirementQuestionPossibleAnswers', e.target.value.split(', '));
  }} placeholder='Enter answers...' className="w-full text-white bg-secondary-color p-2 h-52 overflow-y-auto  resize-none outline-none rounded-md border-2 border-primary-color"  />
     </>
    }
    
    </div> } isOpen={isOpen} onOpenChange={onOpenChange} />
  
          <div className={`max-w-2xl p-2 min-h-96 max-h-96 h-full w-full flex flex-col  ${requirements.length > 0 ? 'gap-2' : 'items-center justify-center gap-6'} bg-dark-gray rounded-lg border-primary-color border-2`}>
            {requirements.length === 0 ? <>
              <p className='text-3xl text-white font-semibold text-center opacity-75'>No Requirements yet !</p>
            <Image src={emptyImg} className='w-48 h-48' alt="" width={60} height={60} />
            <p className='text-center text-sm font-light opacity-40 text-white'>You haven&lsquo;t set any requirements yet. If you want to set requirements, click the dropdown above.</p>
            </> : <>
                {requirements.map((item) => (<div key={item.id} className='bg-secondary-color flex justify-between items-center p-2 rounded-lg cursor-pointer text-white text-pretty w-full'>
               <div className="flex flex-col gap-1">
                   <p className='text-base font-bold'>{requirementOptions.find((req)=>req.value===item.requirementType) && requirementOptions.find((req)=>req.value===item.requirementType)!.label}</p>
                    <p className='text-sm  font-light'>{item.requiredBookType} {item.requirementQuestion}</p>
                  </div>
                  
                  {item.requiredPagesRead && <LabeledInput defaultValue={item.requiredPagesRead} inputType='number' min={1} additionalClasses="max-w-16 w-full p-2" type={'transparent'} />}
                  {item.requiredBookRead && <LabeledInput defaultValue={item.requiredBookRead} inputType='number' min={1} additionalClasses="max-w-16 w-full p-2" type={'transparent'} />}
                  {item.requirementQuestionPossibleAnswers && <Button onClick={() => {
                    onAnswerModalOpen();
    setModalRequirementContent(item);
                 }} type='blue'>Show Answer</Button>} 
            </div>))}
            </>}
            
          </div>
  
              {modalRequirementContent && answerModal(modalRequirementContent)}
          
  
              <TooltipProvider>
        <Tooltip delayDuration={50}>
                <TooltipTrigger type='button' className='text-primary-color'>
                   <Button additionalClasses='w-fit px-4 py-2 flex gap-2 items-center' onClick={onOpen} type='blue'>New Requirement <IoIosAddCircle /></Button>
          </TooltipTrigger>
          <TooltipContent alignOffset={4} sideOffset={10} className=' bg-dark-gray sm:min-w-72 lg:min-w-96 xl:min-w-[28rem] max-w-lg w-full overflow-x-hidden border-primary-color text-white' side='bottom' align='start'>
                     <p>If you want to specify, what users should have done in order to join your club, you can add a requirement here.</p>
                </TooltipContent>
                  </Tooltip>
                  </TooltipProvider>
  
       
        </div>
        
  
           <label className="flex flex-col gap-3">
            <span className="text-xl text-white font-semibold">Description</span>
        <textarea {...register('description', {
          onChange:(e)=>{
            setValue('description', e.target.value);
          }
        })} className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
        </label>
    
    </>
  )
}

export default RequirementsSection