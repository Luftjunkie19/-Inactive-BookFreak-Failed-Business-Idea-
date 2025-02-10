'use client';
import { useDisclosure } from '@nextui-org/react';
import Button from 'components/buttons/Button';
import ModalComponent from 'components/modal/ModalComponent';
import { testResultsColumns } from 'components/table/columns/TestRankingColumns';
import { DataTable } from 'components/table/DataTable';
import React, { useState } from 'react'


type Props = {
    document:{data:any | null, error:any|null}
}

function TestResults({document }: Props) {
    const [showTable, setShowTable] = useState<boolean>(false);
    
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

    return (
      <>
       <div className="flex flex-col gap-2 p-2 w-full">
        <div className="flex gap-2 my-2 items-center">
          <Button onClick={()=>setShowTable(false)} type={!showTable ? 'blue' : 'white'} additionalClasses=' font-normal'>Questions</Button>
          <Button onClick={()=>setShowTable(true)} type={showTable ? 'blue' : 'white'} additionalClasses=' font-normal'>Ranking</Button>
</div>
      
       <div className="flex flex-col gap-2 overflow-y-auto">
            {showTable && <div className='max-w-[90%] mx-auto w-full'>
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
                
            </div>
            </div>))}

           
         
      
          </div>
            </>}
                </div>
                </div>
      </>
  )
}

export default TestResults