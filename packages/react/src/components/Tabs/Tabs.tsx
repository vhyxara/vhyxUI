'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { tabsContract } from '@vhyxui/core';
import { VhyxUIError, VhyxUIErrorCode } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import { Slot } from '../shared/Slot';
import { useId } from '../shared/useId';
import styles from './Tabs.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface TabsContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  orientation: 'horizontal' | 'vertical';
  variant: 'default' | 'pills' | 'underline' | 'enclosed';
  size: 'sm' | 'md' | 'lg';
  tabsId: string;
  triggerOrderRef: React.MutableRefObject<string[]>;
  triggerElementsRef: React.MutableRefObject<Map<string, HTMLButtonElement>>;
  registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
  navigateTab: (currentValue: string, direction: 'next' | 'prev' | 'first' | 'last') => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext(componentName: string): TabsContextValue {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_MISSING_CONTEXT,
      message: `${componentName} must be used within <Tabs>`,
      suggestion: 'Wrap your component tree with <Tabs>',
    });
  }
  return ctx;
}

// ─── Tabs Root ────────────────────────────────────────────────────────────────

/** Variant visual styles for Tabs. */
export type TabsVariant = 'default' | 'pills' | 'underline' | 'enclosed';

/** Size tokens for Tabs. */
export type TabsSize = 'sm' | 'md' | 'lg';

/** Root props for the Tabs compound component. */
export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled active tab value. */
  value?: string;
  /** Default active tab value for uncontrolled mode. */
  defaultValue?: string;
  /** Called when the active tab changes. */
  onValueChange?: (value: string) => void;
  /** Layout direction of the tab list. @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Visual variant of the tab list. @default 'default' */
  variant?: TabsVariant;
  /** Size of the tabs. @default 'md' */
  size?: TabsSize;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
}

/**
 * Tabs — compound component for tabbed content navigation.
 *
 * Sub-components: Tabs.List, Tabs.Trigger, Tabs.Content.
 * Arrow key navigation. Sliding indicator via CSS transform.
 *
 * @example
 * <Tabs defaultValue="tab1">
 *   <Tabs.List>
 *     <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
 *     <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
 *   </Tabs.List>
 *   <Tabs.Content value="tab1">Content 1</Tabs.Content>
 *   <Tabs.Content value="tab2">Content 2</Tabs.Content>
 * </Tabs>
 */
const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      orientation = 'horizontal',
      variant = 'default',
      size = 'md',
      contract,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const tabsId = useId('vhyx-tabs');

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
    const currentValue = isControlled ? value : internalValue;

    const triggerOrderRef = useRef<string[]>([]);
    const triggerElementsRef = useRef<Map<string, HTMLButtonElement>>(new Map());

    const registerTrigger = useCallback(
      (triggerValue: string, el: HTMLButtonElement | null) => {
        if (el) {
          if (!triggerOrderRef.current.includes(triggerValue)) {
            triggerOrderRef.current.push(triggerValue);
          }
          triggerElementsRef.current.set(triggerValue, el);
        } else {
          triggerElementsRef.current.delete(triggerValue);
          triggerOrderRef.current = triggerOrderRef.current.filter((v) => v !== triggerValue);
        }
      },
      [],
    );

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (!isControlled) setInternalValue(newValue);
        onValueChange?.(newValue);
      },
      [isControlled, onValueChange],
    );

    const navigateTab = useCallback(
      (currentTabValue: string, direction: 'next' | 'prev' | 'first' | 'last') => {
        const order = triggerOrderRef.current;
        if (order.length === 0) return;

        let nextValue: string | undefined;
        if (direction === 'first') {
          nextValue = order[0];
        } else if (direction === 'last') {
          nextValue = order[order.length - 1];
        } else {
          const idx = order.indexOf(currentTabValue);
          if (direction === 'next') {
            nextValue = order[(idx + 1) % order.length];
          } else {
            nextValue = order[(idx - 1 + order.length) % order.length];
          }
        }

        if (nextValue !== undefined) {
          handleValueChange(nextValue);
          triggerElementsRef.current.get(nextValue)?.focus();
        }
      },
      [handleValueChange],
    );

    const effectiveContract: Partial<ComponentContract> = useMemo(
      () => ({ ...tabsContract, id: tabsId, ...contract }),
      [tabsId, contract],
    );

    const ctx = useMemo<TabsContextValue>(
      () => ({
        value: currentValue,
        onValueChange: handleValueChange,
        orientation,
        variant,
        size,
        tabsId,
        triggerOrderRef,
        triggerElementsRef,
        registerTrigger,
        navigateTab,
      }),
      [
        currentValue,
        handleValueChange,
        orientation,
        variant,
        size,
        tabsId,
        registerTrigger,
        navigateTab,
      ],
    );

    const rootClass = [styles['root'], className].filter(Boolean).join(' ');

    return (
      <TabsContext.Provider value={ctx}>
        <div
          ref={ref}
          className={rootClass}
          data-orientation={orientation}
          data-variant={variant}
          data-size={size}
          data-vhyx-contract={JSON.stringify(effectiveContract)}
          {...rest}
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  },
);

TabsRoot.displayName = 'VhyxTabs';

// ─── Tabs.List ────────────────────────────────────────────────────────────────

export interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/**
 * The container for Tabs.Trigger elements.
 * Renders the sliding indicator that highlights the active tab.
 */
const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className, ...rest }, ref) => {
    const ctx = useTabsContext('Tabs.List');
    const listRef = useRef<HTMLDivElement | null>(null);
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        listRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    // Update indicator position when active tab changes
    useEffect(() => {
      if (!ctx.value || !listRef.current) return;
      const activeTrigger = ctx.triggerElementsRef.current.get(ctx.value);
      if (!activeTrigger) return;

      if (ctx.orientation === 'horizontal') {
        setIndicatorStyle({
          width: activeTrigger.offsetWidth,
          transform: `translateX(${activeTrigger.offsetLeft}px)`,
        });
      } else {
        setIndicatorStyle({
          height: activeTrigger.offsetHeight,
          transform: `translateY(${activeTrigger.offsetTop}px)`,
        });
      }
    }, [ctx.value, ctx.orientation, ctx.triggerElementsRef]);

    const listClass = [styles['list'], className].filter(Boolean).join(' ');

    return (
      <div
        ref={setRef}
        role="tablist"
        aria-orientation={ctx.orientation}
        className={listClass}
        data-variant={ctx.variant}
        data-orientation={ctx.orientation}
        {...rest}
      >
        {children}
        <span
          className={styles['indicator']}
          data-orientation={ctx.orientation}
          aria-hidden="true"
          style={indicatorStyle}
        />
      </div>
    );
  },
);

TabsList.displayName = 'VhyxTabsList';

// ─── Tabs.Trigger ─────────────────────────────────────────────────────────────

export interface TabsTriggerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** The value this trigger activates. */
  value: string;
  /** When true, renders as the child element via Slot instead of <button>. */
  asChild?: boolean;
  children?: React.ReactNode;
}

/** A tab button inside Tabs.List. */
const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value, children, className, onClick, onKeyDown, disabled, asChild = false, ...rest }, ref) => {
    const ctx = useTabsContext('Tabs.Trigger');
    const isActive = ctx.value === value;

    const panelId = `${ctx.tabsId}-panel-${value}`;
    const triggerId = `${ctx.tabsId}-trigger-${value}`;

    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        ctx.registerTrigger(value, node);
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref, ctx, value],
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (!disabled) ctx.onValueChange(value);
      },
      [onClick, disabled, ctx, value],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);

        const isHorizontal = ctx.orientation === 'horizontal';

        if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowDown')) {
          e.preventDefault();
          ctx.navigateTab(value, 'next');
        } else if (
          (isHorizontal && e.key === 'ArrowLeft') ||
          (!isHorizontal && e.key === 'ArrowUp')
        ) {
          e.preventDefault();
          ctx.navigateTab(value, 'prev');
        } else if (e.key === 'Home') {
          e.preventDefault();
          ctx.navigateTab(value, 'first');
        } else if (e.key === 'End') {
          e.preventDefault();
          ctx.navigateTab(value, 'last');
        }
      },
      [onKeyDown, ctx, value],
    );

    const triggerClass = [styles['trigger'], className].filter(Boolean).join(' ');

    const triggerProps = {
      id: triggerId,
      role: 'tab' as const,
      'aria-selected': isActive,
      'aria-controls': panelId,
      disabled,
      tabIndex: isActive ? 0 : -1,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      className: triggerClass,
      'data-state': isActive ? 'active' : 'inactive',
      'data-size': ctx.size,
      ...rest,
    };

    if (asChild) {
      return (
        <Slot ref={setRef as React.Ref<HTMLElement>} {...triggerProps}>
          {children}
        </Slot>
      );
    }

    return (
      <button ref={setRef} type="button" {...triggerProps}>
        {children}
      </button>
    );
  },
);

TabsTrigger.displayName = 'VhyxTabsTrigger';

// ─── Tabs.Content ─────────────────────────────────────────────────────────────

export interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The value that activates this panel. */
  value: string;
  children?: React.ReactNode;
}

/** The content panel for a tab. Rendered only when its value is active. */
function TabsContent({ value, children, className, ...rest }: TabsContentProps): React.ReactElement | null {
  const ctx = useTabsContext('Tabs.Content');
  const isActive = ctx.value === value;

  const panelId = `${ctx.tabsId}-panel-${value}`;
  const triggerId = `${ctx.tabsId}-trigger-${value}`;

  if (!isActive) return null;

  const panelClass = [styles['panel'], className].filter(Boolean).join(' ');

  return (
    <div
      id={panelId}
      role="tabpanel"
      aria-labelledby={triggerId}
      tabIndex={0}
      className={panelClass}
      data-state="active"
      {...rest}
    >
      {children}
    </div>
  );
}

TabsContent.displayName = 'VhyxTabsContent';

// ─── Compound export ──────────────────────────────────────────────────────────

/** Tabs — compound tabbed navigation component. */
// Library-level contract for SealContext registration; per-instance ids set via DOM attribute.
const tabsSealContract = { ...tabsContract, id: 'vhyxui-tabs' } as Readonly<ComponentContract>;

export const Tabs = Object.assign(
  withAgentContract(TabsRoot, tabsSealContract),
  {
    List: TabsList,
    Trigger: TabsTrigger,
    Content: TabsContent,
  },
);
Tabs.displayName = 'VhyxTabs';
