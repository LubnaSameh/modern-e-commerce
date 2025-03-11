'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode, useEffect, useState } from 'react';

interface AuthProviderProps {
    children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
    // We don't need to track mounting state here anymore since
    // we're handling this in the main Providers component
    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
} 