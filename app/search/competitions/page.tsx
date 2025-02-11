'use client';

import React from 'react';


import { useSelector } from 'react-redux';

import Competition, { competitionProps } from 'components/elements/Competition';

import SearchContainer from 'components/search/SearchContainer';

function Competitions() {


  const filterOptions = [{
    label:"prize (Money)", filter:{chargeId:true}
}, 
{
    label:"prize (Item)", filter:{
chargeId:null
    }
}, 
{
    label:"Type (Teach to fish)", filter:{competitionsType:'Teach to Fish'}
}, 
{
    label:"Type (Lift others, rise)", filter:{competitionsType:'Lift others, rise'}
}, 
{
    label:"Type (First Come, First Booked)",
    filter: {competitionType:'First Come, First Booked'}
},
{label:"Expired",filter:{expiresAt:{
  lt: new Date()
}}
},{
  label:"Not Expired",filter:{
  expiresAt:{
    gt: new Date(),
  }
  }
}
  ];
  const sortOptions = [
    {
        label:"Time (Ascending)", 
        sort:{creationDate:'asc'}
    },
    {
        label:"Time (Descending)", 
        sort:{creationDate:'desc'}
    }
  ];



  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );

  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  



  return (
       <SearchContainer<
        competitionProps
   >
      renderComponent={(item) =>   <Competition members={item.members}  competitionId={item.id} competitionLogo={item.competitionLogo} competitionName={item.competitionName} membersAmount={item.members.length} comeptitionRemainingTime={new Date(item.endDate)} type={'dark'}  />
        }
    apiPath='/api/supabase/competition/getAll'
        queryKey={'books'} initialSearchParamsState={
       { skip: 0, take: 25, where: undefined, include: { rules:true, members:true }, orderBy: undefined }
        } filterOptions={
          filterOptions
        } sortingOptions={
          sortOptions
        } />
  );
}

export default Competitions;
