import BookSwiper from 'components/home/swipers/BookSwiper';
import CompetitionSwiper from 'components/home/swipers/CompetitionSwiper';
import ClubSwiper from 'components/home/swipers/ClubSwiper';
import ActivityManager from 'components/home/ActivityManager';
import AdBanner from 'components/advertisements/AdBanner';
import SubscriptionRow from 'components/elements/subscription/SubscriptionRow';
import PostsSwiper from 'components/home/swipers/PostsSwiper';


export default function Home() {


  return (
    <div className={`flex flex-col p-2`}>




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
