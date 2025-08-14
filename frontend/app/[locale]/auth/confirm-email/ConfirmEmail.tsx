'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfirmEmailComponent() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasConfirmed, setHasConfirmed] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
  
    if (!token || hasConfirmed) return;
  
    setHasConfirmed(true);
    confirmEmail(token);
  }, [hasConfirmed]);

  const confirmEmail = async (token: string) => {
    try {
      const response = await fetch('/api/auth/confirm-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        setErrorMessage(data.message || 'Ошибка при подтверждении email');
      }
    } catch (error) {
      setErrorMessage('Произошла ошибка при подтверждении');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <p>Загрузка...</p>
      ) : (
        <div>
          {errorMessage ? <p>{errorMessage}</p> : <p>Email подтвержден успешно!</p>}
        </div>
      )}
    </div>
  );
}