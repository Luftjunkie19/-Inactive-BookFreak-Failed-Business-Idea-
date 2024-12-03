'use client';
import { useCheckPathname } from 'hooks/useCheckPathname'



function useTourGuide() {
    const { includesElements, isPathnameEqual } = useCheckPathname();
    
    const steps = isPathnameEqual('/') ? [
        {
            intro: `This will be the first ever Guide Toor through the app, of course if you'll need it 😅`,
            position: 'center',
            title: "Welcome to BookFreak !",
            tooltipClass: 'bg-dark-gray text-white rounded-lg  sm:min-w-72 lg:min-w-96  max-w-sm w-full',
        },
        {
            element: '#activityManager',
            intro: 'Here you can post your ideas, your mood or share with others what book, you recently read.',
            'title': '1. Posting Activity',
            position: 'bottom',
            tooltipClass: 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',
        },
        {
            'intro': "This is the home page. Place where your journey starts. You can find here competitions, clubs or books, that could appeal to your preferences.",
            'position': 'bottom',
            'title': "2. Home Page",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',
        },
        {
            element: '#left-bar',
             'title': "3. Left Bar",
            intro: 'This Bar is devoted, to select a category, which you would like to browse through. Also if you are a premium-member you are elligible to use the AI features and so forth.',

              'tooltipClass': 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',
        },
        {
            'element': '#user-panel',
            title: "3. User Panel",
            position: 'center',
            intro: 'This section of the app, is devoted for the user actions.',
            tooltipClass: 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',
        },

        {
            element: '#create-btn',
            'position': 'bottom',
            'title': "4. Contribute to our community",
            'intro': "By clicking plus button, you'll see dropdown of what you can create in this app. Build your own club, set a competition, insert a book or create a test. It's your choice !",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',
        },
        {
            element: "#notification-btn",
            'position': 'bottom',
            'title': "5. Notifications",
            'intro': "Here you can see all the notifications, that you've received from other users",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',
        },
        {
            element: "#msg-btn",
            'position': 'bottom',
            'title': "6. Messages",
            'intro': "Here you can see all the messages, that you've received from other users",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',
        },
        {
            element: '#lang-btn',
            'position': 'bottom',
            'title': "7. Language",
            'intro': "Here you can change the language of the app. For now only 3 are available, but we promise to add more !",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',
        },
        {
            'position': 'center',
            'title': "That's it !",
            'intro': "Thank you for going through the guide and we wish as much progress as impossible !",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',
        }
  
    ] : includesElements('/search') ? [
          {
    'intro':"Search Page, place where you can browse through certain categories you would like to explore.",
    'position': 'bottom',
    'title':"Searching 🔎",
    'tooltipClass': 'bg-dark-gray text-white rounded-lg sm:min-w-72 lg:min-w-96  max-w-sm w-full',
  },
    ] : [];

    return { steps };
 
}

export default useTourGuide