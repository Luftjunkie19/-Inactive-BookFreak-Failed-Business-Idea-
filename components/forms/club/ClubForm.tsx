import { Club } from 'app/form/club/page';
import React from 'react'
import { useFormContext } from 'react-hook-form';

type Props = {}

function ClubForm({}: Props) {
const {handleSubmit, register, formState, control, clearErrors}=useFormContext();

const submitForm = async (value: Club) => {
    clearErrors();

    const chatId = crypto.randomUUID();
    const clubId = crypto.randomUUID();


    const fetchChat = await fetch('/api/supabase/chat/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { id: chatId, dateOfCreation: new Date() } })
    });

    const { data: chat } = await fetchChat.json();

    const { data: imageData, error: imageError } = await uploadImage(value.clubLogo, 'clubLogo', `${clubId}/${crypto.randomUUID()}`);

    if (!imageData) {
      return;
    }

    const image = await uploadImageUrl(imageData.path,'clubLogo');

    if (!image) {
      return;
    }



    const fetchClub = await fetch('/api/supabase/club/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { id: clubId, chatId: chat.id, clubName: value.clubName, creationDate: new Date(), hasRequirements: value.hasRequirements, description: value.description, isFreeToJoin: value.isFreeToJoin, clubLogo: image } })
    });


    const { data: club } = await fetchClub.json();


    await fetch('/api/supabase/notification/createMany', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: Array.from(selectedKeys).map((item) => ({
          directedTo: item,
          clubInvitation: {
            clubId: clubId,
            message:'Hi, I invite you to checkout and join my Club !'
          },
          isClubInvitation: true,
          type: 'clubInvitation',
          sentBy:user?.id,
          receivedAt:new Date()
      }))})
    })


    console.log(club);
      
    const fetchRequirements = await fetch('/api/supabase/requirement/createMany', {
      method: "POST",
      body: JSON.stringify({ data: requirements.map((item) => ({ ...item, clubId })) }),
      headers: {
        'Content-Type': 'application/json',
      },
    });



    const fetchMember = await fetch('/api/supabase/member/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { id: crypto.randomUUID(), userId: user!.id, clubId, isCreator: true, isAdmin: true, isOwner: true } })
    });
      
    toast.success('Success !');
    clearErrors();
    reset();

  }
  


  return (
    <form onSubmit={handleSubmit(submitForm, (error) => {
        console.log(error);
      })} className={`sm:h-[calc(100vh-3rem)] lg:h-[calc(100vh-3.5rem)] overflow-y-auto w-full p-4`}>
        <div className="flex flex-col gap-1 max-w-2xl w-full">
          <p className='text-2xl text-white font-bold'>Read, Absorb, Evolve !</p>
          <p className='text-white'>Are you an author, a book company or someone who wants to compete with other people ? Create the competition now and Read !</p>
       </div>
        
        
        <div className="flex py-4 gap-12">
  
          
                
  
        </div>
  
  
     
  
     
  
        <Button isSubmit type='blue' additionalClasses="w-fit px-8 py-2 text-lg my-4">
          Insert
        </Button>
  
      </form>
  )
}

export default ClubForm