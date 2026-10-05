import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import '../styles/landing.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = {
  title: 'VhyxUI — accessible React components that AI agents understand',
  description:
    'React components with accessibility, motion tokens and built-in AI agent contracts. Works with plain CSS and Tailwind v3/v4.',
  metadataBase: new URL('https://vhyxui.com'),
  alternates: { canonical: '/' },
  openGraph: { title: 'VhyxUI', description: 'Accessible React components that AI agents understand.', url: 'https://vhyxui.com' },
};

// Applies a saved light theme before first paint (dark is the default).
// Also marks that scripts run, so scroll-reveal only hides content when it can reveal it again.
const THEME_SCRIPT = `document.documentElement.classList.add('js');try{if(localStorage.getItem('theme')==='light')document.documentElement.dataset.theme='light'}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${geist.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
