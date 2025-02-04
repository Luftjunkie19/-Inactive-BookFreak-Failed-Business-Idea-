'use client'

import React from 'react'
import { ThirdwebProvider } from "thirdweb/react";
type Props = {children: React.ReactNode}

function ThirdWProvider({children}: Props) {
  return (
      <ThirdwebProvider>
          {children}
    </ThirdwebProvider>
  )
}

export default ThirdWProvider