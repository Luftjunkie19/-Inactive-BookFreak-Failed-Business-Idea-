'use client';
import { useQuery } from '@tanstack/react-query';
import BarChartDashboardSection from 'components/dashboard/BarChartDashboardSection';
import LineChartDashboardSection from 'components/dashboard/LineChartDashboardSection';
import PieRadialChartsSection from 'components/dashboard/PieRadialChartsSection';
import { useAuthContext } from 'hooks/useAuthContext';
import React from 'react'

type Props = {}

function ReadingStatsContainer({ }: Props) {
    const {user}=useAuthContext();
   const { data: document } = useQuery({
      queryKey: ['profile'],
      queryFn: () => fetch('/api/supabase/user/get', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({ id:user!.id, include:{
           'recensions':{'include':{'book':true}},
           'ReadingProgress':{orderBy:{'startTime':'asc'}, include:{
             'book':{
               include:{
                 recensions:true,
               },
             },
             user:true
           }}, 
           'notifications':true,
          }}),
       }).then((res) => res.json())
   });


  return (
      <>
      {document && document.data && 
      <>
             <PieRadialChartsSection document={document} />
      
             <LineChartDashboardSection document={document} />  
      
              <BarChartDashboardSection document={document}/>
      </>
      }
      </>
  )
}

export default ReadingStatsContainer