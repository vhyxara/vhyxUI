'use client';

import React from 'react';
import { VhyxUIProvider } from '@vhyxui/react';

/** Client boundary wrapper — VhyxUIProvider uses React hooks, must be client-side. */
export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  return <VhyxUIProvider toastPosition="bottom-right">{children}</VhyxUIProvider>;
}
