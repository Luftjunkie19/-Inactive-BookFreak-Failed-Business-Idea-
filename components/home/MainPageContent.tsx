import React from 'react'
import MainPageTabs from './MainPageTabs'

type Props = {}

function MainPageContent({}: Props) {
  return (
      <div className='max-w-7xl w-full'>
          <MainPageTabs/>
          
    </div>
  )
}

export default MainPageContent