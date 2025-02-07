'use client';
import { SelectItem } from '@nextui-org/react'
import { User } from '@supabase/supabase-js'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from 'components/buttons/Button'
import SingleDropDown from 'components/drowdown/SingleDropDown'
import LabeledInput from 'components/input/LabeledInput'
import React from 'react'
import toast from 'react-hot-toast'

type Props = {
    setEditLinkObj: (obj: any) => void,
    user: User |null,
    editLinkObj: { socialMediaType: string, url: string, id: string, linkOwnerId: string, socialMediaName: string },
    linkContent: string,
    setSocialMediaName: (name: string) => void,
    socialMediaName: string,
    setLinkType: (type: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'spotify' | 'others' | undefined) => void,
    setLinkContent: (content: string) => void,
    linkType: 'facebook' | 'instagram' | 'twitter' | 'youtube' | 'spotify' | 'others',
}

function LinkForm({ editLinkObj, setEditLinkObj, linkContent, setSocialMediaName,user, setLinkType, socialMediaName, setLinkContent, linkType }: Props) {
          const queryClient = useQueryClient();


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


  return (
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
  )
}

export default LinkForm