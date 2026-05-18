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
import { drawerContract } from '@vhyxui/core';
import { VhyxUIError, VhyxUIErrorCode } from '@vhyxui/core';
import { Slot } from '../shared/Slot';
import { useId } from '../shared/useId';
import styles from './Drawer.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface DrawerContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: 'left' | 'right' | 'top' | 'bottom';
  size: 'sm' | 'md' | 'lg' | 'full';
  titleId: string;
  descriptionId: string;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  hasTitleRef: React.MutableRefObject<boolean>;
}

const DrawerContext = createContext<DrawerContextValue | null>(null);

function useDrawerContext(componentName: string): DrawerContextValue {
  const ctx = useContext(DrawerContext);
  if (!ctx) {
    throw new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_MISSING_CONTEXT,
      message: `${componentName} must be used within <Drawer>`,
      suggestion: 'Wrap your component tree with <Drawer>',
    });
  }
  return ctx;
}

// ─── Focus trap utility ────────────────────────────────────────────────────────

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

// ─── Drawer Root ──────────────────────────────────────────────────────────────

/** Side the Drawer slides in from. */
export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

/** Size of the Drawer panel. */
export type DrawerSize = 'sm' | 'md' | 'lg' | 'full';

/** Root props for the Drawer compound component. */
export interface DrawerProps {
  /** Controlled open state. */
  open?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** Side the drawer slides in from. @default 'right' */
  side?: DrawerSide;
  /** Size of the drawer panel. @default 'md' */
  size?: DrawerSize;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
  /** Drawer sub-components as children. */
  children: React.ReactNode;
}

/**
 * Drawer — slide-in panel with focus trap, scroll lock, and full accessibility.
 *
 * Identical API to Dialog, adding `side` and `size` props.
 * Motion direction follows the side prop.
 *
 * Sub-components: Drawer.Trigger, Drawer.Portal, Drawer.Overlay, Drawer.Content,
 * Drawer.Header, Drawer.Footer, Drawer.Title, Drawer.Description, Drawer.Close.
 */
const DrawerRoot = React.forwardRef<HTMLDivElement, DrawerProps>(
  (
    {
      open,
      onOpenChange,
      side = 'right',
      size = 'md',
      contract,
      children,
    },
    ref,
  ) => {
    const internalId = useId('vhyx-drawer');
    const titleId = `${internalId}-title`;
    const descriptionId = `${internalId}-description`;

    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const isOpen = isControlled ? (open as boolean) : internalOpen;

    const triggerRef = useRef<HTMLElement | null>(null);
    const hasTitleRef = useRef<boolean>(false);

    const handleOpenChange = useCallback(
      (nextOpen: boolean) => {
        if (!isControlled) setInternalOpen(nextOpen);
        onOpenChange?.(nextOpen);
      },
      [isControlled, onOpenChange],
    );

    // Focus restoration in DrawerRoot (always mounted) — per Session 010 architecture note
    useEffect(() => {
      if (isOpen) return;
      const trigger = triggerRef.current;
      if (trigger && document.body.contains(trigger)) {
        trigger.focus();
      }
    }, [isOpen]);

    const effectiveContract: Partial<ComponentContract> = useMemo(
      () => ({ ...drawerContract, id: internalId, ...contract }),
      [internalId, contract],
    );

    const ctx = useMemo<DrawerContextValue>(
      () => ({
        open: isOpen,
        onOpenChange: handleOpenChange,
        side,
        size,
        titleId,
        descriptionId,
        triggerRef,
        hasTitleRef,
      }),
      [isOpen, handleOpenChange, side, size, titleId, descriptionId],
    );

    return (
      <DrawerContext.Provider value={ctx}>
        <div
          ref={ref}
          data-state={isOpen ? 'open' : 'closed'}
          data-side={side}
          data-vhyx-contract={JSON.stringify(effectiveContract)}
        >
          {children}
        </div>
      </DrawerContext.Provider>
    );
  },
);

DrawerRoot.displayName = 'VhyxDrawer';

// ─── Drawer.Trigger ───────────────────────────────────────────────────────────

export interface DrawerTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** When true, renders as the child element via Slot instead of <button>. */
  asChild?: boolean;
  children?: React.ReactNode;
}

/** The element that opens the drawer. Saves its ref for focus restoration on close. */
const DrawerTrigger = React.forwardRef<HTMLButtonElement, DrawerTriggerProps>(
  ({ children, className, onClick, asChild = false, ...rest }, ref) => {
    const ctx = useDrawerContext('Drawer.Trigger');

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
        ctx.onOpenChange(true);
      },
      [onClick, ctx],
    );

    const triggerClass = [styles['trigger'], className].filter(Boolean).join(' ');

    const triggerProps = {
      'aria-haspopup': 'dialog' as const,
      'aria-expanded': ctx.open,
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

DrawerTrigger.displayName = 'VhyxDrawerTrigger';

// ─── Drawer.Portal ────────────────────────────────────────────────────────────

export interface DrawerPortalProps {
  children?: React.ReactNode;
}

/** Renders its children in document.body when the drawer is open. */
function DrawerPortal({ children }: DrawerPortalProps): React.ReactPortal | null {
  const ctx = useDrawerContext('Drawer.Portal');
  if (!ctx.open) return null;
  return ReactDOM.createPortal(children, document.body) as React.ReactPortal;
}

DrawerPortal.displayName = 'VhyxDrawerPortal';

// ─── Drawer.Overlay ───────────────────────────────────────────────────────────

export interface DrawerOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

/** The backdrop overlay rendered behind Drawer.Content. */
const DrawerOverlay = React.forwardRef<HTMLDivElement, DrawerOverlayProps>(
  ({ className, onClick, ...rest }, ref) => {
    const ctx = useDrawerContext('Drawer.Overlay');

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(e);
        ctx.onOpenChange(false);
      },
      [onClick, ctx],
    );

    const overlayClass = [styles['overlay'], className].filter(Boolean).join(' ');

    return (
      <div
        ref={ref}
        className={overlayClass}
        data-state="open"
        onClick={handleClick}
        aria-hidden="true"
        {...rest}
      />
    );
  },
);

