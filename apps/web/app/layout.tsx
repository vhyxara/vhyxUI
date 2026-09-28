import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'VhyxUI — accessible React components that AI agents understand',
  description:
    'React components with accessibility, motion tokens and built-in AI agent contracts. Works with plain CSS and Tailwind v3/v4.',
  metadataBase: new URL('https://vhyxui.com'),
  openGraph: { title: 'VhyxUI', description: 'Accessible React components that AI agents understand.', url: 'https://vhyxui.com' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
