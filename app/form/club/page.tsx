
import React from 'react';

import { Requirement } from '../competition/page';


import FormContainer from 'components/forms/FormContainer';
import ClubForm from 'components/forms/club/ClubForm';

export interface Club{
  hasRequirements: boolean,
  clubName: string,
  clubLogo:File,
  description: string,
  isFreeToJoin:boolean,
  requirements:Requirement[]
  invites?:string[]
}


function CreateClub() {

  return (
    <FormContainer<Club>>
<ClubForm/>
    </FormContainer>
  );
}

export default CreateClub;
