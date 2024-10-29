import React from 'react'
import Button from 'components/buttons/Button'
import '../../../stylings/primereact-custom/dataview.css'
import Image from 'next/image'
import { Rating } from 'primereact/rating'
import { GoStar, GoStarFill } from 'react-icons/go'
import { BsThreeDots } from 'react-icons/bs'
import { FaPencil } from 'react-icons/fa6'
import ReactStars from "react-rating-stars-component";

type Props = { userImg: string, username: string, rate: number, recensionId:string, onClick?:(recensionData:{id:string, content:string, rate:number})=>void, isOwner: boolean, content: string, type: 'blue' | 'dark' | 'white' | 'blue-white' | 'dark-blue'}

function Recension({ rate, userImg, username, content, type, isOwner, recensionId, onClick}: Props) {
  return (
    <div className={`flex max-w-3xl w-full flex-col gap-2  rounded-lg ${type === 'blue' ? 'bg-primary-color text-white' : type === 'dark' ? ' bg-dark-gray text-white' : type === 'white' ? 'text-dark-gray bg-white' : type === 'blue-white' ? 'bg-primary-color text-white' : 'bg-dark-gray text-white'} `} >
      <div className={`${type === 'blue' ? 'bg-white text-dark-gray' : type === 'dark' ? ' bg-primary-color text-white' : type === 'white' ? 'bg-white text-primary-color' : type === 'blue-white' ? 'bg-white text-primary-color' : 'bg-primary-color text-white'}  shadow-lg w-full rounded-t-lg flex justify-between items-center  px-2 py-1`}>
               <Rating unselectable='on' unstyled className='flex items-center gap-1' size={20} value={rate} stars={10} cancel={false} readOnly color='#4777ff' />
      
        {isOwner && <Button onClick={() => {
          if (onClick) {
            onClick({id:recensionId, content, rate});
          }
}} type='transparent' additionalClasses='text-lg'><FaPencil/></Button>}
            
          </div>

          <div className="flex flex-col gap-2 px-2 ">
        <p className='line-clamp-6'>{content}</p>
          </div>

      <div className={`flex justify-between shadow-large ${type === 'blue' ? 'bg-white text-dark-gray' : type === 'dark' ? ' bg-primary-color text-white' : type === 'white' ? 'bg-white text-primary-color' : type === 'blue-white' ? 'bg-white text-primary-color' : 'bg-primary-color text-white'}  px-2 py-1 rounded-b-lg items-center w-full`}>
            <div className="flex gap-4 items-center">
                  <Image className=' w-12 h-12 rounded-full' src={userImg} alt='' width={40} height={40} />
          <p className={`${type === 'blue' ? 'text-dark-gray' : type === 'dark' ? 'text-white' : type === 'white' ? 'text-primary-color' : type === 'blue-white' ? 'text-primary-color' : 'text-white'} line-clamp-1 text-sm`}>{username} </p>
        </div>
        <p className='text-xs self-end font-semibold'>1 hour ago</p>
          </div>
    </div>
  )
}

export default Recension