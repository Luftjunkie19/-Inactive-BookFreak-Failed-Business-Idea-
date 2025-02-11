import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import React, { useState } from 'react'
import translations from '../../../../assets/translations/FormsTranslations.json';
import { useFormContext } from 'react-hook-form';
import { FaEthereum } from 'react-icons/fa';
import { FaBitcoin, FaBook, FaTicket } from 'react-icons/fa6';
import { HiOutlineInformationCircle } from 'react-icons/hi';
import { IoTicketSharp } from 'react-icons/io5';
import { MdCurrencyExchange } from 'react-icons/md';
import { SiChainlink, SiSolana } from 'react-icons/si';
import { useSelector } from 'react-redux';
import Select from 'react-tailwindcss-select';
import { useQuery } from '@tanstack/react-query';
import LabeledInput from 'components/input/LabeledInput';
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';

type Props = {}

function DetailedPrizeSection({ }: Props) {
    const [chosenPrize, setChosenPrize] = useState<SelectValue>();
    const [bookReference, setBookReference] = useState<SelectValue>();
    const { register, setValue, watch } = useFormContext();
      const selectedLanguage = useSelector(
        (state:any) => state.languageSelection.selectedLangugage
      );
      
   const allPrizes = [
    { value: "book", label: `${translations.book[selectedLanguage]} 📘` },
    {
      value: "voucher",
      label: "Voucher 🎟️",
    },
     { value: "ticket", label: `${translations.ticket[selectedLanguage]} 🎫` },
     {
      value: "money",
      label: `${translations.money[selectedLanguage]} 🤑`,
    },
  ];


     const { data, error } = useQuery({
    queryKey: ["books"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await fetch("/api/supabase/book/getAll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          take: undefined,
          where: undefined,
          skip: undefined,
          include: undefined,
          select:undefined
        })
      });
      const fetchedRes = await response.json();

      return fetchedRes;
      },
  });




  return (
   
      <div className="flex gap-2 flex-col pb-2">
        <p className='text-xl text-white font-semibold'>Detailed Prize</p>

        <div className="grid xl:grid-cols-2 2xl:grid-cols-3 items-center gap-2 max-w-6xl">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
          <p className='text-white'>Winner Prize</p>
          <TooltipProvider>
      <Tooltip delayDuration={50}>
              <TooltipTrigger type='button' className='text-primary-color'>
              <HiOutlineInformationCircle className="text-2xl animate-pulse text-primary-color" />
        </TooltipTrigger>
        <TooltipContent alignOffset={4} sideOffset={10} className=' bg-dark-gray sm:min-w-72 lg:min-w-96 xl:min-w-[28rem] max-w-lg w-full overflow-x-hidden border-primary-color text-white' side='bottom' align='start'>

                    <div className="flex flex-col gap-3">
     <div className="flex flex-col gap-1">
            <p className="flex gap-2 text-lg items-center"><FaBook className=' text-primary-color'/> Book</p>
                          <p>Setting this as your competition's prize will allow you to choose a book to be given to the winner.
                            The prize can be changed whenever you want.</p>
     </div>
     <div className="flex flex-col gap-1">
             <p className="flex gap-2 text-lg items-center"><IoTicketSharp className=' text-primary-color'/> Voucher</p>
         <p>Selecting Voucher as your competition's prize, you will allow users or you to win a voucher for anything that you specify. You can change the prize whenever you want.</p>
     </div>
     <div className="flex flex-col gap-1">
        <p className="flex gap-2 text-lg items-center"><FaTicket className=' text-primary-color' /> Ticket</p>
        <p>Selecting Ticket as your competition's prize, you will allow users or you to win a ticket for anything that you specify. You can change the prize whenever you want.</p>
     </div>
      
      <div className="flex flex-col gap-1">
      <p className="flex gap-2 text-lg items-center"> <FaBitcoin className="text-orange-500 text-xl" /> <SiChainlink className=' text-primary-color text-xl' /> <FaEthereum className="text-xl" /> <SiSolana className="text-purple-800 text-xl" /> Crypto</p>
                          <p>
                            You allow the users to win a crypto currency, that you set specifically for this competition !
                            The prize can be changed, however it will charge your account with a specific amount of the currency. 
                            </p>
     </div>

     <div className="flex flex-col gap-1">
        <p className="text-lg flex gap-2 items-center"><MdCurrencyExchange className="text-green-400" /> Money</p>
        <p>You allow the users to win (fiat) money, that you set specifically for this competition ! </p>                  
     </div>
             
              
        
          
                        
          </div>
              </TooltipContent>
                </Tooltip>
                </TooltipProvider>
          </div>
          <Select   {...register('prize.itemPrize.typeOfPrize', {
          required:'The Prize is required'
        })} isMultiple={false} onChange={(values) => {
            setChosenPrize(values);
            setValue('prize.itemPrize.typeOfPrize', values);
          }} classNames={{
            menuButton: (value) => 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border-2 text-white border-primary-color',
           tagItemText: '',
          tagItemIconContainer: '',
                
            }} value={chosenPrize as SelectValue} options={allPrizes}  primaryColor='blue' />
          </div>
          {chosenPrize && (chosenPrize as any).value === 'book' &&
            <>
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Book Title" type={"dark"} />
            {data && data.data && 
            <div className="flex flex-col gap-1">
              <p className='text-white'>BookFreak&#39;s DB Reference</p>
              <Select classNames={{
                menuButton: () =>'bg-dark-gray  h-fit flex max-w-xs w-full rounded-lg border-2  text-white border-primary-color',
         
              }} {...register('prize.itemPrize.bookReferenceId')} options={data.data.map((item) => ({ label: item.title, value: item.id}))} onChange={(values) => {
                setBookReference(values);
                setValue('prize.itemPrize.bookReferenceId', values);
              }} value={bookReference as SelectValue} primaryColor=''/>

            </div>
     }
      
            </>
          }

          {chosenPrize && (chosenPrize as any).value === 'voucher' &&
            <>
          <LabeledInput additionalClasses="max-w-xs w-full p-2" label="What is the Voucher for" type={"dark"} />
          <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Link to the Voucher's Prize" type={"dark"}  />
            </>
          }

          {chosenPrize && (chosenPrize as any).value === 'ticket' && <>
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Ticket's Event Name" type={"dark"}  />
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Ticket's Event Type" type={"dark"} />
          </>}

                        

          {
            chosenPrize && (chosenPrize as any).value === 'money' &&  <LabeledInput additionalClasses="max-w-xs w-full p-2 outline-none" label='Money Prize' type={'dark'} min={0.5} step={0.5} max={10} inputType='number' />
          }
                       
          {chosenPrize && (chosenPrize as any).value !== 'money' &&
          <div className="flex gap-1 flex-col col-span-full">
             <span className="text-lg text-white font-semibold">Other Prize&#39;s Description</span>
              <textarea {...register('prizeDescription', {
                onChange: (e) => {
                  setValue('prizeDescription', e.target.value);
        }
      })} className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
          </div>
       }   

        </div> 
      </div>
  )
}

export default DetailedPrizeSection