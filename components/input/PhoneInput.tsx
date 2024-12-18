import React, { useState } from 'react'
import {motion} from "framer-motion"

type Props = {
    selectedCountry: string,
    setSelectedCountry: (country: string) => void
}

import { listOfCountries } from 'assets/country-list/CountryList'
import Image from 'next/image'
import { FaSearch } from 'react-icons/fa'
import LabeledInput from './LabeledInput'

function PhoneInput({ selectedCountry,setSelectedCountry }: Props) {
    
    const [searchedCountry, setSearchedCountry] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);



  return (
      <div className='flex items-center'>
          <div className='relative top-0 left-0'>
              <button onClick={()=>setIsOpen(!isOpen)} className='bg-primary-color h-full p-2 rounded-s-lg'>
                  {listOfCountries.find((country) => country.code === selectedCountry) ? <Image width={50} height={50} src={listOfCountries.find((country) => country.code === selectedCountry).unicode} alt='' className='w-6 h-6 rounded-full'/> : '🏁'}
              </button>

              <motion.div  animate={{
                  opacity: isOpen ? 1 : 0,
                  scale: isOpen ? 1 : 0.25,
                  

              }} className="sm:max-w-xs lg:max-w-md lg:min-w-96 p-2 w-full sm:min-w-72 rounded-lg flex flex-col gap-3  max-h-52 overflow-y-auto -bottom-100 left-0 absolute bg-dark-gray border-primary-color border-2">
                  <div className="flex items-center justify-between p-2 max-w-xs w-full">
                      <LabeledInput onChange={(e)=>setSearchedCountry(e.target.value)} type='transparent' additionalClasses='w-full text-base' placeholder='Search...' />
                <FaSearch className='text-white text-lg'/>
                 </div>
                  {listOfCountries.filter((item)=>item.name.toLowerCase().includes(searchedCountry.toLowerCase())).map((country) => (
                      <div onClick={()=>setSelectedCountry(country.code)} key={country.code} className='flex items-center hover:bg-secondary-color/70 p-2 hover:px-4 transition-all hover:scale-95 cursor-pointer rounded-lg gap-2'>
                          <Image src={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png`} alt='' width={40} height={40} className='rounded-full w-8 h-8' />
                          <p className='text-white text-sm'>{country.name}</p>
                      </div>
                  ))}
              </motion.div>
              
          </div>
             <input type='number' min={0} onChange={(e)=>setSearchedCountry(e.target.value)}  className='w-full text-base p-2 bg-dark-gray rounded-e-lg' placeholder='Phone Input...' />
    </div>
  )
}

export default PhoneInput