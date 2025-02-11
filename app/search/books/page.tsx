'use client';

import '../../../stylings/primereact-custom/dataview.css'

import React from 'react';

import { useSelector } from 'react-redux';
import typesTranslation from '../../../assets/translations/TypesTranslations.json';
import SearchContainer from 'components/search/SearchContainer';
import Book, { BookProps } from 'components/elements/Book';

function Books() {
  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  


  const categoryTypes = [
    {
      filter: { genre: 'fiction' },
      label: typesTranslation.bookFilter.fiction[selectedLanguage],
    },
    {
      filter: { genre: 'non-fiction' },
      label: typesTranslation.bookFilter["non-fiction"][selectedLanguage],
    },
    {
      filter: { genre: 'crime' },
      label: typesTranslation.bookFilter.crime[selectedLanguage],
    },
    {
      filter: { genre: 'Science fiction and fantasy' },
      label: typesTranslation.bookFilter.scienceFF[selectedLanguage],
    },
    {
      filter: {genre: `Children's and young adult literature`},
      label: typesTranslation.bookFilter.cayal[selectedLanguage],
    },
    {
      filter: {genre:'Travel and adventure literature'},
      label: typesTranslation.bookFilter.travelaal[selectedLanguage],
    },
    {
      filter: {genre:'Popular science and popular history'},
      label: typesTranslation.bookFilter.popularScience[selectedLanguage],
    },
    {
      filter:{genre:'Self-help and personal development'},
      label: typesTranslation.bookFilter.selfHelp[selectedLanguage],
    },
    {
      filter: {genre:'History and culture'},
      label: typesTranslation.bookFilter.history[selectedLanguage],
    },
    {
      filter: {genre:'Art and design'},
      label: typesTranslation.bookFilter.artDesign[selectedLanguage],
    },
    {
      filter: {genre:'Business and economics'},
      label: typesTranslation.bookFilter.Business[selectedLanguage],
    },
    {
      filter: { genre:'Psychology and philosophy'},
      label: typesTranslation.bookFilter.Psychology[selectedLanguage],
    },
    {
      filter: {genre:"Health and medicine"},
      label: typesTranslation.bookFilter.Health[selectedLanguage],
    },
    {
      filter: {genre:'Erotic literature'},
      label: typesTranslation.bookFilter.Erotic[selectedLanguage],
    },
  ];

  const sortTypes = [
    {
      label: typesTranslation.bookSort.Default[selectedLanguage],
      sort:{title:'desc'},
    },
    {
      label: typesTranslation.bookSort.pagesDescending[selectedLanguage],
      sort:{pages:'asc'},
    },
    {
      label: typesTranslation.bookSort.pagesAscending[selectedLanguage],
      sort: {pages:'desc'},
    },

  ];




   


  return (
    <SearchContainer<BookProps>
      renderComponent={(item) => <Book key={item.id}
        recensions={item.recensions.length} bookId={item.id} bookCover={item.bookCover} pages={item.pages} author={item.bookAuthor} title={item.title} bookCategory={item.genre} type={'transparent'} />}
    apiPath='/api/supabase/book/getAll'
      queryKey={'books'} initialSearchParamsState={{ skip: 0, take: 25, where: undefined, include: { recensions: true }, orderBy: undefined }} filterOptions={categoryTypes} sortingOptions={sortTypes} />
  );
}

export default Books;
