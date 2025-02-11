 import '../../../stylings/primereact-custom/dataview.css'
  import React from 'react';

  import Question from 'components/elements/question/Question';

import FormContainer from 'components/forms/FormContainer';
import TestForm from 'components/forms/test/TestForm';



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
    return (
        <FormContainer<Test>>
          <TestForm/>
        </FormContainer>
    );
  }

  export default CreateTests;
