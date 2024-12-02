'use client';
import { Step, Steps } from 'intro.js-react'
import React from 'react'
import '../stylings/tourguide.css'
import { HomePageTourGuide } from 'hooks/useTourGuide';

type Props = {
    steps: Step[],
    initialStep: number,
 
}

function TourGuide({steps, initialStep}: Props) {

  const {open, setStep, handleClose} = HomePageTourGuide();


  return (
      <Steps
          options={{
            hintAnimation:true,
        }}
        onChange={step => setStep(step)}
  enabled={open}
  steps={steps}
  initialStep={0}
onExit={(index) => {
  handleClose();
      }}
/>
  )
}

export default TourGuide