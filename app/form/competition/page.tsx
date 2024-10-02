'use client';
import { useState } from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import uniqid from 'uniqid';

import Select from 'react-tailwindcss-select';


import alertMessages from '../../../assets/translations/AlertMessages.json';
import translations from '../../../assets/translations/FormsTranslations.json';
import { snackbarActions } from '../../../context/SnackBarContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import LabeledInput from 'components/input/LabeledInput';
import { Avatar, Chip, DatePicker, Dropdown, DropdownItem, DropdownSection, DropdownTrigger, Switch, Tooltip, useDisclosure } from '@nextui-org/react';
import { FaInfo } from 'react-icons/fa6';
import { InputSwitch } from 'primereact/inputswitch';
import Image from 'next/image';
import { HiOutlineUpload } from 'react-icons/hi';
import Button from 'components/buttons/Button';
import SingleDropDown from 'components/drowdown/SingleDropDown';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import ModalComponent from 'components/modal/ModalComponent';
import { MdEditDocument } from 'react-icons/md';
import { PiStackPlusFill } from 'react-icons/pi';
import { useForm } from 'react-hook-form';
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';

type Competition = {
 competitionTitle: string,
    competitionsName: string,
    expiresAt:  Date | null ,
    description: string,
    prizeType: 'Money' | 'item' | null,
    chargeId: string | null ,
    prizeHandedIn: false,
    prize: {
      moneyPrize?: {
        amount: number | null,
        currency: string | null,
      },
      itemPrize?: { title: string | null, typeOfPrize: SelectValue },
    },
}

