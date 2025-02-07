'use client';

import { User } from '@supabase/supabase-js';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import LinkListItem from 'components/links/LinkListItem'
import React from 'react'
import toast from 'react-hot-toast';

type Props = {data:{data:any | null, error: any | null}, setEditLinkObj: (obj: any) => void, user:User | null}

function LinksList({data, setEditLinkObj, user}: Props) {
  const queryClient = useQueryClient();
      const { mutateAsync: deleteLink } = useMutation({
        'mutationKey': ['userLinksDashboard'],
        'mutationFn': async (linkId: string) => {
          if (linkId) {
            const res = await fetch('/api/supabase/user/update', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                where: {
                  id: user!.id,
                },
                data: {
                  socialMediaLinks: {
                    delete: { id: linkId }
                  }
                }
              })
            });
            const { data, error } = await res.json();
            if (error) {
              toast.error('Link deletion not successful !');
              return;
            }
            toast.success('Link deleted !');
          }
        },
        'onSuccess': async () => {
          await queryClient.refetchQueries({ 'queryKey': ['userLinksDashboard'], 'type': 'active' });
        }
      });
    


  return (
       <div className="flex flex-col w-full max-w-sm gap-1">
              <p className='text-xl text-white'>{data.data.socialMediaLinks.length} Links, you added to your profile</p>
              <div className="max-w-sm w-full h-64 flex flex-col gap-2 rounded-lg bg-dark-gray overflow-y-auto">
                {data.data.socialMediaLinks.map((item)=>(<LinkListItem selectEditLink={setEditLinkObj} deleteLink={deleteLink}  key={item.id} linkData={item} />))}
            </div>
            </div>
  )
}

export default LinksList