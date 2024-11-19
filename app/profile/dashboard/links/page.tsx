'use client';
import { SelectItem, user } from '@nextui-org/react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Button from 'components/buttons/Button';
import SingleDropDown from 'components/drowdown/SingleDropDown'
import LabeledInput from 'components/input/LabeledInput'
import LinkListItem from 'components/links/LinkListItem';
import { useAuthContext } from 'hooks/useAuthContext';
import Link from 'next/link';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { FaFacebook } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { IoCloseCircle } from 'react-icons/io5';

type Props = {}

function Page({ }: Props) {
  const [socialMediaName, setSocialMediaName] = useState<string>();
  const [linkContent, setLinkContent] = useState<string>();
  const [editLinkObj, setEditLinkObj] = useState<{socialMediaType:string,url:string,id:string, linkOwnerId:string, socialMediaName:string}>();
  const [linkType, setLinkType] = useState < 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'spotify' | 'others'>();
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
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

  const { mutateAsync: insertNewLink } = useMutation({
    'mutationKey': ['userLinksDashboard'], 'mutationFn': async () => {
      console.log(linkContent, linkType, socialMediaName)
      if (linkContent && linkType && socialMediaName && linkContent.match(/\b(?:https?|ftp):\/\/(?:www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?\b/g)) {
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
                'create': {
                  'socialMediaType': linkType,
                  'url': linkContent,
                  socialMediaName: socialMediaName,
                }
              }
            }
          })
        });

        console.log(await res.json());
    
        toast.success('YEAH !');
      }
      else {
        toast.error('Invalid link');
      }

      setLinkContent('');
      setLinkType(undefined);
      setSocialMediaName('');
    }, 'onSuccess': async () => {
      await queryClient.refetchQueries({ 'queryKey': ['userLinksDashboard'], 'type': 'active' })
    }
  });

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

  const { mutateAsync: updateLink } = useMutation({
    'mutationKey': ['userLinksDashboard'],
    'mutationFn': async (data: any) => {
      if (user && editLinkObj) {    
        const res =  await fetch('/api/supabase/user/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              where: {
                id: user.id,
              },
              data: {
                socialMediaLinks: {
                  update: {
                    where: {
                      id: editLinkObj?.id,
                    },
                    data: {
                      socialMediaType: editLinkObj.socialMediaType,
                      socialMediaName: editLinkObj.socialMediaName,
                      url: editLinkObj.url
                    }
                  }
                }
              }
            })
        });
          const { data:linkData, error } = await res.json();
          if (error) {
            toast.error('Update not successfull !');
            console.log(error);
            return;
          }
          toast.success('Successfully edited !');
          setEditLinkObj(undefined);
    }
    }
  });


  return (
    <div className='w-full sm:h-[calc(100vh-3.5rem)] overflow-y-auto lg:h-[calc(100vh-4rem)] flex flex-col gap-3 p-2'>
      <div className="">
      <p className='text-white text-2xl'>Your Links</p>
       <p className='text-gray-400 text-sm'>In this page, you can link to any outside social-media you would like to.</p>
      </div>

      <div className="flex w-full max-w-6xl gap-4 flex-wrap justify-between items-center">
      <div className="flex flex-col gap-2 max-w-sm w-full">
          <LabeledInput value={editLinkObj?.socialMediaName ?? socialMediaName} onChange={(e) => {
            if (editLinkObj) {
                 setEditLinkObj((obj: any) => ({ ...obj, 'socialMediaName': e.target.value }))
            } else {
              setSocialMediaName(e.target.value)
            }
        }} type='dark' additionalClasses='max-w-xs w-full p-2' label='Link Name'  />
        
          <LabeledInput value={editLinkObj?.url ?? linkContent} onChange={(e) => {
            if (editLinkObj) {
              setEditLinkObj((obj: any) => ({ ...obj, 'url': e.target.value }))
              
            } else {
              setLinkContent(e.target.value);
            }
          }} type='dark' additionalClasses='max-w-xs w-full p-2' label='Link URL' />

        <SingleDropDown value={editLinkObj?.socialMediaType ?? linkType} onChange={(e) => {
          console.log(e.target.value); 
            if (editLinkObj) { 
              setEditLinkObj((obj: any) => ({ ...obj, 'socialMediaType': e.target.value }));
            } else {
            setLinkType(e.target.value as any);
         }
        }} label='Link Type'>
            <SelectItem value={'facebook'} key={'facebook'}>Facebook</SelectItem>
            <SelectItem value={'tiktok'} key={'tiktok'}>Titkok</SelectItem>
        <SelectItem value={'instagram'} key={'instagram'}>Instagram</SelectItem>
        <SelectItem value={'twitter'} key={'twitter'}>Twitter/X</SelectItem>
        <SelectItem value={'spotify'} key={'spotify'}>Spotify</SelectItem>
         <SelectItem value={'others'} key={'others'}>Others</SelectItem>
        </SingleDropDown>
        
          <Button onClick={() => {
            if (editLinkObj) {
              updateLink(editLinkObj);
            } else {
              insertNewLink();
            }
        }} additionalClasses='w-fit px-3' type='blue'>Append</Button>
</div>

      {data &&  data.data &&
      <div className="flex flex-col w-full max-w-sm gap-1">
        <p className='text-xl text-white'>{data.data.socialMediaLinks.length} Links, you added to your profile</p>
        <div className="max-w-sm w-full h-64 flex flex-col gap-2 rounded-lg bg-dark-gray overflow-y-auto">
          {data.data.socialMediaLinks.map((item)=>(<LinkListItem selectEditLink={setEditLinkObj} deleteLink={deleteLink}  key={item.id} linkData={item} />))}
      </div>
      </div>
      }
      </div>

    </div>
  )
}

export default Page