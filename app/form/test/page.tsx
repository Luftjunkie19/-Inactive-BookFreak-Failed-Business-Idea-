  'use client'; 
  import '../../../stylings/primereact-custom/dataview.css'

  import React, { useState } from 'react';

  import {
    FaPlus,
    FaQuestionCircle,
    FaTrashAlt,
  } from 'react-icons/fa';
  import {
    FaPencil,
    FaTrashCan,
  } from 'react-icons/fa6';
  import { PiExamFill } from 'react-icons/pi';
  import {
    useDispatch,
    useSelector,
  } from 'react-redux';
  import uniqid from 'uniqid';


  import alertMessages from '../../../assets/translations/AlertMessages.json';
  import translations from '../../../assets/translations/BookPageTranslations.json';
  import formTranslations from '../../../assets/translations/FormsTranslations.json';
  import { useAuthContext } from '../../../hooks/useAuthContext';
  import { useRouter, useSearchParams } from 'next/navigation';
  import LabeledInput from 'components/input/LabeledInput';
  import { MdNoteAdd, MdQuestionAnswer } from 'react-icons/md';
  import Question from 'components/elements/question/Question';
  import { DataView } from 'primereact/dataview';
  import { Pagination, useDisclosure } from '@nextui-org/react';
  import Button from 'components/buttons/Button';
  import AdBanner from 'components/advertisements/AdBanner';
  import { BsQuestionCircleFill } from 'react-icons/bs';
  import { useFieldArray, useForm, useWatch } from 'react-hook-form';
  import TestQuestion from 'components/question/TestQuestion';
  import { Checkbox } from '@/components/ui/checkbox';
  import ModalComponent from 'components/modal/ModalComponent';
  import toast from 'react-hot-toast';
  import { useQuery } from '@tanstack/react-query';
import Select from 'react-tailwindcss-select';
import { Option, SelectValue } from 'react-tailwindcss-select/dist/components/type';
import FormContainer from 'components/forms/FormContainer';
import TestForm from 'components/forms/test/TestForm';

  const alphabet = require('alphabet');

  interface Test {
    name:string,
    description: string,
    questions:Question[],
    bookReferenceId?: string,
    answers:Answer[]
  }

  export interface Question {
    id:string,
    questionContent: string,
    correctAnswer: string | string[],
    answers:Answer[]
  }

  export interface Answer {
    answerContent: string,
    isCorrect: boolean,
    id:string,
  }

  function CreateTests() {
    const { user } = useAuthContext();
    const navigate = useRouter();
    const dispatch = useDispatch();

    
    const { register, setValue, control, getValues, handleSubmit, setError, reset, watch } = useForm<Test>(
    editTestId ? {
      defaultValues:  async ()=>{
        const response = await fetch(`/api/supabase/test/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({where:{
              id: editTestId
            }})
        });
        const data = await response.json();
        return {
          'name': data.data.name,
          'description': data.data.description,
          'questions': data.data.questions,
          'answers': data.data.answers,
          'bookReferenceId': data.data.bookReferenceId
        };
      },
    } : undefined
    );
    const {register:registerQuestion,setValue:setQuestionValue, control:questionControl, getValues:questionGetValues, handleSubmit:handleQuestionSubmit, setError:setQuestionError, reset:resetQuestion, resetField, clearErrors, }=useForm<Question>({
      
    });
    const { fields, insert, append, prepend, update, swap, remove, replace } = useFieldArray<Question>({
      name: 'answers', control: questionControl, rules: {
        required: 'The answers are needed for robust work of the app.',
        minLength: 2, 
    }, 
  
    shouldUnregister: true
  });
    const { fields: queries, insert: insertQuery, append: appendQuery, prepend: prependQuery, update: updateQuery, swap: swapQuery, remove: removeQuery, replace: replaceQuery } = useFieldArray({
      name: 'questions', control, rules: {
        required:true,
        minLength: 2,
        validate: ()=> {
          return queries.filter((item) => item.answers.filter((val) => val.isCorrect)).length >= 2
        },
        
        
        
      
      },
      shouldUnregister: true
    });


    const [testName, setTestName] = useState(watch('name'));
const [testDescription, setTestDescription] = useState(watch('description'));


const handleCheckboxChange = (index: number) => {
  const updatedFields = fields.map((field, i) => ({
    ...field,
    isCorrect: i === index ? !field.isCorrect : false,
  }));
  updatedFields.forEach((field, i) => update(i, field));
};
  
const handleContentUpdate = (index: number, content) => {
  const updatedFields = fields.map((field, i) => ({
    ...field,
    answerContent: i === index ? content : field.answerContent,
    }));
    updatedFields.forEach((field, i) => update(i, field));
}


    const selectedLanguage = useSelector(
      (state:any) => state.languageSelection.selectedLangugage
    );
    const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
    const { isOpen:isAnswerModalOpen, onOpen:onAnswerModalOpen, onOpenChange:onAnswerModalOpenChange, onClose:onAnswerModalClose} = useDisclosure();
    const [modalQuestion, setModalQuestion] = useState<Question>();


  const answerModal=(item:Question)=>{
        return(<ModalComponent modalSize='sm' isOpen={isAnswerModalOpen} modalTitle='Q&A' modalBodyContent={<div className="w-full h-fit flex flex-col gap-3">
          <p className="text-white text-xl font-bold">{item.questionContent}</p>
          {item.answers.map((item, index) => (<p key={item.id} className={`${item.isCorrect ? 'text-green-400 font-semibold' : 'text-white'}`}>{alphabet[index].toUpperCase()}. {item.answerContent}</p>))}
        </div>} onClose={()=>{
            setModalQuestion(undefined);
            onAnswerModalClose();
        }} onOpenChange={()=>{
          onAnswerModalOpenChange();
        }}/>)
      }

      const {data:books}=useQuery({
        queryKey: ['books'],
        queryFn:  () =>fetch(`/api/supabase/book/getAll`, {
            method:'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              select:undefined,
               orderBy:undefined, 
               skip:undefined, 
               take:undefined, 
               where:undefined,
               include:undefined
            }),
            
        }).then((res)=>res.json())}
      )

    return (
      <div className={`h-screen w-full flex`}>
     
        <FormContainer<Test>>
          <TestForm/>
        </FormContainer>
        
        <div className="w-full flex flex-col gap-2 p-4">
          <div className="text-white">
          <p className='text-3xl font-semibold'>Test , Correct and gain your knowledge </p>
          <p className='text-sm font-light'>No Test about recent book you have read ? Don’t hesitate and create the Test !</p>
        <AdBanner/>
            
        </div>
        
          <p className='text-white flex gap-2 items-center'><BsQuestionCircleFill className='text-primary-color text-2xl' /> {getValues('questions') ? getValues('questions').length > 0 : 0} Questions</p>
          <div className="flex flex-col gap-3 overflow-y-auto">

            {getValues('questions') && getValues('questions').length === 0 && <>
            <p className='text-white'>No questions yet</p>
            </>}

            {getValues('questions') && getValues('questions').length > 0 && getValues('questions').map((item, index) => (<TestQuestion key={item.id} onClick={() => {
              setModalQuestion(item);
              onAnswerModalOpen();
          }} answers={item.answers} questionContent={item.questionContent} index={index} />))}

            {modalQuestion && answerModal(modalQuestion)}

          </div>

        </div>

      </div>
    );
  }

  export default CreateTests;
