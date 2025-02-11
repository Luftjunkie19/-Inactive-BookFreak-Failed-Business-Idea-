'use client';

import React from 'react';

import { useSelector } from 'react-redux';

import Test, { testProps } from 'components/elements/Test';

import SearchContainer from 'components/search/SearchContainer';


function Tests() {


  const selectedLanguage = useSelector((state:any) => state.languageSelection.selectedLangugage);
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);

  const sortOptions = [
    { label: "Test's name (Z-A)", sort: (tests) => tests.sort((a, b) => b.testName.localeCompare(a.testName)) },
    { label: "Test's name (A-Z)", sort: (tests) => tests.sort((a, b) => a.testName.localeCompare(b.testName)) },
  ];

  const filterOptions = [
    { label: "Queries <= 10", filter: (array) => array.filter(test => Object.values(test.queries).length <= 10) },
    { label: "Queries >= 10", filter: (array) => array.filter(test => Object.values(test.queries).length >= 10) },
  ];


  return (
    <SearchContainer<testProps>
      initialSearchParamsState={
          { skip: 0, take: 25, where: undefined, include: { questions:true, results:true, testLovers:true }, orderBy: undefined }
    } filterOptions={
  filterOptions
      } sortingOptions={
        sortOptions

      } queryKey={
        'tests'

      } apiPath={
        '/api/supabase/test/getAll'
} renderComponent={(item) => <Test testData={item} type='transparent'
      />
 }    
    />
  );
}

export default Tests;
