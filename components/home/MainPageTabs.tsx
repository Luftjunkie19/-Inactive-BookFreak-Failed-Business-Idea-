import Button from 'components/buttons/Button'
import React from 'react'
import { BsPeopleFill } from 'react-icons/bs'
import { FaShieldAlt } from 'react-icons/fa'
import { IoPersonSharp } from 'react-icons/io5'
import { TbTournament } from 'react-icons/tb'

type Props = {}

function MainPageTabs({}: Props) {
    return (
      <div className="flex flex-col gap-2 max-w-6xl w-full mx-auto">
  <p className='text-white text-lg'>Choose what you want to see</p>          
      <div className='flex items-center gap-2 overflow-x-auto w-full '>
          <Button additionalClasses='transition-all duration-300 flex items-center gap-2 text-nowrap' type='blue'>For You </Button>
         <Button additionalClasses='transition-all duration-300 flex items-center gap-2 text-nowrap' type='white-blue'>Your Friends <BsPeopleFill /></Button>
          <Button additionalClasses='transition-all duration-300 flex items-center gap-2 text-nowrap' type='white-blue'>Clubs <FaShieldAlt /></Button>
          <Button additionalClasses='transition-all duration-300 flex items-center gap-2 text-nowrap' type='white-blue'>Tournaments <TbTournament /> </Button>

    </div>
      </div>
  )
}

export default MainPageTabs