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
import { withAgentContract } from '@vhyxseal/react';
import { Slot } from '../shared/Slot';
import { useId } from '../shared/useId';
import { clampToViewport, rafBatched } from '../shared/floatingPosition';
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
 *
 * Deferred to client-only via `mounted` state, same pattern as
 * Select.Content: SSR and client initial renders both produce null,
 * eliminating both a hydration mismatch and a `document is not defined`
 * crash from `ReactDOM.createPortal(..., document.body)` if this is open
 * on first render (`document` doesn't exist during SSR).
 *
 * Position is computed as plain pixel coordinates (not a CSS `transform`
 * trick) precisely so the result can be clamped to the viewport — `align`
 * previously had no effect at all (only `side` was read), and even a
 * correct anchor computation would still let content overflow past a
 * viewport edge near the trigger (e.g. a right-aligned header popover) with
 * no boundary awareness. Both are fixed together here since they share the
 * same measurement (the content's own rendered size).
 */
function PopoverContent({
  children,
  className,
  side = 'bottom',
  align = 'center',
  style,
  ...rest
}: PopoverContentProps): React.ReactPortal | null {
  const ctx = usePopoverContext('Popover.Content');
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !ctx.open || !ctx.triggerRef.current) return;

    const calculatePosition = (): void => {
      const rect = ctx.triggerRef.current!.getBoundingClientRect();
      const contentEl = ctx.contentRef.current;
      // Fallback only matters for the `defaultOpen`/controlled-open-on-first-
      // render case, where this can run before the content itself has ever
      // painted — every subsequent call (including the very next open, and
      // every scroll/resize while open) measures the real rendered box.
      const contentWidth = contentEl?.offsetWidth ?? rect.width;
      const contentHeight = contentEl?.offsetHeight ?? 0;
      const GAP = 8;

      let top: number;
      let left: number;

      if (side === 'bottom' || side === 'top') {
        top = side === 'bottom' ? rect.bottom + GAP : rect.top - GAP - contentHeight;
        if (align === 'start') left = rect.left;
        else if (align === 'end') left = rect.right - contentWidth;
        else left = rect.left + rect.width / 2 - contentWidth / 2;
      } else {
        left = side === 'right' ? rect.right + GAP : rect.left - GAP - contentWidth;
        if (align === 'start') top = rect.top;
        else if (align === 'end') top = rect.bottom - contentHeight;
        else top = rect.top + rect.height / 2 - contentHeight / 2;
      }

      setPosition({
        top: clampToViewport(top, contentHeight, window.innerHeight),
        left: clampToViewport(left, contentWidth, window.innerWidth),
      });
    };

    calculatePosition();

    // `position: fixed` is viewport-relative — scrolling the page (or any
    // scrollable ancestor) or resizing the window moves the trigger without
    // this component re-rendering on its own, so the content would otherwise
    // stay frozen at its original screen coordinates. Scroll listens in the
    // capture phase since scroll events don't bubble. Recomputation is
    // batched to one-per-animation-frame (`rafBatched`) rather than run
    // synchronously on every raw scroll event — native scroll fires far more
    // often than the display refreshes, and committing a React state update
    // on each one desyncs the panel from the compositor's own scroll,
    // reading as a jittery, lagging box instead of one that tracks smoothly.
    const batched = rafBatched(calculatePosition);
    window.addEventListener('scroll', batched.run, true);
    window.addEventListener('resize', batched.run);

    return () => {
      batched.cancel();
      window.removeEventListener('scroll', batched.run, true);
      window.removeEventListener('resize', batched.run);
    };
  }, [mounted, ctx.open, ctx.triggerRef, side, align]);

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      ctx.contentRef.current = node;
    },
    [ctx.contentRef],
  );

  // Render nothing until client mount — matches SSR output exactly, same as
  // Select.Content — before checking ctx.open at all.
  if (!mounted || !ctx.open) return null;

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
      {...rest}
      style={{
        // Consumer's cosmetic style first — internal positioning keys below
        // are applied explicitly afterward so they always win, instead of
        // letting a whole `style` object from a blind `{...rest}` spread
        // replace this element's positioning outright.
        ...style,
        position: 'fixed',
        top: position.top,
        left: position.left,
        zIndex: 450, // --vhyx-z-popover
      }}
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
  /**
   * When true, renders as the child element via Slot instead of <button>.
   * Use to avoid nested interactive elements when composing with Button.
   */
  asChild?: boolean;
}

/** Button that closes the Popover. */
const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(
  ({ children, className, onClick, asChild = false, ...rest }, ref) => {
    const ctx = usePopoverContext('Popover.Close');

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        ctx.onOpenChange(false);
      },
      [onClick, ctx],
    );

    const closeClass = [styles['close'], className].filter(Boolean).join(' ');

    const closeProps = {
      onClick: handleClick,
      className: closeClass,
      ...rest,
    };

    if (asChild) {
      return (
        <Slot ref={ref as React.Ref<HTMLElement>} {...closeProps}>
          {children}
        </Slot>
      );
    }

    return (
      <button ref={ref} type="button" {...closeProps}>
        {children ?? 'Close'}
      </button>
    );
  },
);

PopoverClose.displayName = 'VhyxPopoverClose';

// ─── Compound export ──────────────────────────────────────────────────────────

/** Popover — non-modal floating panel compound component. */
// Library-level contract for SealContext registration; per-instance ids set via DOM attribute.
const popoverSealContract = { ...popoverContract, id: 'vhyxui-popover' } as Readonly<ComponentContract>;

export const Popover = Object.assign(
  withAgentContract(PopoverRoot, popoverSealContract),
  {
    Trigger: PopoverTrigger,
    Content: PopoverContent,
    Arrow: PopoverArrow,
    Close: PopoverClose,
  },
);
Popover.displayName = 'VhyxPopover';
