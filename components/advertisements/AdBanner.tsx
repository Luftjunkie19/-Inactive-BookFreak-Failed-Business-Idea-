'use client';

import { useEffect } from 'react';



const AdBanner = (props) => {
  useEffect(() => {
    try {

        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      
      
      } catch (err) {
        console.log(err);
      }
    
  }, []);

  return (
    <ins
      className="adsbygoogle block overflow-hidden bg-dark-gray rounded-md w-full adbanner-customize py-2"
      data-ad-client="ca-pub-9822550861323688"
      data-ad-slot="3495164206"
      data-ad-format="auto"
      data-full-width-responsive="true"
      {...props}
    />
  );
};
export default AdBanner;