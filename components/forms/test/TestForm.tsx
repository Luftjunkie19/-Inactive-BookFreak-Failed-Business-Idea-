'use client';
import { Checkbox } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { Question } from 'app/form/test/page';
import Button from 'components/buttons/Button';
import LabeledInput from 'components/input/LabeledInput';
import { useAuthContext } from 'hooks/useAuthContext';
import { useSearchParams } from 'next/navigation';
import React from 'react'
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import Select from 'react-tailwindcss-select';
import { Option, SelectValue } from 'react-tailwindcss-select/dist/components/type';
import alphabet from 'alphabet';
import QueriesList from './QueriesList';
type Props = {}

function TestForm({ }: Props) {
  const { user } = useAuthContext();
        const searchParams = useSearchParams();
        const editTestId = searchParams.get('editTestId');
     const { register, setValue, control, getValues, handleSubmit, setError, reset, watch } = useFormContext();

   const {register:registerQuestion,setValue:setQuestionValue, control:questionControl, getValues:questionGetValues, handleSubmit:handleQuestionSubmit, setError:setQuestionError, reset:resetQuestion, resetField, clearErrors, }=useForm<Question>();

   const { fields, insert, append, prepend, update, swap, remove, replace } = useFieldArray<Question>({
        name: 'answers', control: questionControl, rules: {
          required: 'The answers are needed for robust work of the app.',
          minLength: 2, 
      }, 
    
      shouldUnregister: true
    });

  const { data: books } = useQuery({
    queryKey: ['books'],
    queryFn: () => fetch(`/api/supabase/book/getAll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        select: undefined,
        orderBy: undefined,
        skip: undefined,
        take: undefined,
        where: undefined,
        include: undefined
      }),
            
    }).then((res) => res.json())
  }
  );

     
      const { fields: queries, insert: insertQuery, append: appendQuery, prepend: prependQuery, update: updateQuery, swap: swapQuery, remove: removeQuery, replace: replaceQuery } = useFieldArray({
        name: 'questions', control, rules: {
      
           validate: ()=> {
            return queries.filter((item) => item.answers.filter((val) => val.isCorrect)).length >= 2 || 'SIR, YOU HAVE TO INCLUDE AT LEAST 2 QUESTIONS !'
          },
          
          
          
        
        },
        shouldUnregister: true
      });

  
const handleContentUpdate = (index: number, content) => {
  const updatedFields = fields.map((field, i) => ({
    ...field,
    answerContent: i === index ? content : field.answerContent,
    }));
    updatedFields.forEach((field, i) => update(i, field));
}

  const handleCheckboxChange = (index: number) => {
  const updatedFields = fields.map((field, i) => ({
    ...field,
    isCorrect: i === index ? !field.isCorrect : false,
  }));
  updatedFields.forEach((field, i) => update(i, field));
};
    
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
  
      };


      const submitHandle= async (testData)=>{
        if(editTestId){
          await updateTest(testData);
        }else{
          await createTest(testData);
        }
      }

  const appendNewQuestion=(data) => {
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
}


  return (
    <div className="w-full h-full flex">
    <form onSubmit={handleSubmit(submitHandle, (err) => {
        console.log(err);
      })} className='xl:bg-dark-gray overflow-y-auto flex flex-col gap-2 p-2 xl:h-screen max-w-xs w-full'>
        <p className='text-xl font-semibold text-white'>Test Creator</p>
        <LabeledInput {...register('name', {
  required: 'You have to name the test anyhow.',
})}
value={watch('name')}
onChange={(event) => {
  setValue('name', event.target.value);
}} additionalClasses='p-2' label='Test Name' type={'dark'}  />

{books && books.data &&
<div className='flex flex-col gap-1'>
<p className='text-white'>Book's reference</p>
<Select isSearchable searchInputPlaceholder='Search a book...' classNames={{'menu':'bg-secondary-color border-primary-color rounded-lg border-2 absolute p-1 max-w-full w-full',  }} value={books.data.map((item) => ({ value: item.id, label: item.title })).find((item) => item.value === watch('bookReferenceId'))} primaryColor={''} {...register('bookReferenceId')} onChange={(valueSelect:SelectValue) => {
          setValue('bookReferenceId', (valueSelect as Option).value);
        } } options={books.data.map((item) => ({ value: item.id, label: item.title }))} />
</div>
}

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
value={watch('description')}
onChange={(event) => {
  setValue('description', event.target.value);
}} className=" font-light p-2 max-w-3xl text-sm w-full h-36 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
    </div>

        <div className="flex gap-4 items-center">
          <Button onClick={() => {
            append({ answerContent: '', isCorrect: false, id:crypto.randomUUID() });
            }} type={'white-blue'}>New Answer</Button>
          <Button onClick={handleQuestionSubmit(appendNewQuestion,(err)=>{
  console.log(err);
})} type={'blue'}>New Question</Button>
        </div>

                <Button isSubmit type={'blue'}>Create Test</Button>

      </form>

      <QueriesList questions={queries}/>
    </div>
  )
}

export default TestForm