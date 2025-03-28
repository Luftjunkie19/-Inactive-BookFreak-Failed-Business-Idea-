'use client';
import {
  useMemo,
  useState,
} from 'react';

import Image from 'next/image';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
} from '@nextui-org/react';
import { languageActions } from 'context/LanguageContext';

function LanguageSelect() {
  const selectedLangugage = useSelector(
    (state:any) => state.languageSelection.selectedLangugage
  );
    const [selectedKey, setSelectedKey] = useState<Selection>(new Set([selectedLangugage]));
  const dispatch = useDispatch();

  const handleMenuItemClick = (unicode:Selection) => {
    const transformedValue=Array.from(unicode).join(", ").replaceAll("_", " ");
    dispatch(languageActions.selectLanguage(transformedValue));

    setSelectedKey(unicode);
  };
  const selectedValue = useMemo(
    () => Array.from(selectedKey).join(", ").replaceAll("_", " "),
    [selectedKey]
  );



  const options = [
    { unicode: "eng", flagUrl: "https://flagcdn.com/w40/gb.png", name:'English' },
    { unicode: "ger", flagUrl: "https://flagcdn.com/w40/de.png", name:'Deutsch' },
    { unicode: "pl", flagUrl: "https://flagcdn.com/w40/pl.png", name:'Polski'},
  ];

  

  return (
    <Dropdown className="sm:hidden lg:flex" classNames={{
      'content':'bg-dark-gray border-2 border-primary-color text-white p-2'
    }}>
    <DropdownTrigger className="sm:hidden lg:flex">
        <button
      id='lang-btn'    
      className='flex text-white text-sm capitalize items-center gap-2 p-1'
      >
        <Image width={24} height={24} alt='' className='w-6 h-6 rounded-full' src={options.find((item)=>item.unicode === selectedValue) ? (options.find((item)=>item.unicode === selectedValue) as any).flagUrl : ''}/>
      </button>
    </DropdownTrigger>
    <DropdownMenu 
      aria-label="Single selection example"
      variant="flat"
      disallowEmptySelection
      selectionMode="single"
      selectedKeys={selectedKey}
        onSelectionChange={handleMenuItemClick}
       
    >
        {options.map((option) => (<DropdownItem textValue={option.unicode} key={option.unicode} classNames={{
          'base': 'text-white hover:text-white',
        'wrapper':'hover:text-white'
      }} className='flex gap-2 hover:text-white items-center'>
       <div className="flex gap-2 items-center">
        <Image width={24} height={24} alt='' className='w-6 h-6 rounded-full' src={option.flagUrl}/>
        {option.name}
       </div>
        </DropdownItem>))}
    </DropdownMenu>
  </Dropdown>
  );
}

export default LanguageSelect;
