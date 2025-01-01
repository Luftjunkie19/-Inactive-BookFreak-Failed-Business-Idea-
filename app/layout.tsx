
import './globals.css';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../stylings/tourguide.css';
import "primereact/resources/themes/lara-dark-blue/theme.css";
import 'primereact/resources/primereact.min.css';

import 'intro.js/introjs.css';


import GoogleAdsense from 'adsense/GoogleAdsense';
import AuthContextProvider from 'context/AuthContext';
import ReduxProvider from 'context/ReduxProvider';
import { Providers } from 'lib/NextUiProvider';
import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';

import Navbar from '../components/Navbar/Navbar';
import Footer from 'components/Footer';
import { PrimeReact } from 'lib/PrimeReact';
import LeftBar from '../components/Sidebars/left/LeftBar';
import DefaultRightBar from 'components/Sidebars/right/DefaultRightBar';
import Script from 'next/script';
import AdvertisementBar from 'components/Sidebars/right/AdvertisementBar';
import QueryProvider from 'context/QueryProdiver';

// const poppins = Poppins({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BookFreak",
  description: "BookFreak",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9822550861323688"
     crossOrigin="anonymous"/>
        <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
     crossOrigin="anonymous" />
         <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <Script async src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}`}
          strategy="afterInteractive"
          crossOrigin="anonymous" />
        <link rel="icon" href="/Logo.png" sizes="any" />
      </head>
      <body className={`bg-secondary-color overflow-y-hidden w-full `}>
        <AuthContextProvider>
          <ReduxProvider>
       
          <QueryProvider>
            <Providers>
              <PrimeReact>
                <Navbar />
              <Toaster />
                <div className="flex w-full h-full">
                  <LeftBar />
                  <div className="w-full  overflow-x-hidden max-h-screen h-full">
              {children}
                <Footer />
   </div>
                  <DefaultRightBar />
                  <AdvertisementBar/>
                </div>
                </PrimeReact>
              </Providers>
            </QueryProvider>
    
            </ReduxProvider>
        </AuthContextProvider>
      </body>
      <GoogleAdsense pId={process.env.NEXT_PUBLIC_ADSENSE_ID as string} />
    </html>
  );
}
