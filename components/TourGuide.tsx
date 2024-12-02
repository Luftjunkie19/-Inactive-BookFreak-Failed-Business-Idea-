'use client';
import { Step, Steps } from 'intro.js-react'
import React from 'react'
import '../stylings/tourguide.css'

type Props = {
    steps: Step[],
    enabled: boolean,
    initialStep: number,
 
}

function TourGuide({steps, initialStep, enabled}: Props) {
  return (
      <Steps
          options={{
            hintAnimation:true,
        }}
  enabled={enabled}
  steps={steps}
  initialStep={initialStep}
onExit={(index) => {
        console.log(index);
      }}
/>
  )
}

export default TourGuide