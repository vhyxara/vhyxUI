'use client';

import React from 'react';
import { VhyxUIProvider } from '@vhyxui/react';

export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  return <VhyxUIProvider toastPosition="bottom-right">{children}</VhyxUIProvider>;
}
