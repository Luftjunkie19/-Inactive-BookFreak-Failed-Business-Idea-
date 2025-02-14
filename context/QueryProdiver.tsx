'use client';
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

type Props = { children: React.ReactNode }

function QueryProvider({ children }: Props) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
        refetchOnWindowFocus: false
      }
    }
  });
    

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    <ReactQueryDevtools/>
    </QueryClientProvider>
  )
}

export default QueryProvider