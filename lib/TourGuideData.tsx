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
            'intro': "Search Page, place where you can browse through certain categories you would like to explore.",
            'position': 'bottom',
            'title': "Searching 🔎",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
        },
        {
            'intro': "Search bar, where you can type in what you are looking for.",
            "title": '1. Text Search',
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
            element: "#search-section",
            position: "left"
        },
        {
            'intro': 'In this section you can choose as many of the available filter options as you wish. (Sometimes, you will need to scroll down the options available)',
            "title": '2. Filter Section',
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
            element: "#filter-section",
            position: "left"
        },
        {
            'intro': 'In this section you can choose one of the available sorting options. (Sometimes, you will need to scroll down the options available)',
            "title": '3. Sorting Section',
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
            element: "#sort-section",
            position: "left"
        }
    ] : isPathnameEqual('/profile/dashboard') ? [
        {
            'position': 'center',
            'title': "1. Dashboard Introduction",
            'intro': "This is your dashboard, place where you can find all the information about your account, progress and many more.",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
        },
        {
            'position': 'center',
            'title': "2. Basic Statistics",
            'intro': "Here you can see how many competitions you've won, how many reviews you've written and how many books have been read !",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
            element:"#basic-stats"
                }, {
                'position': 'center',
            'title': "3. Book Progress",
            intro: `If you're currently reading any book. It will be displayed over here in order for you to keep track of your progress.`,
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
            element:"#current-progress"
            },
                {
                    element: "#reading-stats",
                  'position': 'center',
            'title': "4. Reading Stats",
            intro: `You can track specific identicators about your reading habits and also some detailed statistics like how many pages you can read within an hour.`,
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
            }
            ] : isPathnameEqual('/profile/dashboard/you&friends') ? [
                  {
            'position': 'center',
            'title': "1. Friends Dashboard",
            'intro': "This is like your governance-center where you can see your friends and their progress and compare your results. You can also manage the friendships from here.",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                    },
                    {
                        element: '#rankings',
                        'position': 'center',
                        'title': "2. Rankings",
                        'intro': "Here you can see the rankings with your friends and what it looks like in annual, monthly term.",
                                 'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                    },
                    {
                        element: '#friends-section',
                        'position': 'center',
                        'title': "3. Friends",
                                 'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                        'intro': "Here you can see all the friends you have and manage them, you can remove them or go to their profile from here. Additionally, next to the friends list there is a list with friends request, so you can manage them also from here !",
                    },
                    {
                        element: "#blocked-users",
                        position: "center",
                        title: '4. Blocked users',
                                 'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                        intro:'Perhaps that are not your friends, but a list of people you block. From here you can manage, whether you want to block them permanently or you want to give them a second chance, by unblocking them.',
                    }
            
                ] : isPathnameEqual('/profile/dashboard/fincances') ? [
                        {
                        position: "center",
                        title: "1. Financial Data",
                
                            intro: "In case you would like to purchase a subscription in our app, you unforunately will have to provide the data. However if you are already a member, you can see your financial data and update them whenever you need here.",
                        },
                        {
                            position: "center",
                            title: '2. Personal Data',
                            element:'#personal-data',
                            intro: 'If you are a member, you can see your personal data and update them whenever you need here. These data will be used for the purpose of billing.',
                        }, {
                            title: 'Credits Management',
                            element: '#credits-management',
                            intro:'If you have won some credits, you can see them here and use them for the purpose of billing.',
                        }, {
                            title: 'Subscription Management',
                            element: '#subscription-management',
                            intro:'If you are a member, you can see your subscription data and update them whenever you need here. These data will be used for the purpose of billing.',
                        }
                    ] : isPathnameEqual('/profile/dashboard/links') ? [
             {
            'position': 'center',
            'title': "1. Links To Accounts",
            'intro': "If you'd like to link your other social-media accounts to your BookFreak account, you can do it here.",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                            },
                         {
            'position': 'center',
            'title': "2. Add your link",
            'intro': "From this little section, you can add your links to your social media accounts. We'll keep them up to date with you.",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                            },
                           {
            'position': 'center',
            'title': "3. Management of existing link",
            'intro': "From this little section, you can manage your links to your social media accounts. You can either update them or delete them.",
            'tooltipClass': 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                            },
                           

                        ] : isPathnameEqual('/profile/dashboard/book-progress') ? [
                                {
                                position: 'center',
                                title: '1. Book Progress',
                                intro: "If you're currently reading any book. It will be displayed over here in order for you to keep track of your progress.",
                                tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                                },
                                {
                                    position: 'center',
                                    title: '2. Progress Control',
                                    intro: "If you're currently reading any book. It will be displayed over here in order for you to keep track of your progress.",
                                    tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                                },
                                {
                                    position: 'center',
                                    title: '3. Book Progress Charts',
                                    intro: "If you're reading any book in the moment, then you can see the progress charts over here. It will depict you, what are the certain statistics.",
                                    tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                                },
                                {
                                    position: 'center',
                                    title: '4. Book Progress Notes',
                                    intro: "By clicking the note add button, you can add notes to your book progress session0. It will be displayed over here in order for you to keep track of your progress.",
                                    tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                                }
                            ] : isPathnameEqual('/profile/dashboard/reading-stats') ? [
                                    {
                                    position: 'center',
                                    title: '1. Reading Stats',
                                    intro: "You can track specific identicators about your reading habits and also some detailed statistics like how many pages you can read within an hour.",
                                    tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                                    },
                                    {
                                    position: 'center',
                                    title: '2. Reading Preferences Charts',
                                    intro: "Here you can check, by what time you mostly read, where you mostly read and how many pages you can read in an hour.",
                                    tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                                    },
                                    {
                                    position: 'center',
                                    title: '3. Reading Progress Charts',
                                    intro: "Here you can check the progress, that you're performed with certain books.",
                                    tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                                    },
                                    {
                                        position: 'center',
                                        title: '4. Speed of Reading & Productivity Charts',
                                        intro: "Here you can check, by what time you mostly read, where you mostly read and how many pages you can read in an hour.",
                                        tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                                    },
                                    {
                                        position: 'center',
                                        title: '5. Reading Preferences Charts',
                                        intro: "Here you can check, by what time you mostly read, where you mostly read and how many pages you can read in an hour.",
                                        tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                                    }
            
                                ] : isPathnameEqual('/profile/settings') ? [
                                        {
                                        position: 'center',
                                        title: '1. Settings',   
                                        intro: "If you'd like to change your account settings, you can do it here.",
                                        tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                                        },
                                        {
                                            position: 'center',
                                            title: '2. Change your privacy settings',
                                            intro: "If you'd like to change your privacy settings, you can do it here.",
                                            tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
                                        },
                                        {
                                        position: 'center',
                                        title: '3. Change your password',   
                                        intro: "If you'd like to change your account password, you can do it here.",
                                        tooltipClass: 'bg-dark-gray text-white rounded-lg min-w-72  max-w-sm w-full',
            }
        ] : [];

    return { steps };
 
}

export default useTourGuide