import BookAd from 'components/advertisements/BookAd'
import { formatDistanceToNow } from 'date-fns'
import React from 'react'

type Props = {bookData: any}

function BookDetails({bookData}: Props) {
  return (
    <div className="flex gap-6 items-center py-4 w-full">
          <div className="flex max-w-lg w-full flex-col gap-1">
            <p className='text-white text-lg font-semibold'>Description</p>
            <div className="overflow-y-auto min-h-56 max-h-56 h-full bg-dark-gray text-white rounded-lg p-2 max-w-lg w-full">
              {bookData.bookDescription}
            </div>
       </div>
            
          <div className="max-w-sm w-full"> 
            
<p className='text-white text-lg font-semibold'>Book Details</p>
            <div className="overflow-y-auto text-white min-h-56 max-h-56 h-full bg-dark-gray flex flex-col gap-1 rounded-lg p-2 max-w-sm w-full">
              <p>Full title: {bookData.fullTitle}</p>
              <p>Genre: {bookData.genre}</p>
              <p>Pages: {bookData.pages}</p>
              <p>Released: {formatDistanceToNow(new Date(bookData.releaseDate))}</p>
            </div>
    </div>
  

          
         <BookAd/>
    

        </div>
  )
}

export default BookDetails