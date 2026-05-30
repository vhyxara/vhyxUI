'use client';

import React from 'react';
import { SealProvider } from '@vhyxseal/react';
import { ToastProvider } from '../components/Toast/Toast';
import type { ToastPosition } from '../components/Toast/Toast';
import styles from './VhyxUIProvider.module.css';

/** Position of the Toast region on screen. Re-exported for consumer convenience. */
export type { ToastPosition } from '../components/Toast/Toast';

/** Props for VhyxUIProvider. */
export interface VhyxUIProviderProps {
  /** All application content. */
  children: React.ReactNode;
  /**
   * Position of the toast notification region.
   * Passed through to ToastProvider.
   * @default 'bottom-right'
   */
  toastPosition?: ToastPosition;
  /**
   * Maximum number of toasts shown simultaneously.
   * @default 5
   */
  maxToasts?: number;
  /**
   * Default duration in milliseconds before a toast auto-dismisses.
   * @default 4000
   */
  defaultDuration?: number;
}

/** Default SealProvider config — domain and verification set by the consuming application. */
const SEAL_CONFIG = {
  domain: '',
  domainVerified: false,
  verificationToken: '',
} as const;

/**
 * VhyxUIProvider — root provider for VhyxUI.
 *
 * Place once at the top of your application tree. Provides:
 * - SealProvider (VhyxSeal contract registry for agent API access)
 * - A visually hidden skip link as the first focusable element on every page.
 *   Becomes visible on keyboard focus, linking to `#vhyx-main`.
 * - The Toast notification region (imperative API via `toast()`).
 *
 * @example
 * <VhyxUIProvider>
 *   <main id="vhyx-main">
 *     <App />
 *   </main>
 * </VhyxUIProvider>
 */
export function VhyxUIProvider({
  children,
  toastPosition = 'bottom-right',
  maxToasts = 5,
  defaultDuration = 4000,
}: VhyxUIProviderProps): React.ReactElement {
  const dev = process.env['NODE_ENV'] !== 'production';

  return (
    <SealProvider config={SEAL_CONFIG} dev={dev}>
      {/* Skip link — first focusable element on every page. Visually hidden until focused. */}
      <a href="#vhyx-main" className={styles['skip-link']}>
        Skip to main content
      </a>

      <ToastProvider
        position={toastPosition}
        maxToasts={maxToasts}
        defaultDuration={defaultDuration}
      >
        {children}
      </ToastProvider>
    </SealProvider>
  );
}

VhyxUIProvider.displayName = 'VhyxUIProvider';
