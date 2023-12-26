import '../../components/stylings/mui-stylings.css';

import React, {
  useCallback,
  useEffect,
  useState,
} from 'react';

import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import {
  Autocomplete,
  Pagination,
  TextField,
} from '@mui/material';

import lottieAnimation
  from '../../assets/lottieAnimations/Animation - 1700320134586.json';
import clubsTranslations
  from '../../assets/translations/ClubsTranslations.json';
import ClubsManagmentBar
  from '../../components/RecensionsComponents/ClubsManagmentBar';
import useRealtimeDocuments from '../../hooks/useRealtimeDocuments';

function Clubs() {
  const { getDocuments } = useRealtimeDocuments();
  const [documents, setElements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadElements = async () => {
    const booksEl = await getDocuments("readersClubs");
    setElements(booksEl);
  };

  const filterOptions = [{
    label:"<= 100 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead <= 100);
    }
}, 
{
    label:">= 100 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead >= 100);
    }
}, 
{
    label:">= 500 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead >= 500);
    }
}, 
{
    label:">= 1000 read pages", filter:(array)=>{
        return array.filter((doc)=>doc.requiredPagesRead >= 1000);
    }
}, 
    
  ];


  const sortOptions = [
    {
        label:"Time (Ascending)", 
        sort:(array)=>{
            return array.sort((a,b)=>b.createdBy.createdAt - a.createdBy.createdAt);
        }
    },
    {
        label:"Time (Descending)", 
        sort:(array)=>{
            return array.sort((a,b)=>a.createdBy.createdAt - b.createdBy.createdAt);
        }
    }
  ];


  const objectsOnPage = () => {
    if (document.body.clientWidth > 0 && document.body.clientWidth < 1024) {
      return 10;
    } else {
      return 45;
    }
  };
  const fetchObjects = useCallback(
    (page) => {
      const start = (page - 1) * objectsOnPage();
      const end = start + objectsOnPage();
      const pageObjects = documents.slice(start, end);
      return pageObjects;
    },
    [documents]
  );

  const handlePagesChange = (e, value) => {
    if (currentPage < pagesAmount) {
      setCurrentPage(currentPage + 1);
      const pageObjects = fetchObjects(currentPage + 1);
      setElements(pageObjects);
      return;
    }

    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      const pageObjects = fetchObjects(currentPage - 1);
      setElements(pageObjects);
      return;
    }
    setCurrentPage(value);
  };

  const pagesAmount = Math.ceil(documents.length / objectsOnPage());

  useEffect(() => {
    loadElements();
  }, [loadElements]);

  useEffect(() => {
    if (documents.length > 0) {
      const fetchedObjects = fetchObjects(currentPage);
      setElements(fetchedObjects);
    }
  }, [currentPage, documents, fetchObjects]);

  const selectedLanguage = useSelector(
    (state) => state.languageSelection.selectedLangugage
  );

  const [filterQuery, setFilterQuery] = useSearchParams({ filters: "" });

  
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedSort, setSelectedSort] = useState("");

  const applyFilters = (filters) => {
    setSelectedFilters(filters);
    console.log(filters);
  };

  const applySort = (sort) => {
    setSelectedSort(sort);
  };

  const filteredItems = () => {
    if (selectedFilters.length > 0) {
      const filteredDocuments = selectedFilters.reduce((result, selectedFilter) => {
        const filterOption = filterOptions.find(option => option.label === selectedFilter);
  
        if (filterOption) {
          const temp = filterOption.filter(result);
          return temp;
        }
  
        return result;
      }, documents);
  
      return filteredDocuments;
    } else {
      // If no filters selected, return all documents
      return documents;
    }
  };

  const sortedClubs = () => {
    if (selectedSort.trim("") !== "") {
      return sortOptions
        .find((option) => option.label === selectedSort)
        .sort(documents)
    } else {
      return filteredItems();
    }
  };



  return (
    <div className="min-h-screen h-full">
      <h2 className="text-2xl text-center font-semibold py-2 text-white">
        {sortedClubs() && sortedClubs().length && sortedClubs().length}{" "}
        {sortedClubs() && sortedClubs().length > 1
          ? `${clubsTranslations.clubObject.quantity.more[selectedLanguage]}`
          : `${clubsTranslations.clubObject.quantity.one[selectedLanguage]}`}{" "}
        {sortedClubs() && sortedClubs().length > 1
          ? `${clubsTranslations.clubObject.founded.more[selectedLanguage]}`
          : `${clubsTranslations.clubObject.founded.one[selectedLanguage]}`}
      </h2>
      <div className="flex w-full justify-center items-center flex-wrap">
        <ClubsManagmentBar applyFilters={applyFilters} applySort={applySort} />
        
        <Autocomplete
          className="sm:w-3/4 md:max-w-lg"
          onChange={(e, value) => {
            if (value === null) {
              setFilterQuery(
                (prev) => {
                  prev.set("filters", "");
                  return prev;
                },
                { replace: true }
              );
              return;
            }
            setFilterQuery(
              (prev) => {
                prev.set("filters", value);
                return prev;
              },
              { replace: true }
            );
          }}
          sx={{
            ".MuiAutocomplete-input": {
              color: "white",
            },
       
            ".MuiAutocomplete-inputRoot": {
              background: "#4267B5",
            },

            "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
              border: "0",
            },
          }}
          id="free-solo-demo"
          freeSolo
          options={documents.map((option) => option.clubsName)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Club's name"
              onChange={(e, value) => {
                setFilterQuery(
                  (prev) => {
                    prev.set("filters", e.target.value);
                    return prev;
                  },
                  { replace: true }
                );
              }}
            />
          )}
        />
      </div>
      <div className="flex sm:justify-center md:justify-start items-center flex-wrap gap-4 p-2 my-8 mx-4">
        {sortedClubs() &&
          sortedClubs().length > 0 &&
          sortedClubs()
            .filter((doc) =>
              doc.clubsName
                .toLowerCase()
                .includes(filterQuery.get("filters").toLowerCase())
            )
            .map((doc) => (
              <Link
                to={`/readers-clubs/${doc.id}`}
                key={doc.id}
                className="flex sm:flex-col 2xl:flex-row  sm:w-4/5 md:w-[47%] max-w-xs border-2 border-white items-center gap-2 group p-2 rounded-lg overflow-hidden hover:shadow-md hover:shadow-black hover:bg-lightModeCol bg-accColor hover:scale-[1.01] duration-200 transition-all"
              >
                <img
                  src={doc.clubLogo}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover rounded-full group-hover:scale-95 duration-200 transition-all"
                />

                <div className="flex gap-2 flex-col text-white group-hover:text-primeColor p-4">
                  <p className="text-lg font-semibold">{doc.clubsName}</p>
                  <p>Required to join: {doc.requiredPagesRead} pages</p>
                </div>
              </Link>
            ))}

        {sortedClubs().filter((doc) =>
          doc.clubsName
            .toLowerCase()
            .includes(filterQuery.get("filters").toLowerCase())
        ).length === 0 && (
          <div className="flex w-full flex-col justify-center items-center gap-3">
            <Lottie animationData={lottieAnimation} />
            <p className="text-2xl font-bold text-white text-center">
              No data available
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center p-2">
        <Pagination
          variant="outlined"
          color="primary"
          showLastButton
          showFirstButton
          count={pagesAmount}
          onChange={handlePagesChange}
        />
      </div>
    </div>
  );
}

export default Clubs;
