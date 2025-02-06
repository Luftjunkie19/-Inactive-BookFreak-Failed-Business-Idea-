
'use client';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import DetailsEditPart from './DetailsEditPart';
import EditManagementClubDetails from './EditManagementClubDetails';

type Props = {clubId:string}

function FormDisplayContainer({clubId }: Props) {
    
     const { data: document } = useQuery({
        queryKey: ['club', clubId], 
        queryFn: () => fetch('/api/supabase/club/get', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: clubId, include: { members: { include: { user: true } } } })
        }).then((res) => res.json())
    });


    



  return (
      <>
          <DetailsEditPart document={document} clubId={clubId} /> 
          <EditManagementClubDetails  clubId={clubId} />
      </>
  )
}

export default FormDisplayContainer