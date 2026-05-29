import React from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'VhyxUI Playground — Interactive Component Explorer',
    template: '%s — VhyxUI Playground',
  },
  description: 'Explore VhyxUI components interactively. Adjust props, see generated code, inspect VhyxSeal contracts, and preview CSS tokens — live.',
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
