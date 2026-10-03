'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { VhyxUIProvider } from '@vhyxui/react';

export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="dark"
      enableSystem={false}
    >
      <VhyxUIProvider toastPosition="bottom-right">{children}</VhyxUIProvider>
    </ThemeProvider>
  );
}
