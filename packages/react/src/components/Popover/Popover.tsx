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
import ReactDOM from 'react-dom';
import type { ComponentContract } from '@vhyxui/core';
import { popoverContract } from '@vhyxui/core';
import { VhyxUIError, VhyxUIErrorCode } from '@vhyxui/core';
import { Slot } from '../shared/Slot';
import { useId } from '../shared/useId';
import styles from './Popover.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface PopoverContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerId: string;
  contentId: string;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext(componentName: string): PopoverContextValue {
  const ctx = useContext(PopoverContext);
  if (!ctx) {
    throw new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_MISSING_CONTEXT,
      message: `${componentName} must be used within <Popover>`,
      suggestion: 'Wrap your component tree with <Popover>',
    });
  }
  return ctx;
}

// ─── Popover Root ─────────────────────────────────────────────────────────────

/** Root props for the Popover compound component. */
export interface PopoverProps {
  /** Controlled open state. */
  open?: boolean;
  /** Default open state for uncontrolled mode. @default false */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
  /** Popover sub-components as children. */
  children: React.ReactNode;
}

/**
 * Popover — non-modal floating panel anchored to a trigger.
 *
 * Unlike Dialog, Popover does not trap focus (aria-modal="false").
 * Closes on Escape and click outside.
 *
 * Sub-components: Popover.Trigger, Popover.Content, Popover.Arrow, Popover.Close.
 *
 * @example
 * <Popover>
 *   <Popover.Trigger>Settings</Popover.Trigger>
 *   <Popover.Content>
 *     <p>Popover body</p>
 *     <Popover.Close>Done</Popover.Close>
 *   </Popover.Content>
 * </Popover>
 */
const PopoverRoot = React.forwardRef<HTMLDivElement, PopoverProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      contract,
      children,
    },
    ref,
  ) => {
    const internalId = useId('vhyx-popover');
    const triggerId = `${internalId}-trigger`;
    const contentId = `${internalId}-content`;

    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isOpen = isControlled ? (open as boolean) : internalOpen;

    const triggerRef = useRef<HTMLElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const handleOpenChange = useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) setInternalOpen(nextOpen);
        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange],
    );

    // Close on Escape
    useEffect(() => {
      if (!isOpen) return;
      function onKey(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
          handleOpenChange(false);
          triggerRef.current?.focus();
        }
      }
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [isOpen, handleOpenChange]);

    // Click-outside to close — check both trigger and content
    useEffect(() => {
      if (!isOpen) return;
      function onMouseDown(e: MouseEvent): void {
        const target = e.target as Node;
        if (triggerRef.current?.contains(target)) return;
        if (contentRef.current?.contains(target)) return;
        handleOpenChange(false);
      }
      document.addEventListener('mousedown', onMouseDown);
      return () => document.removeEventListener('mousedown', onMouseDown);
    }, [isOpen, handleOpenChange]);

    const effectiveContract: Partial<ComponentContract> = useMemo(
      () => ({ ...popoverContract, id: internalId, ...contract }),
      [internalId, contract],
    );

    const ctx = useMemo<PopoverContextValue>(
      () => ({
        open: isOpen,
        onOpenChange: handleOpenChange,
        triggerId,
        contentId,
        triggerRef,
        contentRef,
      }),
      [isOpen, handleOpenChange, triggerId, contentId],
    );

    return (
      <PopoverContext.Provider value={ctx}>
        <div
          ref={ref}
          data-state={isOpen ? 'open' : 'closed'}
          data-vhyx-contract={JSON.stringify(effectiveContract)}
        >
          {children}
        </div>
      </PopoverContext.Provider>
    );
  },
);

PopoverRoot.displayName = 'VhyxPopover';

// ─── Popover.Trigger ──────────────────────────────────────────────────────────

export interface PopoverTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** When true, renders as the child element via Slot instead of <button>. */
  asChild?: boolean;
  children?: React.ReactNode;
}

