import React, { useState } from 'react'

type Props = {}

export function HomePageTourGuide() {
    const [open, setOpen] = useState<boolean>(true);
    
    const [step, setStep] = useState<number>(0);

    const handleNext = () => {
        if (step < 2) {
          setStep(step + 1);
        }
      };
    
      const handlePrev = () => {
        if (step > 0) {
          setStep(step - 1);
        }
      };

      const handleOpen=()=>{
        setOpen(true);
      }

      const handleClose = () => {
        setOpen(false);
      }

  return {open, setOpen, step, setStep, handleNext, handlePrev, handleOpen, handleClose}
}

