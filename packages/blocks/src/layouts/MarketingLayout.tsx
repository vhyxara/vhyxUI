import React from 'react';
import { Navbar, type NavbarProps } from '../blocks/Navbar';
import { Footer, type FooterProps } from '../blocks/Footer';
import styles from './layouts.module.css';

/** Props for MarketingLayout. */
export interface MarketingLayoutProps {
  navbar: NavbarProps;
  footer?: FooterProps;
  children: React.ReactNode;
}

/**
 * MarketingLayout — Navbar + page sections + Footer, with the footer pinned to the bottom.
 * @example
 * <MarketingLayout navbar={{ brand: 'Acme', links }} footer={{ legal: '© Acme' }}>
 *   <Hero … /><FeatureGrid … /><PricingTable … />
 * </MarketingLayout>
 */
export function MarketingLayout({ navbar, footer, children }: MarketingLayoutProps): React.ReactElement {
  return (
    <div className={styles['page']}>
      <Navbar {...navbar} />
      <main id="vhyx-main" className={styles['pageMain']}>{children}</main>
      {footer && <Footer {...footer} {...(navbar.linkAs && !footer.linkAs ? { linkAs: navbar.linkAs } : {})} />}
    </div>
  );
}
