'use client';

import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { accordionContract } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import { cx } from '../../utils/cx';
import { useId } from '../shared/useId';
import styles from './Accordion.module.css';

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string, open: boolean) => void;
  name: string | undefined;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

/** One entry for the data-driven `items` shorthand. */
export interface AccordionItemData {
  value: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

/** Props for Accordion. */
export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
  /** `single` keeps at most one section open. @default 'single' */
  type?: 'single' | 'multiple';
  /** Initially open section values (uncontrolled). */
  defaultValue?: string[];
  /** Open section values (controlled). */
  value?: string[];
  /** Called with the next list of open values. */
  onValueChange?: (value: string[]) => void;
  /** `ghost` removes the outer border. @default 'default' */
  variant?: 'default' | 'ghost';
  /** Shorthand: render items from data instead of children. */
  items?: AccordionItemData[];
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
}

/**
 * Accordion — built on native `<details>/<summary>`, so it is keyboard and
 * screen-reader accessible and works before hydration.
 *
 * @example
 * <Accordion items={[{ value: 'a', title: 'What is VhyxUI?', content: 'A React library…' }]} />
 *
 * @example
 * <Accordion type="multiple" defaultValue={['a']}>
 *   <Accordion.Item value="a" title="Shipping">Free over $50.</Accordion.Item>
 * </Accordion>
 */
const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    { type = 'single', defaultValue = [], value, onValueChange, variant = 'default', items, contract, className, children, ...rest },
    ref,
  ) => {
    const [internal, setInternal] = useState<string[]>(defaultValue);
    const open = value ?? internal;
    const groupName = useId('vhyx-accordion');

    const toggle = useCallback(
      (itemValue: string, nextOpen: boolean) => {
        const already = open.includes(itemValue);
        if (already === nextOpen) return;
        const next = nextOpen
          ? type === 'single' ? [itemValue] : [...open, itemValue]
          : open.filter((v) => v !== itemValue);
        if (value === undefined) setInternal(next);
        onValueChange?.(next);
      },
      [open, type, value, onValueChange],
    );

    const ctx = useMemo<AccordionContextValue>(
      () => ({ isOpen: (v) => open.includes(v), toggle, name: type === 'single' ? groupName : undefined }),
      [open, toggle, type, groupName],
    );

    return (
      <AccordionContext.Provider value={ctx}>
        <div
          ref={ref}
          className={cx(styles['accordion'], className)}
          data-variant={variant}
          data-vhyx-contract={contract ? JSON.stringify({ ...accordionContract, ...contract }) : undefined}
          {...rest}
        >
          {items
            ? items.map((item) => (
                <AccordionItem key={item.value} value={item.value} title={item.title} disabled={item.disabled ?? false}>
                  {item.content}
                </AccordionItem>
              ))
            : children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
AccordionRoot.displayName = 'VhyxAccordion';

/** Props for Accordion.Item. */
export interface AccordionItemProps extends Omit<React.DetailsHTMLAttributes<HTMLDetailsElement>, 'title' | 'open'> {
  /** Unique value within the accordion. */
  value: string;
  /** Header content. */
  title: React.ReactNode;
  disabled?: boolean;
}

/** A single collapsible section. */
const AccordionItem = React.forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ value, title, disabled = false, className, children, onToggle, ...rest }, ref) => {
    const ctx = useContext(AccordionContext);
    const isOpen = ctx?.isOpen(value) ?? false;
    return (
      <details
        ref={ref}
        className={cx(styles['item'], className)}
        open={isOpen}
        name={ctx?.name}
        data-disabled={disabled ? 'true' : undefined}
        onToggle={(event) => {
          ctx?.toggle(value, event.currentTarget.open);
          onToggle?.(event);
        }}
        {...rest}
      >
        <summary
          className={styles['trigger']}
          aria-disabled={disabled ? true : undefined}
          tabIndex={disabled ? -1 : undefined}
          onClick={disabled ? (e) => e.preventDefault() : undefined}
        >
          <span>{title}</span>
          <svg className={styles['chevron']} viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </summary>
        <div className={styles['content']}>{children}</div>
      </details>
    );
  },
);
AccordionItem.displayName = 'VhyxAccordionItem';

const accordionSealContract = { ...accordionContract, id: 'vhyxui-accordion' } as Readonly<ComponentContract>;

type AccordionComponent = React.ForwardRefExoticComponent<AccordionProps & React.RefAttributes<HTMLDivElement>> & {
  Item: typeof AccordionItem;
};

// withAgentContract preserves props and forwards refs; the static Item is attached below.
export const Accordion = Object.assign(withAgentContract(AccordionRoot, accordionSealContract), {
  Item: AccordionItem,
}) as AccordionComponent;
