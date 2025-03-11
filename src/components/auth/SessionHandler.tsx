'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function SessionHandler() {
  const { data: session, status, update } = useSession();
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    console.log("Session Handler: Updating auth state, status:", status);

    if (status === 'authenticated' && session?.user) {
      localStorage.setItem('user-logged-in', 'true');

      if (session.user.name) {
        localStorage.setItem('user-name', session.user.name);
      }
      if (session.user.email) {
        localStorage.setItem('user-email', session.user.email);
      }
    }
  }, [status, session, update]);

  // This component doesn't render anything visible
  return null;
} 