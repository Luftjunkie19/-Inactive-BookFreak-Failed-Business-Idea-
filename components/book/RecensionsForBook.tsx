'use client';

import 'node_modules/font-awesome/css/font-awesome.min.css'; 

import { AiOutlineReload } from "react-icons/ai";
import ReactStars from "react-rating-stars-component";
import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import { formatDistanceToNow } from 'date-fns';
import Lottie from 'lottie-react';
import { useSelector } from 'react-redux';
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from 'react-icons/ti';


import guyAnimation
  from '../../assets/lottieAnimations/NoRecensions.json';
import translations from '../../assets/translations/BookPageTranslations.json';
import RecensionManagmentBar from '../managment-bar/RecensionManagmentBar';
import Recension from 'components/elements/recension/Recension';
import { DataView } from 'primereact/dataview';
import { useAuthContext } from "hooks/useAuthContext";
import { Rating } from "primereact/rating";
import { FaRegStar, FaStar } from "react-icons/fa6";
import { FaStarHalfAlt } from "react-icons/fa";
import Button from "components/buttons/Button";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

type Props = {
  hasReadBook: boolean,
  hasRecension:boolean,
  recensions: any[],
  bookId: string,
  setWhereFilters: (array:Object[]) => void,
  setOrderSorting: (obj:Object)=>void
 
}

