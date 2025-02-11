'use client';

import { Competition } from 'app/form/competition/page';
import Button from 'components/buttons/Button';
import useStorage from 'hooks/storage/useStorage';
import { useAuthContext } from 'hooks/useAuthContext';
import { useRouter } from 'next/navigation';
import React from 'react'
import { useFormContext } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Option } from 'react-tailwindcss-select/dist/components/type';
import uniqid from 'uniqid';
import DetailsSection from './sections/DetailsSection';
import DetailedPrizeSection from './sections/DetailedPrizeSection';
import AdditionalSection from './sections/AdditionalSection';

type Props = {}

function Form({ }: Props) {
    const { user } = useAuthContext();
    const { handleSubmit, clearErrors, setError } = useFormContext();
    const { uploadImage, uploadImageUrl } = useStorage();
    const router = useRouter();
    

  const submitForm = async (formData: Competition) => {
       
    console.log(formData.competitionTitle);
       clearErrors();
    const competitionId = crypto.randomUUID();
    const competitionChatId = crypto.randomUUID();
    const prizeId = crypto.randomUUID();
    try {

      if(!user){
        toast.error('You are not allowed to add!')
        return;
      }


      const { data: imageData, error } = await uploadImage(formData.competitionLogo, 'competitionLogo', `${competitionId}/${uniqid('competitionLogo')}`);
      console.log(imageData, error);
   
      if (!imageData) {
        setError('competitionLogo', {
          'message': 'Failed to upload the image.',
          'type': 'error',
        });
             toast.error('Somethin went not correct.');
        return;
      }
      const imageUrl = await uploadImageUrl(imageData.path, 'competitionLogo');

     
      const fetchPrize = await fetch('/api/supabase/prize/create', {
        body: JSON.stringify({data:{
          id: prizeId,
          prizeName: formData['prize'].itemPrize!.title || undefined,
          isPrizeItem: formData['prize'].itemPrize && formData['prize'].itemPrize.typeOfPrize ? true : false,
          itemType: formData.prize.itemPrize && formData.prize.itemPrize.typeOfPrize &&  (formData.prize.itemPrize.typeOfPrize as Option)['value'],
          voucherFor:  formData['prize'].itemPrize && formData['prize'].itemPrize.voucherFor ? formData['prize'].itemPrize.voucherFor : undefined,
          voucherLinkTo: formData['prize'].itemPrize && formData['prize'].itemPrize.voucherEventLink ? formData['prize'].itemPrize.voucherEventLink : undefined,
          chargeId: formData.chargeId,
          prizeDescription: formData.prizeDescription || undefined,
          bookReferenceId: formData.prize.itemPrize && formData.prize.itemPrize.bookReferenceId ? (formData.prize.itemPrize.bookReferenceId as Option).value : undefined,
          isCryptoPrize: false,
          prizeImage: undefined,
          prizeMoneyAmount: formData['prize'].moneyPrize ? formData['prize'].moneyPrize.amount : undefined,
          prizeMoneyCurrency: formData['prize'].moneyPrize ?  formData['prize'].moneyPrize.currency : undefined,
        }}),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const fullPrize = await fetchPrize.json();

      console.log(fullPrize);


      


      const fetchCompetitionObject = await fetch('/api/supabase/competition/create', {
        body: JSON.stringify({data:{
          competitionName: formData['competitionTitle'],
          competitionType: formData['competitionsName'],
          competitionLogo: imageUrl,
          startDate: new Date(),
          endDate: formData['expiresAt'],
          id: competitionId,
          chatId: competitionChatId,
          prizeId: prizeId,
          description: formData['description'],
          prizeHandedIn: false,
          chargeId: formData['chargeId'] ?? null,
        }}),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      


      const { data:competition, error: fullErr } = await fetchCompetitionObject.json();    

        if (formData['requirements']) {        
            const fetchRequirements= await fetch('/api/supabase/requirement/createMany', {
              method:"POST",
                body:JSON.stringify({data:formData['requirements'].map((item)=>({...item, competitionId}))}),
                headers:{
                  'Content-Type':'application/json',
                },
            });
        }

      const fetchMember= await fetch('/api/supabase/member/create', {
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({data:{userId:user.id, competitionId:competition.id, isAdmin:true, isCreator:true, isOwner:true}}),
      });
      
  
      toast.success('Yeah, you did it !');
      clearErrors();
      router.push('/');

    } catch (err) {
      console.log(err);
    }
  };


  return (
     <form onSubmit={handleSubmit(submitForm, (errors) => {
      if (errors) {
        console.log(errors);
        // Object.values(errors).map((item) => toast.error(item.message || (item.prize && item.prize!.itemPrize?.typeOfPrize?.message)))
      }
    })} className={`w-full sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto overflow-x-hidden p-4`}>

      <div className="flex flex-col gap-1 max-w-2xl w-full">
        <p className='text-2xl text-white font-bold'>Read, Absorb, Evolve !</p>
        <p className='text-white'>Are you an author, a book company or someone who wants to compete with other people ? Create the competition now and Read !</p>
     </div>

<DetailsSection/>
<DetailedPrizeSection/>
<AdditionalSection/>

      <Button isSubmit type='blue' additionalClasses="w-fit px-8 py-2 text-lg my-4">
        Insert
      </Button>

    </form>
  )
}

export default Form