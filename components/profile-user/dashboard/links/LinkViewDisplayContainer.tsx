'use client';

import {  useQuery } from '@tanstack/react-query';

import { useAuthContext } from 'hooks/useAuthContext';
import React, { useState } from 'react'
import LinkForm from './LinkForm';
import LinksList from './LinksList';

type Props = {}

function LinkViewDisplayContainer({ }: Props) {
      const [socialMediaName, setSocialMediaName] = useState<string>();
      const [linkContent, setLinkContent] = useState<string>();
      const [editLinkObj, setEditLinkObj] = useState<{socialMediaType:string,url:string,id:string, linkOwnerId:string, socialMediaName:string}>();
      const [linkType, setLinkType] = useState < 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'spotify' | 'others'>();
      const { user } = useAuthContext();

      const { data } = useQuery({
        queryKey: ['userLinksDashboard', ], queryFn: () => fetch('/api/supabase/user/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: user!.id, include: {
              'recensions': { 'include': { 'book': true } },
              ReadingProgress: {
                'include': {
                  'book': true,
                  'user': true
                },
              },
              socialMediaLinks: true,
              'notifications': true,
            }
          }),
        }).then((res) => res.json()),
      });
    
  return (
        <div className="flex w-full max-w-6xl gap-4 flex-wrap justify-between items-center">
         <LinkForm editLinkObj={editLinkObj as any} user={user} setEditLinkObj={setEditLinkObj} socialMediaName={socialMediaName as string} setSocialMediaName={setSocialMediaName} linkContent={linkContent as string} setLinkContent={setLinkContent} linkType={linkType as any} setLinkType={setLinkType}  />
      
            {data &&  data.data &&
          <LinksList data={data} setEditLinkObj={setEditLinkObj} user={user}/>
            }
            </div>
  )
}

export default LinkViewDisplayContainer