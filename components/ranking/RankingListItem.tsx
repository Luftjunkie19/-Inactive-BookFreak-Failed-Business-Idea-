import Image from 'next/image'
import React from 'react'

type Props = {
    image:string
    username:string
    booksAmount?:number
    pagesAmount?:number
  rankingPlace: number
    points?:number
}

function RankingListItem({image, username, booksAmount, pagesAmount,rankingPlace, points}: Props) {
  return (
    <div className="p-2 flex gap-2 items-center text-white">
    <Image alt='' src={image} width={60} height={60} className='w-12 h-12 rounded-full' />
    <div className="flex flex-col flex-1 gap-1">
        <p>{username}</p>
        <p className='text-sm font-light'>{booksAmount && `${booksAmount} Books`} {pagesAmount && `${pagesAmount} Pages`} {!isNaN(points as number) && `${points} Points`}</p>
    </div>
    <div className={`p-2 align-middle text-center text-sm table-cell rounded-full text-white ${rankingPlace === 1 ? 'bg-orange-300' : rankingPlace === 2 ? 'bg-gray-500' : rankingPlace === 3 ? 'bg-brown-500' : 'bg-primary-color' } `}>#{rankingPlace}</div>
  </div>
  )
}

export default RankingListItem