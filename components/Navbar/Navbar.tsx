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
import LanguageSelect from './LanguageSelect';
import NotificationViewer from './NotificationViewer';
import SignInBtn from './Sign-Buttons/SignInBtn';
import SignUpBtn from './Sign-Buttons/SignUpBtn';
import Link from 'next/link';
import { Input } from '@nextui-org/react';
import { FaHome } from 'react-icons/fa';
import MobileDrawer from './Drawer/Drawer';
import CreateBtn from 'components/buttons/CreateBtn';
import { PiChatsCircleFill } from 'react-icons/pi';
import { useQuery } from '@tanstack/react-query';
import { useCheckPathname } from 'hooks/useCheckPathname';
import useTourGuide from 'lib/TourGuideData';
import { FaQuestion } from 'react-icons/fa6';
import Image from 'next/image';

import logoImage from "../../public/Logos/trasparent for website.png"
import logoImageMobile from "../../public/Logos/bookfreakfav.png"

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
    <div className="flex sticky sm:h-14 lg:h-16 top-0 left-0 z-50 rounded-b-xl shadow-md shadow-primary-color   border-primary-color  bg-dark-gray justify-between px-4 py-1 items-center w-full">
      <div className="flex gap-2 items-center">
        <Link href={'/'} >
          <Image className="w-48 object-contain h-12 sm:hidden lg:block" src={logoImage} width={60} height={140} alt="logo" />
          <Image className="w-12 h-12 object-contain sm:block lg:hidden" src={logoImageMobile} width={60} height={140} alt="logo" />
        </Link>
        
      </div>
      {user ?
        <div id='user-panel' className="flex items-center gap-6">

          <Link className={`sm:hidden lg:block ${isPathnameEqual('/') ? 'text-primary-color' : 'text-white'}`} href={'/'}><FaHome className='text-2xl' /></Link>
          <CreateBtn buttonColour={`${includesElements('/form/') ? 'text-primary-color' : 'text-white'}`}/>
          <NotificationViewer />
                    <Link id='msg-btn' href={'/chat'} className='sm:hidden lg:block'><PiChatsCircleFill  className={`text-2xl ${isPathnameEqual('/chat') ? 'text-primary-color' : 'text-white'}`} /></Link>
       
          
          
          <LanguageSelect  />
          <MobileDrawer/>
          <button className={`${isPathnameEqual('/') || (includesElements('/profile/') && !includesElements('/dashboard')) || includesElements('/form/') || includesElements('/search') ? 'flex items-center text-white group hover:text-secondary-color transition-all duration-500 gap-2' : 'hidden'}`} onClick={() => {
            introJs().setOptions({steps:steps}).start();
          }}>
            Help
            <FaQuestion className='text-2xl text-white group-hover:text-secondary-color duration-500 transition-all' />
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