DrawerOverlay.displayName = 'VhyxDrawerOverlay';

// ─── Drawer.Content ───────────────────────────────────────────────────────────

export interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * The drawer panel. Implements focus trap, scroll lock, initial focus,
 * Escape-to-close, and dev warning when Drawer.Title is absent.
 */
const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ children, className, ...rest }, ref) => {
    const ctx = useDrawerContext('Drawer.Content');
    const contentRef = useRef<HTMLDivElement | null>(null);

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        contentRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref],
    );

    // Scroll lock
    useEffect(() => {
      if (!ctx.open) return;
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }, [ctx.open]);

    // Initial focus on open
    useEffect(() => {
      if (!ctx.open || !contentRef.current) return;
      const focusable = getFocusable(contentRef.current);
      if (focusable.length > 0) focusable[0]?.focus();
      else contentRef.current.focus();
    }, [ctx.open]);

    // Dev warning for missing Drawer.Title
    useEffect(() => {
      if (!ctx.open) return;
      if (process.env['NODE_ENV'] !== 'production' && !ctx.hasTitleRef.current) {
        console.warn(
          '[VhyxUI] <Drawer.Content> requires <Drawer.Title> for accessibility. ' +
            'Screen reader users need a title to understand the drawer purpose.',
        );
      }
    }, [ctx.open, ctx.hasTitleRef]);

    // Focus trap and Escape handling — document-level listener per Session 010 pattern
    useEffect(() => {
      if (!ctx.open || !contentRef.current) return;
      const container = contentRef.current;

      function handleKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
          ctx.onOpenChange(false);
          return;
        }
        if (e.key !== 'Tab') return;

        const focusable = getFocusable(container);
        if (focusable.length === 0) return;

        const firstEl = focusable[0]!;
        const lastEl = focusable[focusable.length - 1]!;

        if (e.shiftKey) {
          if (document.activeElement === firstEl || !container.contains(document.activeElement)) {
            e.preventDefault();
            lastEl.focus();
          }
        } else {
          if (document.activeElement === lastEl || !container.contains(document.activeElement)) {
            e.preventDefault();
            firstEl.focus();
          }
        }
      }

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [ctx.open, ctx.onOpenChange]);

    const contentClass = [styles['content'], className].filter(Boolean).join(' ');

    return (
      <div
        ref={setRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={ctx.titleId}
        aria-describedby={ctx.descriptionId}
        tabIndex={-1}
        className={contentClass}
        data-state="open"
        data-side={ctx.side}
        data-size={ctx.size}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

DrawerContent.displayName = 'VhyxDrawerContent';

// ─── Layout sub-components ────────────────────────────────────────────────────

export interface DrawerHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function DrawerHeader({ children, className, ...rest }: DrawerHeaderProps): React.ReactElement {
  const headerClass = [styles['header'], className].filter(Boolean).join(' ');
  return (
    <div className={headerClass} {...rest}>
      {children}
    </div>
  );
}

DrawerHeader.displayName = 'VhyxDrawerHeader';

export interface DrawerFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function DrawerFooter({ children, className, ...rest }: DrawerFooterProps): React.ReactElement {
  const footerClass = [styles['footer'], className].filter(Boolean).join(' ');
  return (
    <div className={footerClass} {...rest}>
      {children}
    </div>
  );
}

DrawerFooter.displayName = 'VhyxDrawerFooter';

export interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

function DrawerTitle({ children, className, ...rest }: DrawerTitleProps): React.ReactElement {
  const ctx = useDrawerContext('Drawer.Title');

  useEffect(() => {
    ctx.hasTitleRef.current = true;
    return () => {
      ctx.hasTitleRef.current = false;
    };
  }, [ctx.hasTitleRef]);

  const titleClass = [styles['title'], className].filter(Boolean).join(' ');

  return (
    <h2 id={ctx.titleId} className={titleClass} {...rest}>
      {children}
    </h2>
  );
}

DrawerTitle.displayName = 'VhyxDrawerTitle';

export interface DrawerDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

function DrawerDescription(
  { children, className, ...rest }: DrawerDescriptionProps,
): React.ReactElement {
  const ctx = useDrawerContext('Drawer.Description');
  const descClass = [styles['description'], className].filter(Boolean).join(' ');
  return (
    <p id={ctx.descriptionId} className={descClass} {...rest}>
      {children}
    </p>
  );
}

DrawerDescription.displayName = 'VhyxDrawerDescription';

export interface DrawerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  /**
   * When true, renders as the child element via Slot instead of <button>.
   * Use to avoid nested interactive elements when composing with Button.
   */
  asChild?: boolean;
}

const DrawerClose = React.forwardRef<HTMLButtonElement, DrawerCloseProps>(
  ({ children, className, onClick, asChild = false, ...rest }, ref) => {
    const ctx = useDrawerContext('Drawer.Close');

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

DrawerClose.displayName = 'VhyxDrawerClose';

// ─── Compound export ──────────────────────────────────────────────────────────

/** Drawer — slide-in panel compound component. */
export const Drawer = Object.assign(DrawerRoot, {
  Trigger: DrawerTrigger,
  Portal: DrawerPortal,
  Overlay: DrawerOverlay,
  Content: DrawerContent,
  Header: DrawerHeader,
  Footer: DrawerFooter,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
});
