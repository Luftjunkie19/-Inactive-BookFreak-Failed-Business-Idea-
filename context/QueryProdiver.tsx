'use client';
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental'

type Props = { children: React.ReactNode }

function QueryProvider({ children }: Props) {
  const queryClient = new QueryClient(  );
    

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>

      {children}
    <ReactQueryDevtools/>
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  )
}

export default QueryProvider