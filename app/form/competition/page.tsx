import React from 'react'
import Competition from 'components/elements/Competition';
import Form from 'components/forms/competition/Form';
import FormContainer from 'components/forms/FormContainer';
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';



export  const requirementOptions=[
    { value: 'rule1', label: 'Min. Read Pages of Genre' },
    { value: 'rule2', label: 'Min. Read Books of Genre' },
    { value: 'rule3', label: 'Min. Read Books Amount' },
    { value: 'rule4', label: 'Min. Read Pages Amount' },
    { value: 'rule5', label: 'Peculiar Question' }
    ]


export interface Requirement{
  id:string,
  requirementType: 'rule1' | 'rule2' | 'rule3' | 'rule4' | 'rule5' | null,
  requiredBookType?: string,
  requiredBookRead?: number,
  requiredPagesRead?: number,
  requirementQuestion?: string,
  requirementQuestionPossibleAnswers?: string[],
}

export type Competition = {
 competitionTitle: string,
  competitionsName: string,
    competitionLogo:File,
    expiresAt:  Date | null ,
    description: string,
    prizeType: 'money' | 'item' | null,
    chargeId?: string  ,
  prizeHandedIn: false,   
  prizeDescription?:string,
    prize: {
      moneyPrize?: {
        amount: number | null,
        currency: string | null,
      },
      itemPrize?: {
        title: string | null,
        typeOfPrize: SelectValue,
        bookReferenceId?: SelectValue,
        voucherFor?: string,
        voucherEventLink?:string
      },
  },
    requirements?:Requirement[]
}

function CreateCompetition() {




 

    const formula1=`TP = 2 \\cdot \\text{BR} + 10 \\cdot \\left[\\text{G} \\geq 3\\right] + 5 \\cdot \\text{S} + 15 \\cdot \\left[\\left(\\text{ABPD} < 5\\right) \\land \\left(\\text{BR} \\geq 5\\right)\\right]`;
    
    const formula2=`\\text{TP} = \\text{BR} + \\text{Rec. Sent} + 
  \\begin{cases} 
    10 & \\text{Rec. Accepted} \\geq 3 \\\\ 
    0 & \\text{otherwise} 
    \\end{cases} + 
    \\begin{cases} 
    15 & \\text{Disc. Initiated} \\geq 5 \\\\ 
    0 & \\text{otherwise} 
    \\end{cases} + 
    5 \\cdot \\text{Collab. Streaks} + 
    \\begin{cases} 
    20 & \\text{Feedback} \\geq 10 \\\\ 
    0 & \\text{otherwise} 
    \\end{cases}`;
  
    const formula3 = `
    \\text{TP} = 0.5 \\cdot \\text{PR} + 5 \\cdot \\text{BC} + (\\text{TA} \\cdot \\frac{\\text{A}}{2}) + \\left\\lfloor \\frac{\\text{AD}}{30} \\right\\rfloor 
    \\\\ 
    + \\left( \\text{if } \\frac{\\left| \\text{AD} - \\text{PD} \\right|}{\\text{PD}} \\leq 0.1, \\ 2, \\ 0 \\right) 
    - \\left( \\text{if } \\text{AD} < 0.5 \\cdot \\text{PD}, \\ 5, \\ 0 \\right)
  `;

    

  



  return (

 <FormContainer<Competition>>
  <Form/>
 </FormContainer>

  );
}

export default CreateCompetition;
