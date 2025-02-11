'use client';
import { useDisclosure } from '@nextui-org/react';
import { Question } from 'app/form/test/page';
import AdBanner from 'components/advertisements/AdBanner';
import ModalComponent from 'components/modal/ModalComponent';
import TestQuestion from 'components/question/TestQuestion';
import React, { useState } from 'react'
import { BsQuestionCircleFill } from 'react-icons/bs';
import alphabet from "alphabet";
type Props = {questions:Question[]}

function QueriesList({ questions}: Props) {
    
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


  return (
    <div className="w-full flex flex-col gap-2 p-4">
          <div className="text-white">
          <p className='text-3xl font-semibold'>Test , Correct and gain your knowledge </p>
          <p className='text-sm font-light'>No Test about recent book you have read ? Don’t hesitate and create the Test !</p>
        <AdBanner/>
            
        </div>
        
          <p className='text-white flex gap-2 items-center'><BsQuestionCircleFill className='text-primary-color text-2xl' /> { questions.length > 0 ? questions.length : 0} Questions</p>
          <div className="flex flex-col gap-3 overflow-y-auto">

            {questions && questions.length === 0 && <>
            <p className='text-white'>No questions yet</p>
            </>}

            {questions && questions.length > 0 && questions.map((item, index) => (<TestQuestion key={item.id} onClick={() => {
              setModalQuestion(item);
              onAnswerModalOpen();
          }} answers={item.answers} questionContent={item.questionContent} index={index} />))}

            {modalQuestion && answerModal(modalQuestion)}

          </div>

        </div>
  )
}

export default QueriesList