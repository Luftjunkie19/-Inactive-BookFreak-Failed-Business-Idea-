'use client';
import { useCheckPathname } from 'hooks/useCheckPathname'



function useTourGuide() {
    const { includesElements, isPathnameEqual } = useCheckPathname();
    
    const steps = isPathnameEqual('/') ? [
        {
            intro: `This will be the first ever Guide Toor through the app, of course if you'll need it 😅`,

            title: "Welcome to BookFreak !",
            tooltipClass: 'bg-dark-gray text-white rounded-lg  min-w-72  max-w-sm w-full',
        },
        {
            element: '#activityManager',
            intro: 'Here you can post your ideas, your mood or share with others what book, you recently read.',
            'title': '1. Posting Activity',
            position: 'bottom',
            tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72 max-w-sm w-full',
        },
        {
            'intro': "This is the home page. Place where your journey starts. You can find here competitions, clubs or books, that could appeal to your preferences.",
            'position': 'bottom',
            'title': "2. Home Page",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
        },
        {
            element: '#left-bar',
             'title': "3. Left Bar",
            intro: 'This Bar is devoted, to select a category, which you would like to browse through. Also if you are a premium-member you are elligible to use the AI features and so forth.',

              'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72 max-w-sm w-full',
        },
        {
            'element': '#user-panel',
            title: "3. User Panel",
            position: 'center',
            intro: 'This section of the app, is devoted for the user actions.',
            tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
        },

        {
            element: '#create-btn',
            'position': 'bottom',
            'title': "4. Contribute to our community",
            'intro': "By clicking plus button, you'll see dropdown of what you can create in this app. Build your own club, set a competition, insert a book or create a test. It's your choice !",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
        },
        {
            element: "#notification-btn",
            'position': 'bottom',
            'title': "5. Notifications",
            'intro': "Here you can see all the notifications, that you've received from other users",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
        },
        {
            element: "#msg-btn",
            'position': 'bottom',
            'title': "6. Messages",
            'intro': "Here you can see all the messages, that you've received from other users",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
        },
        {
            element: '#lang-btn',
            'position': 'bottom',
            'title': "7. Language",
            'intro': "Here you can change the language of the app. For now only 3 are available, but we promise to add more !",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
        },
        {
            'position': 'center',
            'title': "That's it !",
            'intro': "Thank you for going through the guide and we wish as much progress as impossible !",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
        }
  
    ] : includesElements('/search') ? [
          {
    'intro':"Search Page, place where you can browse through certain categories you would like to explore.",
    'position': 'bottom',
    'title':"Searching 🔎",
    'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
            },
            {
                'intro': "Search bar, where you can type in what you are looking for.",
                "title": '1. Text Search',
                'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                element: "#search-section",
                                position:"left"
        },
         {
                'intro': 'In this section you can choose as many of the available filter options as you wish. (Sometimes, you will need to scroll down the options available)',
                "title": '2. Filter Section',
                'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
             element: "#filter-section",
                position:"left"
            },
                  {
                'intro': 'In this section you can choose one of the available sorting options. (Sometimes, you will need to scroll down the options available)',
                "title": '3. Sorting Section',
                'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                      element: "#sort-section",
                                position:"left"
        }
        ] : [];

    return { steps };
 
}

export default useTourGuide