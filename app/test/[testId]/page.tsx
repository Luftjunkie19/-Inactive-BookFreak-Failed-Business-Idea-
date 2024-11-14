'use client';

import React, {
  use,
  useEffect,
  useState,
} from 'react';

import image from '../../../assets/Logo.png'
import Lottie from 'lottie-react';
import {
  FaArrowDown,
  FaFlag,
  FaGamepad,
  FaHeart,
  FaPencil,
  FaPlay,
  FaShare,
  FaTrash,
  FaTrashCan,
} from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import {
  useNavigate,
  useParams,
} from 'react-router';
import Link  from 'next/link';
import uniqid from 'uniqid';
import alphabet from 'alphabet'
import translations from '../../../assets/translations/BookPageTranslations.json';
import formTranslations from '../../../assets/translations/FormsTranslations.json';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import RemoveBtn from 'components/buttons/RemoveBtn';
import TestTable from 'components/test/TestTable';
import Button from 'components/buttons/Button';
import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ModalComponent from 'components/modal/ModalComponent';
import { useDisclosure } from '@nextui-org/react';
import { FaInfoCircle } from 'react-icons/fa';
import { DataTable } from 'components/table/DataTable';
import { testResultsColumns } from 'components/table/columns/TestRankingColumns';
import toast from 'react-hot-toast';


function TestMainPage({params}:{params:{testId:string}}) {
  const { user } = useAuthContext();
  const { testId } = use(params);
  const [showTable, setShowTable] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const getUniqueUsers = (users: any[]) => {
    const uniqueUsers = users.filter((user, index, self) => {
      return self.findIndex((t) => t.userId === user.userId) === index;
    });
    return uniqueUsers;

}


  const { data: document } = useQuery({
    queryKey: ['test'], queryFn: async () => {
      return fetch('/api/supabase/test/get', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({where:{id:params.testId }}),
  }).then((res)=>res.json())
    }
     })

  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const navigate = useRouter();

  const { isOpen:isAnswerModalOpen, onOpen:onAnswerModalOpen, onOpenChange:onAnswerModalOpenChange, onClose:onAnswerModalClose} = useDisclosure();
  const [modalQuestion, setModalQuestion] = useState<any>(null);


const answerModal=(item:any)=>{
      return(<ModalComponent modalSize='sm' isOpen={isAnswerModalOpen} modalTitle='Q&A' modalBodyContent={<div className="w-full h-fit flex flex-col gap-3">
        <p className="text-white text-xl font-bold">{item.questionContent}</p>
        {item.answers.map((item, index) => (<p key={item.id} className={`${item.isCorrect ? 'text-green-400 font-semibold' : 'text-white'}`}>{alphabet[index].toUpperCase()}. {item.answerContent}</p>))}
      </div>} onClose={()=>{
          setModalQuestion(null);
          onAnswerModalClose();
      }} onOpenChange={()=>{
        onAnswerModalOpenChange();
      }}/>)
     }
