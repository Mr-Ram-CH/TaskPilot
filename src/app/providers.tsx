'use client';
import { UserProvider } from '@/context/user-provider';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}
