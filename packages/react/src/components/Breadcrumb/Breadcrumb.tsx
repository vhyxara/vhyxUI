'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { breadcrumbContract } from '@vhyxui/core';
import { VhyxUIError, VhyxUIErrorCode } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import { Slot } from '../shared/Slot';
import { useId } from '../shared/useId';
import styles from './Breadcrumb.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface BreadcrumbContextValue {
  separator: React.ReactNode;
}

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

function useBreadcrumbContext(componentName: string): BreadcrumbContextValue {
  const ctx = useContext(BreadcrumbContext);
  if (!ctx) {
    throw new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_MISSING_CONTEXT,
      message: `${componentName} must be used within <Breadcrumb>`,
      suggestion: 'Wrap your component tree with <Breadcrumb>',
    });
  }
  return ctx;
}

// ─── Breadcrumb Root ──────────────────────────────────────────────────────────

/** Root props for the Breadcrumb compound component. */
export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * Separator element rendered between items. Defaults to "/" (aria-hidden).
   */
  separator?: React.ReactNode;
  /**
   * When set, collapses the middle items with an ellipsis when
   * the item count exceeds this number. Not yet implemented — reserved.
   */
  maxItems?: number;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
  children?: React.ReactNode;
}

/**
 * Breadcrumb — navigation landmark showing the current page hierarchy.
 *
 * Sub-components: Breadcrumb.Item, Breadcrumb.Link, Breadcrumb.Page, Breadcrumb.Ellipsis.
 * Breadcrumb.Page gets aria-current="page" — it is NOT a link.
 * Separator defaults to "/" and is always aria-hidden.
 *
 * @example
 * <Breadcrumb>
 *   <Breadcrumb.Item><Breadcrumb.Link href="/">Home</Breadcrumb.Link></Breadcrumb.Item>
 *   <Breadcrumb.Item><Breadcrumb.Link href="/products">Products</Breadcrumb.Link></Breadcrumb.Item>
 *   <Breadcrumb.Item><Breadcrumb.Page>Widget X</Breadcrumb.Page></Breadcrumb.Item>
 * </Breadcrumb>
 */
const BreadcrumbRoot = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      separator = '/',
      maxItems: _maxItems,
      contract,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const breadcrumbId = useId('vhyx-breadcrumb');

    const effectiveContract: Partial<ComponentContract> = useMemo(
      () => ({ ...breadcrumbContract, id: breadcrumbId, ...contract }),
      [breadcrumbId, contract],
    );

    const ctx = useMemo<BreadcrumbContextValue>(
      () => ({ separator }),
      [separator],
    );

    const navClass = [styles['nav'], className].filter(Boolean).join(' ');

    return (
      <BreadcrumbContext.Provider value={ctx}>
        <nav
          ref={ref}
          aria-label="Breadcrumb"
          className={navClass}
          data-vhyx-contract={JSON.stringify(effectiveContract)}
          {...rest}
        >
          <ol className={styles['list']}>{children}</ol>
        </nav>
      </BreadcrumbContext.Provider>
    );
  },
);

BreadcrumbRoot.displayName = 'VhyxBreadcrumb';

// ─── Breadcrumb.Item ──────────────────────────────────────────────────────────

export interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children?: React.ReactNode;
}

/**
 * A single item in the breadcrumb list.
 * Renders as an `<li>` with the separator automatically appended.
 */
function BreadcrumbItem({ children, className, ...rest }: BreadcrumbItemProps): React.ReactElement {
  const ctx = useBreadcrumbContext('Breadcrumb.Item');
  const itemClass = [styles['item'], className].filter(Boolean).join(' ');

  return (
    <li className={itemClass} {...rest}>
      {children}
      <span className={styles['separator']} aria-hidden="true">
        {ctx.separator}
      </span>
    </li>
  );
}

BreadcrumbItem.displayName = 'VhyxBreadcrumbItem';

// ─── Breadcrumb.Link ──────────────────────────────────────────────────────────

export interface BreadcrumbLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * When true, renders as the child element via Slot instead of <a>.
   * Use with Next.js Link or other routing components.
   */
  asChild?: boolean;
  children?: React.ReactNode;
}

/** An ancestor page link in the breadcrumb trail. */
function BreadcrumbLink({ children, className, asChild = false, ...rest }: BreadcrumbLinkProps): React.ReactElement {
  const linkClass = [styles['link'], className].filter(Boolean).join(' ');

  if (asChild) {
    return (
      <Slot className={linkClass} {...rest}>
        {children}
      </Slot>
    );
  }

  return (
    <a className={linkClass} {...rest}>
      {children}
    </a>
  );
}

BreadcrumbLink.displayName = 'VhyxBreadcrumbLink';

// ─── Breadcrumb.Page ──────────────────────────────────────────────────────────

export interface BreadcrumbPageProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

/**
 * The current page in the breadcrumb hierarchy.
 * Not a link — receives aria-current="page".
 */
function BreadcrumbPage({ children, className, ...rest }: BreadcrumbPageProps): React.ReactElement {
  const pageClass = [styles['page'], className].filter(Boolean).join(' ');
  return (
    <span aria-current="page" className={pageClass} {...rest}>
      {children}
    </span>
  );
}

BreadcrumbPage.displayName = 'VhyxBreadcrumbPage';

// ─── Breadcrumb.Ellipsis ──────────────────────────────────────────────────────

export interface BreadcrumbEllipsisProps extends React.HTMLAttributes<HTMLSpanElement> {}

/** Collapsed items indicator — rendered when maxItems is exceeded. */
function BreadcrumbEllipsis({ className, ...rest }: BreadcrumbEllipsisProps): React.ReactElement {
  const ellipsisClass = [styles['ellipsis'], className].filter(Boolean).join(' ');
  return (
    <span aria-hidden="true" className={ellipsisClass} {...rest}>
      &hellip;
    </span>
  );
}

BreadcrumbEllipsis.displayName = 'VhyxBreadcrumbEllipsis';

// ─── Compound export ──────────────────────────────────────────────────────────

/** Breadcrumb — navigation compound component. */
// Library-level contract for SealContext registration; per-instance ids set via DOM attribute.
const breadcrumbSealContract = { ...breadcrumbContract, id: 'vhyxui-breadcrumb' } as Readonly<ComponentContract>;

export const Breadcrumb = Object.assign(
  withAgentContract(BreadcrumbRoot, breadcrumbSealContract),
  {
    Item: BreadcrumbItem,
    Link: BreadcrumbLink,
    Page: BreadcrumbPage,
    Ellipsis: BreadcrumbEllipsis,
  },
);
Breadcrumb.displayName = 'VhyxBreadcrumb';
