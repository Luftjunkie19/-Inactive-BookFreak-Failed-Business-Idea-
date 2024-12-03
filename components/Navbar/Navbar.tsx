'use client';

import { usePathname } from 'next/navigation';
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import introJs from 'intro.js';
import navBarTranslation
  from '../../assets/translations/navbarTranslations.json';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useLogout } from '../../hooks/useLogout';
import LanguageSelect from './LanguageSelect';
import NotificationViewer from './NotificationViewer';
import SignInBtn from './Sign-Buttons/SignInBtn';
import SignUpBtn from './Sign-Buttons/SignUpBtn';
import UserDropDown from './User-Dropdown/UserDropDown';
import Link from 'next/link';
import { Input } from '@nextui-org/react';
import { FaHome, FaInfoCircle, FaSearch } from 'react-icons/fa';
import MobileDrawer from './Drawer/Drawer';
import CreateBtn from 'components/buttons/CreateBtn';
import { PiChatsCircleFill } from 'react-icons/pi';
import { useQuery } from '@tanstack/react-query';
import { useCheckPathname } from 'hooks/useCheckPathname';
import useTourGuide from 'lib/TourGuideData';


function Navbar() {
  const translations = navBarTranslation;
  const languageChosen = useSelector(
    (state: any) => state.languageSelection.selectedLangugage
  );
  const {includesElements, isPathnameEqual}=useCheckPathname();
  const { user } = useAuthContext();
  const location = usePathname();

  const { steps } = useTourGuide();


  const dispatch = useDispatch();

  return (
    <div className="flex sticky sm:h-14 lg:h-16 top-0 left-0 z-50 bg-primary-color justify-between px-4 py-2 items-center w-full">
      <div className="flex gap-2 items-center sticky top-0 left-0">
        <Link href={'/'} className=' text-white text-xl'><span className='text-secondary-color text-2xl font-bold'>B</span>ook<span className='text-secondary-color text-2xl font-bold'>F</span>reak</Link>
        
      </div>
      {user ?
        <div id='user-panel' className="flex items-center gap-6">
          { user && <UserDropDown userId={user.id}/>}
          <Link className={`sm:hidden lg:block ${isPathnameEqual('/') ? 'text-dark-gray' : 'text-white'}`} href={'/'}><FaHome className='text-2xl' /></Link>
          <CreateBtn buttonColour={`${includesElements('/form/') ? 'text-dark-gray' : 'text-white'}`}/>
          <NotificationViewer />
                    <Link id='msg-btn' href={'/chat'} className='sm:hidden lg:block'><PiChatsCircleFill  className={`text-2xl ${isPathnameEqual('/chat') ? 'text-dark-gray' : 'text-white'}`} /></Link>
       
          
          
          <LanguageSelect  />
          <MobileDrawer/>
          <button onClick={() => {


            introJs().setOptions({steps:steps}).start();
      
          }}>
            <FaInfoCircle className='text-2xl text-white hover:text-secondary-color duration-500 transition-all' />
            </button>
  
        </div> : <div className="flex items-center gap-5">
          <SignInBtn />
          <SignUpBtn />
          <LanguageSelect />
        </div>
      }

    </div>
  );
}

export default Navbar;
