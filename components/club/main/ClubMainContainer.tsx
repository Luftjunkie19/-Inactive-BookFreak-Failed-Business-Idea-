'use client';
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import Header from './Header';
import ClubRankingSection from './ClubRankingSection';
import ClubDetails from './ClubDetails';

type Props = {
    id:string
}

function ClubMainContainer({id }: Props) {
      const { data: document } = useQuery({
    queryKey: ['club', id],
    queryFn: () => fetch('/api/supabase/club/get', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, include: { members: { include: { user: true } } } })
    }).then((res) => res.json())
  });




  return (
      <>
          <Header document={document} id={id} />
          <ClubDetails document={document} />
          <ClubRankingSection document={document} />
      </>
  )
}

export default ClubMainContainer