'use client';

import useSWR from 'swr';
import { fetcherWithCheck } from '../utils/fetcherWithCheck';

export default function useUser() {
    const { data, error, mutate } = useSWR(
      '/api/auth/me',
      fetcherWithCheck,
      {
        shouldRetryOnError: false, 
        revalidateOnFocus: true,     
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          if (error.response?.status === 401) return
          if (retryCount >= 3) return
          setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 2000)
        }
      }
    )
  
    return {
      user: data?.user,
      isLoading: !error && !data,
      isError: !!error,
      mutate,
    }
  }