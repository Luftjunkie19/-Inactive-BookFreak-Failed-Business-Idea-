import BookSwiper from 'components/home/swipers/BookSwiper';
import CompetitionSwiper from 'components/home/swipers/CompetitionSwiper';
import ClubSwiper from 'components/home/swipers/ClubSwiper';
import ActivityManager from 'components/home/ActivityManager';
import AdBanner from 'components/advertisements/AdBanner';
import SubscriptionRow from 'components/elements/subscription/SubscriptionRow';
import PostsSwiper from 'components/home/swipers/PostsSwiper';
import { Step, Steps } from 'intro.js-react';
import TourGuide from 'components/TourGuide';

export default function Home() {
const steps:Step[] = [
  {
    intro: `This will be the first ever Guide Toor through the app, of course if you'll need it 😅`,
    position: 'bottom',
    title:"Welcome to BookFreak !", 
    tooltipClass: 'bg-dark-gray text-white rounded-lg  sm:min-w-72 lg:min-w-96  max-w-sm w-full',    
  },
  {
    element: '#activityManager',
    intro: 'Here you can post your ideas, your mood or share with others what book, you recently read.',
    'title':'1. Posting Activity',
     tooltipClass: 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',    
  },
  {
    'element':'#user-panel',
    title:"2. User Panel",
    intro: 'This section of the app, is devoted for the user actions.',
       tooltipClass: 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',    
  },
];



  return (
    <div className={`flex flex-col p-2`}>

      <TourGuide steps={steps} enabled={true} initialStep={0} />


      <ActivityManager />

      
      <AdBanner  data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
     data-ad-slot="3495164206"
     data-ad-format="auto"
     data-full-width-responsive="true"/>
      
      <PostsSwiper/>
      <BookSwiper />
      <CompetitionSwiper />
      <ClubSwiper/>
    <SubscriptionRow/>
    </div>
  );
}
