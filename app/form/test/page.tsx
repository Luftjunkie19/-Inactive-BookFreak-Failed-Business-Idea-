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
    const searchParams = useSearchParams();
    const editTestId = searchParams.get('editTestId');
    
    const { register, setValue, control, getValues, handleSubmit, setError, reset } = useForm<Test>(
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


    const [testName, setTestName] = useState(getValues('name'));
const [testDescription, setTestDescription] = useState(getValues('description'));


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

      const createTest = async (testData) => {
        const testId = crypto.randomUUID();
        try {
        
          if (!user) {
            toast.error(`You're not logged in`);
            return;
          }

        const fetchTest = await fetch('/api/supabase/test/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              id:testId,
            name: testData.name,
            createdAt: new Date(),
            description: testData.description,
            creatorId: user.id
          }
          })
        });
          
     

          const fetchQuestions = await fetch('/api/supabase/test/questions/createMany', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: testData.questions.map((item) => ({ 
              correctAnswer: item.correctAnswer, 
              id: item.id, testId, 
              questionContent: item.questionContent })) })
          });
          
          
      


          const answers = await fetch('/api/supabase/test/answers/createMany', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              data: testData.questions.
                map((item) => ({ answers: item.answers, id: item.id })).map((obj) => (
                  obj.answers.map((item) => ({ ...item, questionId: obj.id }))
                )).flat(2)
            })
          });

      await Promise.all([fetchTest, fetchQuestions, answers]);

      } catch (error) {
          console.log(error);
      }
      };

      const updateTest = async (testData) => {

        const response = await fetch(`/api/supabase/test/get`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({where:{
              id: editTestId
            }})
        });
        const dataTest = await response.json();


        const fetchTest = await fetch('/api/supabase/test/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            where:{
              id: editTestId,
            },
            data: {
              name: testData.name,
              description: testData.description,
            }
          })
        });
        
        const fetchNewQuestions = await fetch('/api/supabase/test/questions/createMany', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: testData.questions.map((item) => ({ 
            correctAnswer: item.correctAnswer, 
            id: item.id, 
            testId:editTestId, 
            questionContent: item.questionContent
           })).filter((item)=>{
            if(!dataTest.data.questions.find((val) => val.id === item.id)){
              return item;
            }
           })})
        });

        const fetchUpdateQuestions = await fetch('/api/supabase/test/questions/updateMany', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: testData.questions.
            map((item) => ({ answers: item.answers, id: item.id })).map((obj) => (
              obj.answers.map((item) => ({ ...item, questionId: obj.id }))
            )).flat(2).filter((item)=>{
              if(dataTest.data.questions.
                map((item) => ({ answers: item.answers, id: item.id })).map((obj) => (
                  obj.answers.map((item) => ({ ...item, questionId: obj.id }))
                )).flat(2).find((val) => val.id === item.id)){
                return item;
              }
            })})
        });

      
     const updateAnswers = await fetch('/api/supabase/test/answers/updateMany', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data:testData.questions.
            map((item) => ({ answers: item.answers, id: item.id })).map((obj) => (
              obj.answers.map((item) => ({ ...item, questionId: obj.id }))
            )).flat(2).filter((item)=>{
              if(dataTest.data.questions.
                map((item) => ({ answers: item.answers, id: item.id })).map((obj) => (
                  obj.answers.map((item) => ({ ...item, questionId: obj.id }))
                )).flat(2).find((val) => val.id === item.id)){
                return item;
              }
            })
          })
        });

        const newAnswers = await fetch('/api/supabase/test/answers/createMany', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data:testData.questions.
            map((item) => ({ answers: item.answers, id: item.id })).map((obj) => (
              obj.answers.map((item) => ({ ...item, questionId: obj.id }))
            )).flat(2).filter((item)=>{
              if(!dataTest.data.questions.
                map((item) => ({ answers: item.answers, id: item.id })).map((obj) => (
                  obj.answers.map((item) => ({ ...item, questionId: obj.id }))
                )).flat(2).find((val) => val.id === item.id)){
                return item;
              }
            })
          })
        });

        console.log(await newAnswers.json());


    


      };


      const submitHandle= async (testData)=>{
        if(editTestId){
          await updateTest(testData);
        }else{
          await createTest(testData);
        }
      }

    return (
      <div className={`h-screen w-full flex`}>
     
        <form onSubmit={handleSubmit(submitHandle, (err) => {
          console.log(err);
        })} className='xl:bg-dark-gray overflow-y-auto flex flex-col gap-2 p-2 xl:h-screen max-w-xs w-full'>
          <p className='text-xl font-semibold text-white'>Test Creator</p>
          <LabeledInput {...register('name', {
    required: 'You have to name the test anyhow.',
  })}
  value={testName}
  onChange={(event) => {
    setTestName(event.target.value);
    setValue('name', event.target.value);
  }} additionalClasses='p-2' label='Test Name' type={'dark'}  />
          <LabeledInput {...registerQuestion('questionContent', {
            required:'You have to enter the content in order to write a question',
            onChange: (e) => {
              setQuestionValue('questionContent', e.target.value);
            }
          })} additionalClasses='p-2' label='Question' type={'dark'}  />
          
          <div className="flex flex-col gap-2">
            <p className='text-lg text-white'>Possible Answers</p>
            <div className={`flex flex-col overflow-y-auto gap-2 ${questionGetValues('answers') && questionGetValues('answers').length > 0 && 'h-52'}`}>
              {fields.length > 0 && fields.map((field, index) => (
                <div key={index} className='flex gap-4 w-full items-center'>
                  <LabeledInput key={field.id} {...registerQuestion(`answers.${index}.answerContent`, {
                       validate:{
                        requiredValue:(value)=>{
                          if (value.trim() === '') {
                            return 'You have to enter the answer content';
                          }
                        },
                      },
                  })}  onBlur={(event)=>{
                    handleContentUpdate(index, event.target.value);       
                  }}  additionalClasses='p-2 w-full self-end' label={`Answer ${alphabet[index].toUpperCase()}`} type={'dark'} />
                <Checkbox  onClick={() => {
                  handleCheckboxChange(index);
                }} {...registerQuestion(`answers.${index}.isCorrect`, {
                  validate: {
                    noSelected: (value, values) => {
                      if(!values.answers.find((item) => item.isCorrect)) {
                        return 'You have to select one answer as correct';
                      }
                    }
                  },
                  
                })}  
                
                
                
                
                checked={field.isCorrect}  className='data-[state=checked]:bg-primary-color border-primary-color self-end' id={field.id} />
                </div>
      ))}
            </div>
          </div>

          <div className="">
                <p className='text-white text-base'>Description</p>
        <textarea  {...register('description', {
    required: `You have to type the description, otherwise it won't be able to insert the test.`,
  })}
  value={testDescription}
  onChange={(event) => {
    setTestDescription(event.target.value);
    setValue('description', event.target.value);
  }} className=" font-light p-2 max-w-3xl text-sm w-full h-36 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
      </div>

          <div className="flex gap-4 items-center">
            <Button onClick={() => {
              append({ answerContent: '', isCorrect: false, id:crypto.randomUUID() });
              }} type={'white-blue'}>New Answer</Button>
            <Button onClick={handleQuestionSubmit((data) => {
    append([...data.answers]); // Add answers to current question
    appendQuery({
      ...data,
      correctAnswer: data.answers.filter((item) => item.isCorrect).map((item) => item.id),
      id: crypto.randomUUID(),
    });
    resetQuestion();   // Clears question form for new entry
    replace([]);       // Clears all answer inputs
    resetField('answers');
    setQuestionValue('questionContent', ''); // Clears specific field
    resetQuestion({
      questionContent: '',
      answers: []
  });
  },(err)=>{
    console.log(err);
  })} type={'blue'}>New Question</Button>
          </div>

                  <Button isSubmit type={'blue'}>Create Test</Button>

        </form>
        
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
