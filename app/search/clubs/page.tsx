'use client';


import React, {
  useCallback,
  useEffect,
  useState,useMemo
} from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import 
  Link
 from 'next/link';

import lottieAnimation
  from '../../../assets/lottieAnimations/No-Data-Found.json';
import clubsTranslations
  from '../../../assets/translations/ClubsTranslations.json';
import formTranslations from '../../../assets/translations/FormsTranslations.json';
import reuseableTranslations
  from '../../../assets/translations/ReusableTranslations.json';
import ManagementBar from '../../../components/managment-bar/ManagementBar';
import { useRouter, useSearchParams } from 'next/navigation';
import { Autocomplete, AutocompleteItem, Checkbox, CheckboxGroup, Pagination, Radio, RadioGroup } from '@nextui-org/react';
import FilterBar from '../../../components/Sidebars/right/FilterBar';
import Club, { clubProps } from 'components/elements/Club';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import LabeledInput from 'components/input/LabeledInput';
import { FaSearch } from 'react-icons/fa';
import SearchContainer from 'components/search/SearchContainer';

function Clubs() {

  const filterOptions = [{
    label: "<= 100 read pages", filter: {
      requirements: {
        some: {
          requiredPagesRead: {
            lte: 100
          },
          },
      },
    }
}, 
{
    label:">= 100 read pages", filter:{
      requirements: {
        some: {
          requiredPagesRead: {
            gte: 100
          },
                },
      },
    }
}, 

    
  ];

  const sortOptions = [
    {
        label:"Time (Ascending)", 
        sort:{
                creationDate:'asc'
            }
    },
    {
        label:"Time (Descending)", 
        sort:{
                creationDate:'desc'
            }
    }
  ];


  const selectedLanguage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );


  
  
  return (
    <SearchContainer<clubProps>
      renderComponent={(item) => <Club
        key={item.id}
        clubLogo={item.clubLogo} clubName={'CLUBNAME !'} membersAmount={item.members.length} clubData={item} hasRequirements={item.requirements.length > 0} type={'white'} />}
    apiPath='/api/supabase/club/getAll'
      queryKey={'clubs'} initialSearchParamsState={
      { skip: 0, take: 25, where: undefined, include: { members:true, requirements:true }, orderBy: undefined }
        } filterOptions={
          filterOptions
        } sortingOptions={
          sortOptions
        } />
  );
}

export default Clubs;