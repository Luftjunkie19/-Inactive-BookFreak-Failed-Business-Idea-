'use client'

import { useQuery } from '@tanstack/react-query';
import React from 'react'
import SettingsForm from './SettingsForm';
import SettingsSections from './SettingsSections';

type Props = {
    competitionId:string
}

function SettingsContainer({competitionId }: Props) {
    
  const { data: document } = useQuery({
    queryKey: ['competition', competitionId],
    queryFn: () => fetch('/api/supabase/competition/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: competitionId, include: {
          prize: true,
          members: {
            include: {
              user: true,
            },
          },
          chat: {
            include: { messages: true },
          },
          rules: true,
        }
      })
    }).then((res) => res.json())
  });


  return (
      <>
          {document && document.data && <>          
      <SettingsForm competitionId={competitionId} document={document}/>    
         <SettingsSections competitionId={competitionId}/>
          </>}
    </>
  )
}

export default SettingsContainer