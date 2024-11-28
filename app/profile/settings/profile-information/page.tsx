'use client';
import { Popover, PopoverContent, PopoverTrigger, useDisclosure } from '@nextui-org/react';
import { delay } from '@reduxjs/toolkit/dist/utils';
import { useQuery } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import Book from 'components/elements/Book';
import LabeledInput from 'components/input/LabeledInput';
import ModalComponent from 'components/modal/ModalComponent';
import ProfileDashboardBar from 'components/Sidebars/left/profile/ProfileDashboardBar'
import { motion } from 'framer-motion';
import { useAuthContext } from 'hooks/useAuthContext';
import Image from 'next/image';
import React, { Suspense, useState } from 'react'
import { BsPersonArmsUp } from 'react-icons/bs';
import { FaSearch } from 'react-icons/fa';
import { FaBaby, FaBook, FaCheck, FaMinus, FaPlus } from 'react-icons/fa6';
import { IoIosFemale, IoIosMale } from 'react-icons/io';
import { MdLocationCity } from 'react-icons/md';
import { PiGenderIntersexBold } from 'react-icons/pi'
import Select from 'react-tailwindcss-select'
import { SelectValue } from 'react-tailwindcss-select/dist/components/type'

type Props = {}

function ProfileInformationPage({}: Props) {
  const [selectedCity, setSelectedCity] = useState();
  const [cityList, setCityList] = useState<any[]>([]);
  const [birthCityList, setBirthCityList] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [openedList, setOpenedList] = useState(false);

  

  const { isOpen, onOpenChange, onOpen, onClose } = useDisclosure();
  const [hobbiesSelected, setHobbiesSelected] = useState<string[]>([]);
  const {user}=useAuthContext();

  const {data}=useQuery({
    queryKey:['favouritedBooks'],
    queryFn: ()=>fetch('/api/supabase/user/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id:user!.id,
          include:{
            BookLover:{include:{user:true, Book:true}},
          },
        })
    }).then((res) => res.json()),
  });

  const hobbies = [
    "Reading",
    "Writing",
    "Sports",
    "Cooking",
    "Traveling",
    "Gardening",
    "Art",
    "Blogging",
    "Photography",
    "Crafting",
    "Music",
    "Gaming",
    "Meditation",
    "Socializing",
    "Collecting"
  ];

  const searchForCity= async (cityFn:(param:any[])=>void)=>{
    const res= await fetch(`https://nominatim.openstreetmap.org/search?q=${input}&format=json`);
    const cityData = await res.json();
    cityFn(cityData);
  };

  const handleCitySelect=(value)=>{
    setSelectedCity(value.split(",")[0]);
    setInput("");
    setCityList([]);
  }

  return (
    <div className='w-full h-full flex'>
           <ProfileDashboardBar/>
           <div className="sm:h-[calc(100vh-3rem)] xl:h-[calc(100vh-3.5rem)] p-2 overflow-y-auto w-full">
            <p className='text-2xl text-white font-semibold'>Profile Information</p>
            <p className='text-white'>Manage Your Profile: Update Your Personal Details and Preferences</p>
           
           <div className="flex flex-col gap-2">
            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <PiGenderIntersexBold className='text-2xl' />  Gender</p>
                <Popover classNames={{
                    'content': 'bg-dark-gray rounded-lg text-white outline-none border border-primary-color ',
                    'arrow':'bg-primary-color text-primary-color',
                    "base":'outline-none'
                }} placement="bottom" showArrow offset={10}>
      <PopoverTrigger className='text-white cursor-pointer' as='button'>
   {'Select Gender'}
      </PopoverTrigger>
      <PopoverContent className="max-w-36 min-w-36 w-full">
        <div className="w-full flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
        <p onClick={()=>{console.log('male')}} className='flex text-base gap-2 items-center hover:text-primary-color cursor-pointer transition-all'><IoIosMale className='text-base' /> Male</p>

            </div>
        <p onClick={()=>{console.log('female')}} className='flex text-base gap-2 items-center hover:text-primary-color cursor-pointer transition-all'><IoIosFemale className='text-base'/> Female</p>
        </div>
      </PopoverContent>
      </Popover>
            </div>

            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <FaBook  className='text-2xl text-primary-color' /> Favourite Book</p>
            <Button onClick={onOpen} type="blue">Select Book</Button>
            </div>
            
            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <MdLocationCity  className='text-2xl text-primary-color' /> Living Town</p>
            <div className="flex gap-2 relative top-0 left-0 items-center">
            <LabeledInput onChange={(e: any) => setInput(e.target.value)} type="transparent" placeholder='Living Town' />
              <FaSearch onClick={() => {
                searchForCity(setBirthCityList);
            }} size={20} className='text-primary-color cursor-pointer'/>
           {birthCityList.length > 0 &&   <motion.div animate={{
            opacity: birthCityList.length > 0 ? 1 : 0,
            scale: birthCityList.length > 0 ? 1 : 0,
            transition: {duration: 0.5, 'bounce':0.3}
           }} className="bg-dark-gray  z-20 overflow-y-auto border-2 border-primary-color flex flex-col gap-2 absolute -bottom-52 max-w-96 p-1 min-w-80 w-full max-h-60 h-full min-h-48 rounded-lg left-0">
              <p className='text-white text-sm'>Results: <span className='text-spotify'>{birthCityList.length}</span></p>
              {birthCityList.map((city: any, i) => (<div onClick={()=>handleCitySelect(city.display_name)} className='text-white hover:text-primary-color transition-all cursor-pointer' key={i}>
            <p>{city.display_name}</p>
              </div>))}
            </motion.div>}
          
            </div>
            </div>

            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <FaBaby  className='text-2xl text-primary-color' /> Birth Place</p>
            <div className="flex gap-2 relative top-0 left-0 items-center">
            <LabeledInput  onChange={(e: any) => setInput(e.target.value)} type="transparent" placeholder='Birth Place' />
              <FaSearch onClick={() => {
                searchForCity(setCityList);
            }} size={20} className='text-primary-color cursor-pointer'/>
           {cityList.length > 0 &&   <motion.div animate={{
            opacity: cityList.length > 0 ? 1 : 0,
            scale: cityList.length > 0 ? 1 : 0,
            transition: {duration: 0.5, 'bounce':0.3}
           }} className="bg-dark-gray z-20 overflow-y-auto border-2 border-primary-color flex flex-col gap-2 absolute -bottom-52 max-w-96 p-1 min-w-80 w-full max-h-60 h-full min-h-48 rounded-lg left-0">
              <p className='text-white text-sm'>Results: <span className='text-spotify'>{cityList.length}</span></p>
              {cityList.map((city: any, i) => (<div onClick={()=>handleCitySelect(city.display_name)} className='text-white hover:text-primary-color transition-all cursor-pointer' key={i}>
            <p>{city.display_name}</p>
              </div>))}
            </motion.div>}
          
            </div>
            </div>

            <div className="flex items-center max-w-xl w-full gap-3 justify-between bg-dark-gray rounded-lg px-2 py-3">
                <p className='text-white flex text-lg items-center gap-2'> <BsPersonArmsUp  className='text-2xl text-primary-color' /> Hobbies List</p>
            <div className="flex gap-2 relative top-0 left-0 items-center">
           <Button onClick={()=>setOpenedList(!openedList)} type="blue">Select</Button>
           {openedList &&   <motion.div animate={{
            opacity: openedList ? 1 : 0,
            scale: openedList ? 1 : 0,
            transition: {duration: 0.5, 'bounce':0.3}
           }} className="bg-dark-gray overflow-y-auto border-2 border-primary-color flex flex-col gap-2 absolute -bottom-52 max-w-96 p-2 min-w-80 w-full max-h-60 h-full min-h-48 rounded-lg left-0">
                {hobbies.map((item, i) => (<div onClick={() => {
                    if(!hobbiesSelected.find((hobby)=>item === hobby)){
                      setHobbiesSelected([...hobbiesSelected, item])
                    } else {
                      setHobbiesSelected(hobbiesSelected.filter((hobby)=>item !== hobby))
                    }
                  }}  className={`flex cursor-pointer justify-between p-1 rounded-lg transition-all ${hobbiesSelected.find((hobby)=>item === hobby) ? "bg-green-400 hover:bg-red-400" : ""}  items-center gap-2`}>
                  <p className='text-white font-semibold text-lg'>{item}</p>
                  <Button type="transparent">
                    {!hobbiesSelected.find((hobby)=>item === hobby) ? <FaPlus className='text-white'/> : <FaMinus className='text-white'/>}

                  </Button>
  </div>))}
            </motion.div>}
          
            </div>
            </div>

<ModalComponent modalBodyContent={<div className='flex flex-col gap-2'>
  {data && <div className="flex flex-col gap-2 overflow-y-auto">
{data.data.BookLover.map((book: any) => (
<Suspense key={book.Book.id} fallback={<div>Loading...</div>}>
<div key={book.Book.id} className='flex group items-center gap-2 cursor-pointer'>
 <Image src={book.Book.bookCover} className='w-10 h-12 rounded-lg' width={60} height={60} alt=''/>
 <div className="flex flex-col gap-1">
 <p className='text-white group-hover:text-primary-color transition-all text-sm line-clamp-1'>{book.Book.title}, {book.Book.bookAuthor}</p>
 <p className='text-white group-hover:text-primary-color transition-all text-xs'>{book.Book.pages} Pages</p>
 </div>
</div>
</Suspense>
))}
    </div>}
</div>} isOpen={isOpen} onOpenChange={onOpenChange} onClose={onClose} modalTitle='Favourited Books' modalSize='lg'/>

           </div>
           </div>
    </div>
  )
}

export default ProfileInformationPage