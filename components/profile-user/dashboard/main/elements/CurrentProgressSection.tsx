'use client';

import { Progress } from '@nextui-org/react';
import Button from 'components/buttons/Button';
import { ShadcnBarChart } from 'components/charts/ShadcnChart';
import Book from 'components/elements/Book';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaSearch } from 'react-icons/fa';
import { FaBookOpen } from 'react-icons/fa6';

type Props = {document:{data:any | null, error:any|null}}

function CurrentProgress({document, }: Props) {
  const navigate= useRouter();  

    return (
     <div id="current-progress" className="flex sm:flex-col xl:flex-row items-center gap-6">
                    <div className="flex sm:flex-col lg:flex-row items-center max-w-3xl w-full gap-12">
                        {document && document.data && document.data.ReadingProgress && document.data.ReadingProgress.length > 0 ?
                          <>
                      <Book additionalClasses='max-w-52 w-full' bookCover={document.data.ReadingProgress[0].book.bookCover} pages={document.data.ReadingProgress[0].book.pages} author={document.data.ReadingProgress[0].book.bookAuthor} bookId={document.data.ReadingProgress[0].book.id} title={document.data.ReadingProgress[0].book.title} bookCategory={document.data.ReadingProgress[0].book.genre} type={'white'} recensions={document.data.ReadingProgress[0].book.recensions.length} />
                      <div className="flex max-w-xl w-full flex-col gap-2">
                        <p className='text-2xl font-semibold text-white'>{document.data.ReadingProgress[0].book.title}</p>
                        <p className='text-white'>{document.data.ReadingProgress.filter((item)=> item.bookId === document.data.ReadingProgress[0].book.id).map((item)=>item.pagesRead).reduce((partialSum, a) => partialSum + a, 0)}/{document.data.ReadingProgress[0].book.pages} Read Pages</p>
                        <Progress
                          aria-label='loading...'
                          className="max-w-60 w-full"
                  size='lg'
                  value={(document.data.ReadingProgress.filter((item)=> item.bookId === document.data.ReadingProgress[0].book.id).map((item)=>item.pagesRead).reduce((partialSum, a) => partialSum + a, 0) / document.data.ReadingProgress[0].book.pages) * 100}
                          classNames={{
                            'indicator':'bg-primary-color'
                          }}
            
                        />
                        <p className='text-white'>{((document.data.ReadingProgress.filter((item)=> item.bookId === document.data.ReadingProgress[0].book.id).map((item)=>item.pagesRead).reduce((partialSum, a) => partialSum + a, 0) / document.data.ReadingProgress[0].book.pages) * 100).toFixed(2)}% Done</p>
                        <Button onClick={()=> navigate.push(`/profile/dashboard/book-progress?bookId=${document.data.ReadingProgress[0].book.id}?readToday=${true}`)} type={'blue'} additionalClasses='flex w-fit px-3 gap-3 items-center justify-around hover:bg-white hover:text-primary-color transition-all hover:scale-95'><span>Read Now</span> <FaBookOpen /> </Button>
            </div>        
                          </>
                          :
                          <>
                                  <Book additionalClasses='max-w-52 w-full' bookCover={''} pages={150} author={'Book Author'} bookId={''} title={'Book Title'} bookCategory={'Book Genre'} type={'white'} recensions={0} />
                      <div className="flex max-w-xl w-full flex-col gap-2">
                        <p className='text-2xl font-semibold text-white'>Book Title</p>
                        <p className='text-white'>{39}/{150} Read Pages</p>
                        <Progress
                          aria-label='loading...'
                          className="max-w-60 w-full"
                  size='lg'
                  value={26}
                          classNames={{
                            'indicator':'bg-primary-color'
                          }}
            
                        />
                        <p className='text-white'>{26}% Done</p>
                        <Button onClick={()=> navigate.push(`/search/books`)} type={'blue'} additionalClasses='flex w-fit px-3 gap-3 items-center justify-around'><span>Search Now</span> <FaSearch /> </Button>
            </div>
            
                          </>
                      }
                  
                    </div>
            
                      <div className="max-w-sm h-72 p-2 w-full bg-dark-gray rounded-lg">
                        <ShadcnBarChart data={[
              {pagesRead:20,
                pagePerHour:30,
              }
            ]} config={{
                          pagesRead:{
                            label:'Read Pages',
                            color: '#2563eb',
                          },
                          pagePerMinutes:{
                            label: 'Pages Per Minute',
                            color: '#2563eb',
                          },
                          pagePerHour:{
                            label: 'Pages Per Hour',
                            color: '#2563eb',
                          }
                          }} dataKeyForXValue={'pagesRead'} dataKeyForBarValue={'pagePerHour'} />
                      </div> 
                      
                    </div>
  )
}

export default CurrentProgress