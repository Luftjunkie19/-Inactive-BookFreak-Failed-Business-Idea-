'use client';
import { useQuery } from '@tanstack/react-query';
import { CompetitionRules } from 'assets/CompetitionsRules/CompetitionRules';
import React, { useMemo } from 'react'
import HeadSection from './HeadSection';
import { useAuthContext } from 'hooks/useAuthContext';
import ContentContainer from '../ContentContainer';
import CompetitionInfoSection from './CompetitionInfoSection';
import CompetitionDetails from './CompetitionDetails';

type Props = {competitionId:string}

function MainContainer({ competitionId }: Props) {
      const { user } = useAuthContext();
  const { data: document } = useQuery({
    queryKey: ['competition', competitionId],
    queryFn: () => fetch('/api/supabase/competition/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id:competitionId, include: undefined,
      })
    }).then((res) => res.json())
  });

    const { competitionMembers } = CompetitionRules();
      
      const competitionRankingMembers = useMemo(() => {
        if (document && document.data) {
          return competitionMembers(document.data.members, document.data);
        }
      }, [document]);
    


    return (
        <div>
        <HeadSection user={user} document={document} id={competitionId} />
        <ContentContainer>
          <CompetitionInfoSection document={document} />
          <CompetitionDetails document={document} competitionRankingMembers={competitionRankingMembers} user={user} />
        </ContentContainer>
    </div>
  )
}

export default MainContainer