function CreateCompetition() {
  const { user } = useAuthContext();
  const [attachedUsers, setAttachedUsers] = useState([]);
  const { register, reset, setFocus,setValue, setError, clearErrors, getValues, getFieldState } = useForm<Competition>();
  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state:any) => state.mode.isDarkMode);
  const [isPending, setIsPending] = useState(false);
  const dispatch=useDispatch();
  const [prize, setPrize] = useState(null);
   const competitionTypes = [
    { value: "First read, first served", label: translations.competitionTypes.first[selectedLanguage] },
    {
      value: "Lift others, rise",
      label: translations.competitionTypes.second[selectedLanguage],
    },
    { value: "Teach to fish", label: translations.competitionTypes.third[selectedLanguage] },
  ];
  
   const prizeTypes = [
    { value: "item", label: `${translations.item[selectedLanguage]} 📚` },
    {
      value: "Money",
      label: `${translations.money[selectedLanguage]} 🤑`,
    },
  ];
  
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

  const [chosenPrize, setChosenPrize]=useState<SelectValue>();


  const navigate = useRouter();
  // const { documents }=useGetDocuments('users');
  // const {document}=useGetDocument("users", user ? user.uid : '');


  // let notCurrentUsers = documents
  //   .filter((doc) => {
  //     return ( user &&
  //       doc.id !== user.uid &&
  //       !attachedUsers.some((member:any) => member.value.id === doc.id)
  //     );
  //   })
  //   .map((user) => {
  //     return {
  //       label: user.nickname,
  //       value: {
  //         nickname: user.nickname,
  //         id: user.id,
  //         photoURL: user.photoURL,
  //       },
  //     };
  //   });


  const finalizeAll = () => {
    const uniqueId = uniqid();
    // addToDataBase("competitions", uniqueId, {
    //   competitionTitle: competition.competitionTitle,
    //   competitionsName: competition.competitionsName,
    //   expiresAt: new Date((competition.expiresAt as Date)).getTime(),
    //   description: competition.description,
    //   prizeHandedIn: false,
    //   chargeId: competition.chargeId,
    //   prize: competition.prize,
    //   createdBy: {
    //     displayName: (user as User).displayName,
    //     email: (user as User).email,
    //     photoURL: (user as User).photoURL,
    //     createdAt: new Date().getTime(),
    //     id: (user as User).uid,
    //   },
    //   id: uniqueId,
    // });

    // addToDataBase("communityChats", uniqueId, {
    //   messages: {},
    //   chatId: uniqueId,
    // });

    // addToDataBase("communityMembers", uniqueId, {
    //   users: {
    //     [(user as User).uid]: {
    //       label: (user as User).displayName,
    //       belongsTo: uniqueId,
    //       value: {
    //         nickname: (user as User).displayName,
    //         id: (user as User).uid,
    //         photoURL: (user as User).photoURL,
    //       },
    //     },
    //   },
    // });

    // attachedUsers.map((member:any) =>
    //   addToDataBase("notifications", `${uniqueId}-${new Date().getTime()}`, {
    //     notificationContent: `You've been invited by ${(user as User).displayName} to join the ${competition.competitionsName} competition.`,
    //     directedTo: member.value.id,
    //     linkTo: `/competition/${uniqueId}`,
    //     isRead: false,
    //     notificationId: uniqueId,
    //     notificationTime: new Date().getTime(),
    //     addedTo: competition.competitionsName,
    //   })
    // );

    setIsPending(false);
    navigate.push("/");
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsPending(true);
    try {
      // if (!competition.expiresAt) {
      //   dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.earlyDate[selectedLanguage]}`,alertType:"error", }));
      //   setIsPending(false);
      //   return;
      // }

      // if (
      //   competition.prizeType === "Money" &&  competition.prize.moneyPrize &&
      //   competition.prize.moneyPrize.amount === 0
      // ) {
      //   dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.zeroAmount[selectedLanguage]}`, alertType:"error"}));
        
        
      //   setIsPending(false);
      //   return;
      // }

      // if (competition.prize.moneyPrize && competition.prize.moneyPrize.amount && competition.prize.moneyPrize.amount > document.creditsAvailable) {
      //   dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.wrong.notEnoughCredits[selectedLanguage]}`, alertType:"error"}));
        
     
      //   setIsPending(false);
      //   return;
      // }

      // if (
      //   competition.prize.itemPrize === undefined ||
      //   competition.prize.itemPrize === null ||
      //   competition.prize.moneyPrize === null ||
      //   competition.prize.moneyPrize === undefined
      // ) {
        
      //     //state.message = "Something went wrong.";
       
      //   setIsPending(false);
      //   return;
      // }

      // if (competition.prizeType === "Money" && competition.prize.moneyPrize) {
      //   const payoutObject = await payCompetitionCharge({
      //     organizatorObject: document,
      //     payerId: document.stripeAccountData.id,
      //     amount: competition.prize.moneyPrize.amount,
      //     currency:
      //       document.stripeAccountData.default_currency.toUpperCase(),
      //   });
        
      //   const { error, chargeObject } = await payoutObject.data as any;

      //   console.log(chargeObject);

      //   if (error) {
      //     setError(error);
      //     setIsPending(false);
      //     return;
      //   }

      //   if (chargeObject && user) {
      //     setCompetition((comp) => {
      //       comp.chargeId = chargeObject.id;
      //       (comp.prize.moneyPrize as any).currency =
      //         document.stripeAccountData.default_currency;
      //       return comp;
      //     });
      //     updateDatabase(
      //       {
      //         valueInMoney:
      //           document.creditsAvailable.valueInMoney -
      //           (competition.prize.moneyPrize.amount as number),
      //       },
      //       "users",
      //       `${user.uid}/creditsAvailable`
      //     );
      //   }
      // }
      // finalizeAll();
      // dispatch(snackbarActions.showMessage({message:`${alertMessages.notifications.successfull.create[selectedLanguage]}`, alertType:"success"}));
      // setIsPending(false);
    } catch (err) {
      console.log(err);
      setIsPending(false);
    }
  };

     const { isOpen, onOpen, onOpenChange} = useDisclosure();

  const typeOfPrize = getValues('prize.itemPrize.typeOfPrize');
  
  return (
     <div className={`w-full  sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto  overflow-x-hidden p-4`}>
      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <p className='text-2xl text-white font-bold'>Read, Absorb, Evolve !</p>
        <p className='text-white'>Are you an author, a book company or someone who wants to compete with other people ? Create the competition now and Read !</p>
     </div>
      
      
      <div className="flex py-4 gap-12">

        <div className="w-56 cursor-pointer h-56 rounded-lg bg-white justify-center items-center flex">
          <input  type="file" name="" className="hidden" id="" />
          <div className="flex w-full flex-col items-center gap-2">
<HiOutlineUpload className="text-5xl text-primary-color" />
          <p className='text-xs text-dark-gray'>Upload Competition&apos;s Logo</p>
          </div>
        </div>

        
<div className="grid max-w-2xl h-fit self-center w-full gap-4 grid-flow-dense xl:grid-cols-2">
            <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Competition Name" type={"dark"} />
          
          {/* <SingleDropDown label='Competition Rules' selectedArray={[]}>
            <SelectItem key={'rule1'}>Rule 1</SelectItem>
             <SelectItem key={'rule2'}>Rule 2</SelectItem>
              <SelectItem key={'rule3'}>Rule 3</SelectItem>
     </SingleDropDown> */}

        
          <DatePicker labelPlacement='outside'  label={<p className='text-white'>Expiration Date</p>} />
                       
</div>
      


      </div>

      <div className="flex gap-2 flex-col pb-2">
        <p className='text-xl text-white font-semibold'>Detailed Prize</p>

        <div className="grid xl:grid-cols-2 2xl:grid-cols-3 items-center gap-2 max-w-6xl">
        <div className="flex flex-col gap-1">
          <p className='text-white'>Winner Prize</p>
          <Select {...register('prize.itemPrize.typeOfPrize', {
          required:'Error !'
        })} isMultiple={false} onChange={(values) => {
            console.log(values);
            setChosenPrize(values);
            setValue('prize.itemPrize.typeOfPrize', values);
          }} classNames={{
            menuButton: (value) => 'bg-dark-gray h-fit flex max-w-xs w-full rounded-lg border text-white border-primary-color',
           'tagItemText': '',
                'tagItemIconContainer': '',
                
            }} value={chosenPrize} options={allPrizes}  primaryColor='blue' />
          </div>
          {chosenPrize && (chosenPrize as any).value === 'book' &&
            <>
          <LabeledInput additionalClasses="max-w-xs w-full p-2" label="Book Title" type={"dark"} />
          <LabeledInput additionalClasses="max-w-xs w-full p-2" label="BookFreak's DB Reference" type={"dark"} />
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
            chosenPrize && (chosenPrize as any).value === 'money' &&  <LabeledInput additionalClasses="max-w-xs w-full p-2 outline-none" label='Money Prize' type={'dark'} />
          }
                       
          {chosenPrize && (chosenPrize as any).value !== 'money' &&
          <div className="flex gap-1 flex-col col-span-full">
             <span className="text-lg text-white font-semibold">Other Prize&#39;s Description</span>
      <textarea className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
          </div>
       }   

        </div> 
      </div>

      <div className="flex flex-col gap-2 pb-2">
        <div className="">
          <p className='text-xl text-white font-semibold'>Additional Conditions</p>
          <p className='text-xs text-gray-400'>You can add additional conditions users have to fullfill in order to join the competition.</p>
        </div>

          <div className="flex flex-col gap-2 w-full overflow-y-auto max-h-52 max-w-2xl  bg-dark-gray py-4 px-2 rounded-lg  h-full">
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p>
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />
                              </div>
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p>
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />
                              </div>
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p> 
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />
                              </div>
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p>
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />
                              </div>
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p>
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />
                              </div>
                              <div className="flex gap-2 items-center bg-secondary-color text-white p-2 rounded-lg justify-between w-full">
                                  <p className='flex-1'>Additional Condition 1</p>
                                  <LabeledInput inputType='number' additionalClasses='max-w-20 w-full p-2 outline-none' type='transparent' />
                              </div>
</div> 

        <Button onClick={onOpen} additionalClasses='w-fit px-4 py-2 flex items-center gap-2' type='blue'>New Condition <PiStackPlusFill /></Button>
        <ModalComponent modalSize='xl' modalFooterContent={<div className='flex gap-3 items-center'>
            <Button type='blue' additionalClasses="w-fit  px-4 py-2">
        Append
      </Button>
 </div>} modalTitle='Additional Conditions' modalBodyContent={<div className='flex flex-col gap-3'>

        <Select onChange={(value)=>{
          console.log(value);
        }} options={[
          {value:'rule1', label:'Min. Read Pages of Genre'},
          {value:'rule2', label:'Min. Read Books of Genre'},
          {value:'rule3', label:'Min. Read Books Amount'},
          {value:'rule4', label:'Min. Read Pages Amount'},
          {value:'rule5', label:'Peculiar Question'}

        ]} value={{value:'rule1', label:'Min. Read Pages of Genre' }}/>

     
  <LabeledInput additionalClasses="max-w-sm w-full p-2" label="Question" type={"dark"} />


           {/* <SingleDropDown label='Answer Accessment' selectedArray={[]}>
     <SelectItem key={'rule1'}>Manual</SelectItem>
         <SelectItem key={'rule1'}>Expected Answers</SelectItem>
   </SingleDropDown> */}
   
     <textarea placeholder='Enter answers...' className="w-full text-white bg-secondary-color p-2 h-52 overflow-y-auto  resize-none outline-none rounded-md border-2 border-primary-color"  />

                        
                      </div>} isOpen={isOpen} onOpenChange={onOpenChange} />

      </div>

         <label className="flex flex-col gap-3">
          <span className="text-xl text-white font-semibold">Description</span>
      <textarea className=" font-light p-2 max-w-3xl w-full h-80 outline-none text-white resize-none rounded-lg border-primary-color border-2 bg-dark-gray"></textarea>  
      </label>

      <Button type='blue' additionalClasses="w-fit px-8 py-2 text-lg my-4">
        Insert
      </Button>

    </div>
  );
}

export default CreateCompetition;
