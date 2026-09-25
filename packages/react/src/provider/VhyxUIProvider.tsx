'use client';

import React, { useEffect } from 'react';
import { SealProvider } from '@vhyxseal/react';
import { ToastProvider } from '../components/Toast/Toast';
import type { ToastPosition } from '../components/Toast/Toast';
import { isDev, readPublicEnv } from '../components/shared/env';
import styles from './VhyxUIProvider.module.css';

/** Position of the Toast region on screen. Re-exported for consumer convenience. */
export type { ToastPosition } from '../components/Toast/Toast';

/** Colour scheme applied to `<html data-theme>`. `system` follows the OS. */
export type VhyxTheme = 'light' | 'dark' | 'system';

/** Props for VhyxUIProvider. */
export interface VhyxUIProviderProps {
  /** All application content. */
  children: React.ReactNode;
  /**
   * Position of the toast notification region.
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
  /**
   * Domain for VhyxSeal manifest generation.
   * Resolution order: this prop → NEXT_PUBLIC_VHYX_DOMAIN → VITE_VHYX_DOMAIN →
   * `window.location.hostname` → `"localhost"`. Never empty, so the manifest
   * generator never fails on a missing domain.
   * @example "myshop.platform.com"
   */
  domain?: string;
  /**
   * Optional colour scheme. When set, the provider writes `data-theme` on
   * `<html>` (and follows the OS for `system`). Leave undefined when another
   * library (next-themes, your own toggle) already owns `data-theme`.
   */
  theme?: VhyxTheme;
  /**
   * Register components with VhyxSeal so AI agents can read their contracts.
   * Set to false to opt out entirely (no SealProvider in the tree).
   * @default true
   */
  agentContracts?: boolean;
  /**
   * Render the "Skip to main content" link targeting `#vhyx-main`.
   * @default true
   */
  skipLink?: boolean;
}

/**
 * Resolves the VhyxSeal manifest domain without ever returning an empty string.
 * An empty domain makes `generateManifest()` throw a fatal error on every render.
 */
export function resolveSealDomain(domain?: string): string {
  if (domain && domain.trim().length > 0) return domain.trim();
  const fromEnv = readPublicEnv('NEXT_PUBLIC_VHYX_DOMAIN') ?? readPublicEnv('VITE_VHYX_DOMAIN');
  if (fromEnv) return fromEnv;
  if (typeof window !== 'undefined' && window.location.hostname) return window.location.hostname;
  return 'localhost';
}

function useDocumentTheme(theme: VhyxTheme | undefined): void {
  useEffect(() => {
    if (theme === undefined || typeof document === 'undefined') return undefined;
    const root = document.documentElement;
    if (theme !== 'system') {
      root.setAttribute('data-theme', theme);
      return undefined;
    }
    if (typeof window.matchMedia !== 'function') {
      root.setAttribute('data-theme', 'light');
      return undefined;
    }
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = (): void => root.setAttribute('data-theme', query.matches ? 'dark' : 'light');
    apply();
    query.addEventListener('change', apply);
    return () => query.removeEventListener('change', apply);
  }, [theme]);
}

/**
 * VhyxUIProvider — root provider for VhyxUI.
 *
 * Place once at the top of your application tree. Provides:
 * - SealProvider (VhyxSeal contract registry for agent API access), opt-out via `agentContracts={false}`
 * - A visually hidden skip link as the first focusable element, linking to `#vhyx-main`
 * - The Toast notification region (imperative API via `toast()`)
 * - Optional theme management via `theme="light" | "dark" | "system"`
 *
 * @example
 * <VhyxUIProvider theme="system">
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
  domain,
  theme,
  agentContracts = true,
  skipLink = true,
}: VhyxUIProviderProps): React.ReactElement {
  useDocumentTheme(theme);

  const content = (
    <>
      {skipLink && (
        <a href="#vhyx-main" className={styles['skip-link']}>
          Skip to main content
        </a>
      )}
      <ToastProvider position={toastPosition} maxToasts={maxToasts} defaultDuration={defaultDuration}>
        {children}
      </ToastProvider>
    </>
  );

  if (!agentContracts) return content;

  return (
    <SealProvider
      config={{ domain: resolveSealDomain(domain), domainVerified: false, verificationToken: '' }}
      dev={isDev()}
    >
      {content}
    </SealProvider>
  );
}

VhyxUIProvider.displayName = 'VhyxUIProvider';
