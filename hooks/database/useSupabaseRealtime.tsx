
import { useQueryClient } from '@tanstack/react-query';
import { createClient } from 'lib/supabase/client';
import React, { useEffect } from 'react'

type Props = {
    tableName: string,
    queryKey: string,
    chatId:string
}

function useSupabaseRealtime({ 
    tableName,
    queryKey,
    chatId
}: Props) {
    
    const supabase = createClient();
    const queryClient = useQueryClient();

    useEffect(() => {
  const subscription = supabase
    .channel('messages')
      .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: tableName
     }, (payload) => {
          queryClient.setQueryData([
             queryKey,
              chatId
          
      ], (oldData) => ({
        ...oldData
      }));
    })
    .subscribe();

  return () => {
    supabase.removeChannel(subscription);
  };
}, [chatId]);



}

export default useSupabaseRealtime