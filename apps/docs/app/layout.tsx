import React from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { DocsShell } from '../components/DocsShell';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'VhyxUI — Build with freedom. Ship with confidence.',
    template: '%s | VhyxUI',
  },
  description:
    'Headless React component library with four layers no other library ships together: visual, accessibility, motion, and AI agent contracts.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <DocsShell>{children}</DocsShell>
        </Providers>
      </body>
    </html>
  );
}