const moveToTest = () => {
    navigate.push(
      `/test/${document.data.id}/played?time=${new Date().getTime()}?attemptId=${crypto.randomUUID()}`
    );
  };

  const {mutateAsync}=useMutation({
    mutationKey: ['test', testId],
    mutationFn: async () => {
     if(document && document.data && testId && user && !document.data.testLovers.find((item)=>item.loverId === user!.id)) {
      console.log(testId, user);
      
      const res = await fetch('/api/supabase/lover/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({data:{
            'id':`${testId}${user.id}`,
            'loverId':user.id,
            'testId':testId
          }}),
      }); 
      const {data, error} = await res.json();

      console.log(data, error);
      if(!data){
        toast.error('Something went wrong');
        throw new Error('Something went wrong');
      }
      toast.success('You are now a test lover');
     }else{
      if(document && document.data && user){
      const res=  await fetch('/api/supabase/lover/delete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({where:{id:`${testId}${user.id}`}}),
        }); 

      const {data, error}= await res.json();

       if(!data && error){
          toast.error('Something went not correctly');
          throw new Error('Something went wrong');
        }

        toast.success('You are not a test lover anymore.');
      
      }
     }
    },
    onSuccess: async () => {
      await queryClient.refetchQueries({'queryKey':['test', testId], exact: true, 'type':'all'});
    }
  })

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard');
  };

  return (
    <div className={`h-screen w-full flex gap-2`}>
     

        {document && document.data && <>
        <div className="flex bg-dark-gray gap-2 h-screen p-2 flex-col max-w-sm w-full text-white">
          <Image src={image} alt='' width={60} height={60} className='h-60 max-w-60 w-full p-2 object-cover rounded-2xl' />
            <p className='text-xl text-white'>{document.data.name}</p>
          <div className="flex justify-between items-center">
            <div className="">
            <div className='text-sm flex gap-2 items-center text-white'>
              <p>{document.data.results.length} Plays</p>
              <p>{getUniqueUsers(document.data.results).length} Players</p>
             </div>
            </div>
            <div className="flex gap-[0.125rem] text-xl items-center">
              <Button onClick={mutateAsync} type='transparent'>
                <FaHeart  className={`${user && document.data.testLovers.find((item)=>item.loverId === user.id) ? 'text-red-400 hover:scale-95 hover:text-white' : 'text-white hover:scale-95 hover:text-red-400'} transition-all `} />
              </Button>
                <Button onClick={copyLink} type='transparent'>
                <FaShare className='text-white hover:text-primary-color transition-all hover:scale-95' />
              </Button>
                <Button type='transparent'>
                <FaFlag className='text-white hover:text-primary-color transition-all hover:scale-95' />
              </Button>
</div>
          </div>
          <div className="flex gap-2 items-center">
                    <Button onClick={moveToTest} type='black' additionalClasses='bg-green-400'>Start Test</Button>
            <Button type='white'>Attempt</Button>
          </div>
        <p>{document.data.questions.length} Queries</p>
          <div className="flex flex-col gap-1">
            <p className='text-lg font-semibold'>Description</p>
            <div className='overflow-y-auto w-full max-h-36'>{document.data.description}</div>
          </div>
        </div>


      <div className="flex flex-col gap-2 p-2 w-full">
        <div className="flex gap-2 my-2 items-center">
          <Button onClick={()=>setShowTable(false)} type={!showTable ? 'blue' : 'white'} additionalClasses=' font-normal'>Questions</Button>
          <Button onClick={()=>setShowTable(true)} type={showTable ? 'blue' : 'white'} additionalClasses=' font-normal'>Ranking</Button>
</div>
          <div className="flex flex-col gap-2 overflow-y-auto">
            {showTable && <div className='max-w-6xl w-full'>
            <DataTable columns={testResultsColumns} data={document.data.results.map((item) => ({
                id: item.id,
  photoURL: item.user.photoURL,
  userId:item.user.id,
  nickname: item.user.nickname,
  gainedPoints: item.score,
  accuracyOnQuestionsQuote: item.percentageResult,
  timeSpent:item.timeDevoted,          
  timeStarted: new Date(item.timeStarted),
  timeFinished: new Date(item.timeFinished)
            }))} filterColumnName={'nickname'} />
            </div>}
            {!showTable && <>
              <p className='text-xl font-semibold text-white'>Questions</p>
          <div className="flex flex-col gap-3 overflow-y-auto w-full sm:max-h-96 2xl:max-h-[36rem] h-full ">
      {document && document.data && document.data.questions && document.data.questions.map((query, index)=>(<div key={query.id} className="bg-dark-gray p-2 rounded-lg text-white flex flex-col gap-1 max-w-3xl w-full">
              <p>{index + 1} Question</p>
              <p>{query.questionContent}</p>
              <div className="flex justify-between items-center p-2">
                <p>{query.answers.length} Answers</p>
                <Button onClick={()=>{
                  setModalQuestion(query);
                  onAnswerModalOpen();
                }} type='dark-blue' additionalClasses='flex gap-2 text-sm font-base items-center'>Show Answers <FaInfoCircle/></Button>
            </div>
            </div>))}

            {modalQuestion && answerModal(modalQuestion)}
         
      
          </div>
            </>}
 </div>
 
 
        {/* <TestTable/> */}
      </div>
      </>}
    </div>
  );
}

export default TestMainPage;