function RecensionsForBook({
  hasReadBook,
  hasRecension,
  recensions,
  setWhereFilters,
  setOrderSorting,
bookId
}: Props) {
  const { user } = useAuthContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recensionContent, setRecensionContent] = useState<string>();
  const [recensionRate, setRecensionRate] = useState<number>();
  const [recensionsNumber, setRecensionsNumber] = useState(10);
  const [editRecensionId, setEditRecensionId] = useState<string>();
  const queryClient = useQueryClient();
  
  const { mutateAsync } = useMutation({
    'mutationFn': async () => {
      if (!editRecensionId) {
        await fetch('/api/supabase/recension/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              rating: recensionRate,
              bookId,
              comment: recensionContent,
              userId: user!.id,
              recensionDate: new Date()
            }
          })
        });
      } else {
           await fetch('/api/supabase/recension/update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
             body: JSON.stringify({
               data: {
                 rating: recensionRate,
                 bookId,
                 comment: recensionContent,
               }, where:{
                 id: editRecensionId,
               }
          })
           });
        setRecensionContent(undefined);
        setRecensionRate(undefined);
        setEditRecensionId(undefined);
      }
   
    }, 'mutationKey': ['book'], onSuccess: async () => {
      await queryClient.refetchQueries({'queryKey':['book']});  
 }})

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
    // publishRecension(resension, bookRate);
    await mutateAsync();
    toast.success('YOU DID IT, YEAY !');
     } catch (err) {
      toast.error('Somethin went not the way its supposed to.'); 
      console.log(err);
    }
  };


  const selectedLanguage = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  const isDarkModed = useSelector((state: any) => state.mode.isDarkMode);
  // eslint-disable-next-line react-hooks/exhaustive-deps


  const [selectedFilters, setFilters] = useState<any[]>([]);
  const [selectedSorting, setSorting] = useState <any | null>(null);
  const filterOptions = [
    {
      label: "⭐ 10.0",
      filterArray: {where:{rating:{equals:10}}},
    },
    {
      label: "⭐ 9.0",
      filterArray: {where:{rating:{equals:9}}},
    },
    {
      label: "⭐ 8.0",
      filterArray:{where:{rating:{equals:8}}},
    },
    {
      label: "⭐ 7.0",
      filterArray: {where:{rating:{equals:7}}},
    },
    {
      label: "⭐ 6.0",
      filterArray: {where:{rating:{equals:6}}},
    },
    {
      label: "⭐ 5.0",
      filterArray: {where:{rating:{equals:5}}},
    },
    {
      label: "⭐ 4.0",
      filterArray: {where:{rating:{equals:4}}},
    },
    {
      label: "⭐ 3.0",
      filterArray: {where:{rating:{equals:3}}},
    },
    {
      label: "⭐ 2.0",
      filterArray: {where:{rating:{equals:2}}},
    },
    {
      label: "⭐ 1.0",
      filterArray: {where:{rating:{equals:1}}},
    },
  ];

  const sortOptions = [
    {
      label: "Highest Rating",
      sortArray: {orderBy:{rating:'desc'}}
    },
    {
      label: "Lowest Rating",
      sortArray: {orderBy:{rating:'asc'}},
    },
    {
      label: "Earliest Recensions",
      sortArray: { orderBy:{recensionDate:'desc'}},
    },
    {
      label: "Latest Recensions",
        sortArray: { orderBy:{recensionDate:'asc'}},
    },
  ];

  const addToFilters = async (labels: any) => {
    const filters = labels.map((label: any) => {
      const foundFilter = filterOptions.find((item) => item.label === label);
      if (foundFilter) {
        setFilters([...filters, foundFilter.filterArray.where]);
        setWhereFilters(filters);
      }
    });
    await queryClient.refetchQueries({'queryKey':['book']})

  }

  const selectSorting = async (label: any) => {
    const foundSort = sortOptions.find((item) => item.label === label);
    if (foundSort) {
      setSorting(foundSort.sortArray.orderBy);
      setOrderSorting(foundSort.sortArray.orderBy);
    }
       await queryClient.refetchQueries({'queryKey':['book']})
  }


  return (
    <div className="flex flex-col gap-3">
      {(hasReadBook && hasRecension) || editRecensionId && 
        <form
          className="max-w-xl flex flex-col gap-2 w-full p-1"
          onSubmit={handlePublish}
        >
          <label className="flex flex-col">
            <span className="font-bold text-xl text-white">{translations.buttonsTexts.rateBook[selectedLanguage]}:</span>
          <ReactStars 
            
            classNames='h-fit p-0 m-0'
    count={10}
            onChange={(rating) => {
              setRecensionRate(rating);
    }}
    size={36}
    isHalf={true}
emptyIcon={<i className="fa fa-star"></i>}
    halfIcon={<i className="fa fa-star-half-alt"></i>}
    fullIcon={<i className="fa fa-star"></i>}
    activeColor="#4777ff"
  />
          </label>

          <label className="flex flex-col gap-1 w-full">
            <span className={`font-bold text-lg text-white`}>{translations.recensionLabel[selectedLanguage]}:</span>
          <textarea
            value={recensionContent}
            onChange={(e)=>setRecensionContent(e.target.value)}
              className="textarea text-white max-w-xl w-full max-h-36 min-h-28 h-full text-lg outline-none border-2 rounded-lg bg-dark-gray border-primary-color resize-none"
              placeholder={`${translations.recensionPlaceholder[selectedLanguage]}`}
            ></textarea>
          </label>

        <Button isSubmit type="blue" additionalClasses="w-fit px-2">
            {translations.buttonsTexts.publishBtn[selectedLanguage]}
        </Button>
        
         
        </form>
      }
      
        <RecensionManagmentBar
          applySort={selectSorting}
          applyFilters={addToFilters}
          sortings={sortOptions}
          filters={filterOptions}
          filtersSelected={selectedFilters}
          sortSelected={selectedSorting}
          />
      

        <div className="flex flex-col">
          <p className='text-white text-2xl font-semibold'>Recensions</p>
          <p className='text-white'>For now this book has been reviewed by {recensions.length} readers.</p>
          </div>
      
      <div className=" flex flex-col gap-3 max-h-[36rem] overflow-y-auto h-full">
        {recensions.map((item) => (<Recension onClick={(recensionData) => {
          setRecensionContent(recensionData.content);
          setEditRecensionId(recensionData.id);
          setRecensionRate(recensionData.rate);
        }} recensionId={item.id} key={item.id} userImg={item.user.photoURL} username={item.user.nickname} rate={item.rating} isOwner={item.user.id === user?.id} content={item.comment} type={'white'} />))}
          </div>




      {/* <div className="flex gap-4">
      {currentIndex > 0 && sortedArray().slice(currentIndex - 10, recensionsNumber - 10).length > 0 && <button className="btn bg-accColor border-none" onClick={() => {
        setCurrentIndex(prev => prev - 10);
        setRecensionsNumber(prev => prev - 10);
      }}>Back</button>}
      {sortedArray().slice(currentIndex + 10, recensionsNumber + 10).length > 0 && <button className="btn bg-accColor border-none" onClick={() => {
        setCurrentIndex(prev => prev + 10);
        setRecensionsNumber(prev => prev + 10);
      }}>Next</button>}
      </div> */}
      
    </div>
  );
}

export default RecensionsForBook;
