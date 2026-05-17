import React from 'react';
import type { Metadata } from 'next';
import { Providers } from './providers';
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
    <html lang="en" data-theme="light">
      <body>
        <Providers>
          <main id="vhyx-main" className="docs-layout">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
