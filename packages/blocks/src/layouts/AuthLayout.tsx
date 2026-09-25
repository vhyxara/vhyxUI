import React from 'react';
import { Stack, Text } from '@vhyxui/react';
import styles from './layouts.module.css';

/** Props for AuthLayout. */
export interface AuthLayoutProps {
  children: React.ReactNode;
  /** Logo shown above the form. */
  brand?: React.ReactNode;
  /** `split` adds a branded side panel on large screens. @default 'centered' */
  variant?: 'centered' | 'split';
  /** Side panel content for `split` (quote, product shot…). */
  aside?: React.ReactNode;
  /** Small print under the form (terms, privacy). */
  footer?: React.ReactNode;
}

/**
 * AuthLayout — full-height sign-in / sign-up page.
 * @example
 * <AuthLayout brand={<Logo/>} variant="split" aside={<Quote/>}>
 *   <AuthForm onSubmit={signIn} />
 * </AuthLayout>
 */
export function AuthLayout({ children, brand, variant = 'centered', aside, footer }: AuthLayoutProps): React.ReactElement {
  return (
    <div className={styles['auth']} data-variant={variant}>
      <main id="vhyx-main" className={styles['authPanel']}>
        {brand && <div>{brand}</div>}
        {children}
        {footer && <Text size="xs" tone="muted" align="center">{footer}</Text>}
      </main>
      {variant === 'split' && (
        <aside className={styles['authAside']} aria-hidden={aside ? undefined : true}>
          <Stack gap={2}>{brand}</Stack>
          <div>{aside}</div>
        </aside>
      )}
    </div>
  );
}