/** The button that opens or closes the Popover. */
const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  ({ children, className, onClick, asChild = false, ...rest }, ref) => {
    const ctx = usePopoverContext('Popover.Trigger');

    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        ctx.triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref, ctx.triggerRef],
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        ctx.onOpenChange(!ctx.open);
      },
      [onClick, ctx],
    );

    const triggerClass = [styles['trigger'], className].filter(Boolean).join(' ');

    const triggerProps = {
      id: ctx.triggerId,
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': ctx.open,
      'aria-controls': ctx.open ? ctx.contentId : undefined,
      onClick: handleClick,
      className: triggerClass,
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

PopoverTrigger.displayName = 'VhyxPopoverTrigger';

// ─── Popover.Content ──────────────────────────────────────────────────────────

export type PopoverSide = 'top' | 'right' | 'bottom' | 'left';
export type PopoverAlign = 'start' | 'center' | 'end';

export interface PopoverContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Side to position the popover relative to its trigger. @default 'bottom' */
  side?: PopoverSide;
  /** Alignment along the cross-axis. @default 'center' */
  align?: PopoverAlign;
  children?: React.ReactNode;
}

/**
 * The floating panel. Rendered in a portal.
 * Non-modal (aria-modal="false") — focus is NOT trapped.
 */
function PopoverContent({
  children,
  className,
  side = 'bottom',
  align = 'center',
  ...rest
}: PopoverContentProps): React.ReactPortal | null {
  const ctx = usePopoverContext('Popover.Content');
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  useEffect(() => {
    if (!ctx.open || !ctx.triggerRef.current) return;
    const rect = ctx.triggerRef.current.getBoundingClientRect();
    const GAP = 8;

    let top = 0;
    let left = 0;

    if (side === 'bottom') {
      top = rect.bottom + GAP;
      left = rect.left + rect.width / 2;
    } else if (side === 'top') {
      top = rect.top - GAP;
      left = rect.left + rect.width / 2;
    } else if (side === 'right') {
      top = rect.top + rect.height / 2;
      left = rect.right + GAP;
    } else {
      top = rect.top + rect.height / 2;
      left = rect.left - GAP;
    }

    setPosition({ top, left });
  }, [ctx.open, ctx.triggerRef, side]);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      ctx.contentRef.current = node;
    },
    [ctx.contentRef],
  );

  if (!ctx.open) return null;

  const contentClass = [styles['content'], className].filter(Boolean).join(' ');

  const content = (
    <div
      ref={setRef}
      id={ctx.contentId}
      role="dialog"
      aria-modal="false"
      aria-labelledby={ctx.triggerId}
      className={contentClass}
      data-state="open"
      data-side={side}
      data-align={align}
      style={{
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 450, // --vhyx-z-popover
        transform: 'translateX(-50%)',
      }}
      {...rest}
    >
      {children}
    </div>
  );

  return ReactDOM.createPortal(content, document.body) as React.ReactPortal;
}

PopoverContent.displayName = 'VhyxPopoverContent';

// ─── Popover.Arrow ────────────────────────────────────────────────────────────

export interface PopoverArrowProps extends React.SVGAttributes<SVGSVGElement> {}

/** Optional decorative arrow pointing toward the trigger. */
function PopoverArrow({ className, ...rest }: PopoverArrowProps): React.ReactElement {
  const arrowClass = [styles['arrow'], className].filter(Boolean).join(' ');
  return (
    <svg
      aria-hidden="true"
      className={arrowClass}
      viewBox="0 0 10 5"
      {...rest}
    >
      <path d="M0 5L5 0L10 5" fill="currentColor" />
    </svg>
  );
}

PopoverArrow.displayName = 'VhyxPopoverArrow';

// ─── Popover.Close ────────────────────────────────────────────────────────────

export interface PopoverCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

/** Button that closes the Popover. */
const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ children, className, onClick, ...rest }, ref) => {
    const ctx = usePopoverContext('Popover.Close');

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        ctx.onOpenChange(false);
      },
      [onClick, ctx],
    );

    const closeClass = [styles['close'], className].filter(Boolean).join(' ');

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        className={closeClass}
        {...rest}
      >
        {children ?? 'Close'}
      </button>
    );
  },
);

PopoverClose.displayName = 'VhyxPopoverClose';

// ─── Compound export ──────────────────────────────────────────────────────────

/** Popover — non-modal floating panel compound component. */
export const Popover = Object.assign(PopoverRoot, {
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Arrow: PopoverArrow,
  Close: PopoverClose,
});
