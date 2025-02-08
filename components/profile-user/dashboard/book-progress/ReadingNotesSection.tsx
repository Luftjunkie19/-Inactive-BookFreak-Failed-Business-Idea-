import React from 'react'
import { FaPlusCircle } from 'react-icons/fa'

type Props = {}

function ReadingNotesSection({}: Props) {
  return (
     <div className="flex flex-col gap-2">
            <div className="">
              <p className='text-white text-2xl'>Reading Notes</p>
              <p className='text-gray-400 text-sm '>You read something interesting and you want to note it ? Do it here and avoid fear of loosing the notes !</p>
            </div>
    
            <div className="flex items-center gap-3">
              <div className="max-w-64 w-full cursor-pointer flex flex-col justify-center items-center gap-4 h-96 p-2 rounded-lg bg-dark-gray border-primary-color border-2">
                
                <FaPlusCircle className='text-6xl text-primary-color'/>
                
                <div className="text-white flex flex-col gap-1 items-center justify-center">
                <p className='text-lg'>Add new Note</p>
                <p className='text-sm text-center text-gray-400'>Remember it forever and search never more in notebooks !</p>
                </div>
              </div>
            </div>
    
          </div>
  )
}

export default ReadingNotesSection