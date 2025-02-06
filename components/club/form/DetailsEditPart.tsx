'use client';

import { useDisclosure } from '@nextui-org/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { EditClub } from 'app/club/[clubId]/settings/page';
import { Requirement, requirementOptions } from 'app/form/competition/page';
import { bookCategories } from 'assets/CreateVariables';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import ModalComponent from 'components/modal/ModalComponent';
import useStorage from 'hooks/storage/useStorage';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaUpload } from 'react-icons/fa6';
import { PiStackPlusFill } from 'react-icons/pi';
import { useSelector } from 'react-redux';
import { Option, SelectValue } from 'react-tailwindcss-select/dist/components/type';
import alertMessages from 'assets/translations/AlertMessages.json';
import Select from 'react-tailwindcss-select';

type Props = {document:{data:any | null, error:any | null}, clubId:string}

function DetailsEditPart({ document, clubId}: Props) {
    
 const { register, reset, getValues, setError, clearErrors, setValue, handleSubmit, watch } = useForm<EditClub>(document && document.data && {
        
   values: {
                  'requirements': document.data.requirements,
            'clubLogo': undefined,
            clubName: document.data.clubName,
            'currentLogo': document.data.clubLogo,
            'isFreeToJoin': document.data.isFreeToJoin,
            'hasRequirements': document.data.hasRequirements,
            'description': document.data.description,
        }
    
    });
    const { register: registerRequirement, reset: resetRequirement, getValues: getRequirementValues, setError: setRequirementError, clearErrors: clearRequirementErrors, setValue: setRequirementValue, handleSubmit: handleRequirementSubmit } = useForm<Requirement>();

    const [requirements, setRequirements] = useState<Requirement[]>(document && document.data && document.data.requirements || []);
    const [selectedBookType, setselectedBookType] = useState<SelectValue>(document && document.data && bookCategories.find((item) => item.value === document.data.bookType) || null);

 const { isOpen, onOpen, onOpenChange, onClose} = useDisclosure();

    const navigation=useRouter();
    const inputFileRef = useRef<HTMLInputElement>(null);
    const [previewImage, setPreviewImage] = useState<string>();
    const selectedLanguage = useSelector((state: any) => state.languageSelection.selectedLangugage);
  const [selectedType, setSelectedType] = useState<SelectValue>(null);
  const queryClient=useQueryClient();

  const {uploadImage, uploadImageUrl}=useStorage();

   

    const {mutateAsync}=useMutation({
      'mutationKey': ['club', clubId],
      'mutationFn': async () => {

        let imageUrl: string | undefined=undefined;
        if (previewImage && getValues('clubLogo')) {
          const { data, error } = await uploadImage(getValues('clubLogo'), 'clubLogo', `${clubId}/${crypto.randomUUID()}`);

          if (error && !data) {
            console.error(error);
            return;
          }

          if(data){
            const imageData = await uploadImageUrl(data.path, 'clubLogo');
            if (imageData ) {
              console.log(imageData);
              imageUrl = imageData;
            }
          }


        }




        const response = await fetch('/api/supabase/club/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
          body:JSON.stringify({where:{id:clubId}, data:{
            clubName: getValues('clubName'),
            description: getValues('description'),
            clubLogo:imageUrl || getValues('currentLogo'),
            isFreeToJoin: getValues('isFreeToJoin'),
            'requirements': {
              'createMany': {
                'skipDuplicates': true,
                data: requirements.filter((item) => !document.data.requirements.find((rule) => rule.id === item.id)).map((item) => ({
        requiredBookRead: item.requiredBookRead && +item.requiredBookRead,
        id: item.id,
        requiredPagesRead: item.requiredPagesRead && +item.requiredPagesRead,
        requirementType: item.requirementType,
        requiredBookType: item.requiredBookType,
        requirementQuestion: item.requirementQuestion,
        requirementQuestionPossibleAnswers: item.requirementQuestionPossibleAnswers && item.requirementQuestionPossibleAnswers.length > 0 ? item.requirementQuestionPossibleAnswers : undefined,
                })),
              },
              'deleteMany':  document.data.requirements.filter((item) => !requirements.find((rule) => rule.id === item.id)).map((item)=>({id:item.id})),

            
    }

          }})
        });

        const fetchedRes = await response.json();

        if(fetchedRes.error){
          toast.error(`${fetchedRes.error}`);
          return;
        }



      },
      onSuccess: async ()=>{
        await queryClient.refetchQueries({queryKey: ['club', clubId],'exact':true, 'type':'active'});
      }
    })
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
      <div>
           {document && document.data && 
              <form onSubmit={handleSubmit(async ()=>{
                await mutateAsync();
                toast.success('Changes saved !');
                navigation.push(`/club/${clubId}`);
              }, (errors) => { })} className="flex flex-col gap-2">
            <div id='first-form-section' className='w-full flex flex-col gap-2'>

              <div  className="flex gap-6 p-2 w-full sm:flex-col 2xl:flex-row 2xl:items-center">
              <div className="flex sm:flex-wrap lg:flex-row gap-5 p-1 items-center">
                  <Image src={previewImage ?? watch('currentLogo')} alt='' className='h-44 w-44 rounded-full' width={60} height={60}/>
                  <div className="flex flex-col self-end gap-1">
                                <p className='text-white font-light text-xs'>Uploaded file can be up to 50MB</p>
                                <input {...register('clubLogo')} onChange={handleSelect} type="file" className='hidden' ref={inputFileRef} />
                                <Button onClick={() => {
                                    if (inputFileRef.current) {
                                        inputFileRef.current.click();
                                    }
                      }} type='blue' additionalClasses='items-center gap-2 flex w-fit'>Upload <FaUpload/></Button>
                          </div>
              </div>
                        <LabeledInput {...register('clubName', {
                        'required':'The Club name is required'
                    })}  defaultValue={getValues('clubName')} additionalClasses='p-2 min-w-80 max-w-xs w-full' label={`Club's Name`} type='dark' />
            

              </div>        
          

                    <div className="flex flex-col gap-2 pb-2">
        <div className="">
          <p className='text-xl text-white font-semibold'>Additional Conditions</p>
          <p className='text-xs text-gray-400'>You can add additional conditions users have to fullfill in order to join the Club.</p>
        </div>

          <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-64 max-w-3xl  bg-dark-gray py-4 px-2 rounded-lg  h-full">
    {requirements.map((item)=>(<div key={item.id} className='bg-secondary-color flex justify-between items-center p-2 rounded-lg cursor-pointer text-white text-pretty w-full'>
             <div className="flex flex-col gap-1">
                 <p className='text-base font-bold'>{requirementOptions.find((req)=>req.value===item.requirementType) && requirementOptions.find((req)=>req.value===item.requirementType)!.label}</p>
                  <p className='text-sm  font-light'>{item.requiredBookType} {item.requirementQuestion}</p>
                </div>
                
                {item.requiredPagesRead && <LabeledInput defaultValue={item.requiredPagesRead} inputType='number' min={1} additionalClasses="max-w-16 w-full p-2" type={'transparent'} />}
                {item.requiredBookRead && <LabeledInput defaultValue={item.requiredBookRead} inputType='number' min={1} additionalClasses="max-w-16 w-full p-2" type={'transparent'} />}
                {item.requirementQuestionPossibleAnswers && item.requirementQuestionPossibleAnswers.length > 0 &&  <Button onClick={() => {
//                   onAnswerModalOpen();
//   setModalRequirementContent(item);
               }} type='blue'>Show Answer</Button>} 
          </div>))}
</div> 

        <Button onClick={onOpen} additionalClasses='w-fit px-4 py-2 flex items-center gap-2' type='blue'>New Condition <PiStackPlusFill/></Button>
        <ModalComponent modalSize='xl' modalFooterContent={<div className='flex gap-3 items-center'>
          <Button onClick={handleRequirementSubmit((data) => {
            setRequirements([...requirements, { ...data, id: crypto.randomUUID() }]);
            resetRequirement();
            onClose();
            
            },(err)=>{})} type='blue' additionalClasses="w-fit  px-4 py-2">
        Append
      </Button>
 </div>} modalTitle='Additional Conditions' modalBodyContent={<div className='flex min-h-80 max-h-96 h-full flex-col gap-3'>

   <div className="flex flex-col gap-1">
     <p className='text-white'>Requirement Type</p>
   <Select isSearchable isClearable
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
  <Select {...registerRequirement('requiredBookType')} classNames={{
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

      </div>
                  <div className="flex flex-col gap-1">
                      <p className='text-white'>Description</p>
                        <textarea {...register('description')} defaultValue={getValues('description')} placeholder='Enter Description' className="w-full text-white max-w-3xl h-60 p-2 rounded-lg bg-dark-gray outline-none border border-primary-color"/>
                  </div>
                  <Button isSubmit type="blue" additionalClasses='w-fit hover:bg-white hover:text-primary-color hover:scale-95 transition-all px-8'>Update</Button>
            </div>

              </form>
            }
    </div>
  )
}

export default DetailsEditPart