import React from 'react'

type Props = {children: React.ReactNode}

function ContentContainer({children}: Props) {
  return (
      <div className='flex main-page sm:flex-col 2xl:flex-row overflow-x-hidden mx-auto  gap-4 max-w-7xl w-full'>
          {children}
    </div>
  )
}

export default ContentContainer