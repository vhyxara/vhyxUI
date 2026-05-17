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
import { dialogContract } from '@vhyxui/core';
import { VhyxUIError, VhyxUIErrorCode } from '@vhyxui/core';
import { Slot } from '../shared/Slot';
import { useId } from '../shared/useId';
import styles from './Dialog.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  modal: boolean;
  titleId: string;
  descriptionId: string;
  triggerRef: React.MutableRefObject<HTMLElement | null>;
  hasTitleRef: React.MutableRefObject<boolean>;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext(componentName: string): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_MISSING_CONTEXT,
      message: `${componentName} must be used within <Dialog>`,
      suggestion: 'Wrap your component tree with <Dialog>',
    });
  }
  return ctx;
}

// ─── Dialog Root ──────────────────────────────────────────────────────────────

/** Root props for the Dialog compound component. */
export interface DialogProps {
  /** Controlled open state. */
  open?: boolean;
  /** Default open state for uncontrolled mode. @default false */
  defaultOpen?: boolean;
  /** Called when the open state changes. */
  onOpenChange?: (open: boolean) => void;
  /** When true, blocks interaction with the rest of the page. @default true */
  modal?: boolean;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
  /** Dialog sub-components as children. */
  children: React.ReactNode;
}

/**
 * Dialog — modal overlay with focus trap, scroll lock, and full accessibility.
 *
 * Sub-components: Dialog.Trigger, Dialog.Portal, Dialog.Overlay, Dialog.Content,
 * Dialog.Header, Dialog.Footer, Dialog.Title, Dialog.Description, Dialog.Close.
 *
 * Dialog.Title is required — a console.warn fires in development if absent.
 *
 * @example
 * <Dialog>
 *   <Dialog.Trigger asChild><Button>Open</Button></Dialog.Trigger>
 *   <Dialog.Content>
 *     <Dialog.Title>Are you sure?</Dialog.Title>
 *     <Dialog.Description>This action cannot be undone.</Dialog.Description>
 *     <Dialog.Close>Cancel</Dialog.Close>
 *   </Dialog.Content>
 * </Dialog>
 */
const DialogRoot = React.forwardRef<HTMLDivElement, DialogProps>(
  (
    {
      open,
      defaultOpen = false,
      onOpenChange,
      modal = true,
      contract,
      children,
    },
    ref,
  ) => {
    const internalId = useId('vhyx-dialog');
    const titleId = `${internalId}-title`;
    const descriptionId = `${internalId}-description`;

    const isControlled = open !== undefined;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
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

    // Restore focus to trigger when dialog closes.
    // Must live in DialogRoot (always mounted) — DialogContent unmounts on close.
    useEffect(() => {
      if (isOpen) return;
      const trigger = triggerRef.current;
      if (trigger && document.body.contains(trigger)) {
        trigger.focus();
      }
    }, [isOpen]);

    const effectiveContract: Partial<ComponentContract> = useMemo(
      () => ({ ...dialogContract, id: internalId, ...contract }),
      [internalId, contract],
    );

    const ctx = useMemo<DialogContextValue>(
      () => ({
        open: isOpen,
        onOpenChange: handleOpenChange,
        modal,
        titleId,
        descriptionId,
        triggerRef,
        hasTitleRef,
      }),
      [isOpen, handleOpenChange, modal, titleId, descriptionId],
    );

    return (
      <DialogContext.Provider value={ctx}>
        <div
          ref={ref}
          data-state={isOpen ? 'open' : 'closed'}
          data-vhyx-contract={JSON.stringify(effectiveContract)}
        >
          {children}
        </div>
      </DialogContext.Provider>
    );
  },
);

DialogRoot.displayName = 'VhyxDialog';

// ─── Dialog.Trigger ───────────────────────────────────────────────────────────

export interface DialogTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** When true, renders as the child element via Slot instead of <button>. */
  asChild?: boolean;
  children?: React.ReactNode;
}

/** The element that opens the dialog. Saves its ref for focus restoration on close. */
const DialogTrigger = React.forwardRef<HTMLButtonElement, DialogTriggerProps>(
  ({ children, className, onClick, asChild = false, ...rest }, ref) => {
    const ctx = useDialogContext('Dialog.Trigger');

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

DialogTrigger.displayName = 'VhyxDialogTrigger';

// ─── Dialog.Portal ────────────────────────────────────────────────────────────

export interface DialogPortalProps {
  children?: React.ReactNode;
}

/** Renders its children in document.body. */
function DialogPortal({ children }: DialogPortalProps): React.ReactPortal | null {
  const ctx = useDialogContext('Dialog.Portal');
  if (!ctx.open) return null;
  return ReactDOM.createPortal(children, document.body) as React.ReactPortal;
}

DialogPortal.displayName = 'VhyxDialogPortal';

// ─── Dialog.Overlay ───────────────────────────────────────────────────────────

export interface DialogOverlayProps extends React.HTMLAttributes<HTMLDivElement> {}

/** The backdrop overlay rendered behind Dialog.Content. */
const DialogOverlay = React.forwardRef<HTMLDivElement, DialogOverlayProps>(
  ({ className, onClick, ...rest }, ref) => {
    const ctx = useDialogContext('Dialog.Overlay');

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(e);
        // Clicking overlay closes the dialog (non-modal behavior optional)
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

DialogOverlay.displayName = 'VhyxDialogOverlay';

// ─── Focus trap utility ────────────────────────────────────────────────────────

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

// ─── Dialog.Content ───────────────────────────────────────────────────────────

export interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Override the accessible label for the close button inside. */
  closeLabel?: string;
}

/**
 * The dialog panel. Implements:
 * - Focus trap (Tab/Shift+Tab cycles within Content)
 * - Focus restoration to trigger on close
 * - Scroll lock on document.body
 * - Escape key closes dialog
 * - Dev warning when Dialog.Title is absent
 */
const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  ({ children, className, ...rest }, ref) => {
    const ctx = useDialogContext('Dialog.Content');
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

    // Focus the first focusable element on open
    useEffect(() => {
      if (!ctx.open || !contentRef.current) return;
      const focusable = getFocusable(contentRef.current);
      if (focusable.length > 0) {
        focusable[0]?.focus();
      } else {
        contentRef.current.focus();
      }
    }, [ctx.open]);

    // Dev warning if Dialog.Title is absent
    useEffect(() => {
      if (!ctx.open) return;
      if (process.env['NODE_ENV'] !== 'production' && !ctx.hasTitleRef.current) {
        console.warn(
          '[VhyxUI] <Dialog.Content> requires <Dialog.Title> for accessibility. ' +
            'Screen reader users need a title to understand the dialog purpose.',
        );
      }
    }, [ctx.open, ctx.hasTitleRef]);

    // Focus trap — Tab/Shift+Tab cycles within Content
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

    // Focus restoration is handled in DialogRoot (always mounted).

    const contentClass = [styles['content'], className].filter(Boolean).join(' ');

    return (
      <div
        ref={setRef}
        role="dialog"
        aria-modal={ctx.modal ? true : undefined}
        aria-labelledby={ctx.titleId}
        aria-describedby={ctx.descriptionId}
        tabIndex={-1}
        className={contentClass}
        data-state="open"
        {...rest}
      >
        {children}
      </div>
    );
  },
);

DialogContent.displayName = 'VhyxDialogContent';

// ─── Layout sub-components ────────────────────────────────────────────────────

export interface DialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** Optional layout wrapper for the dialog header area. */
function DialogHeader({ children, className, ...rest }: DialogHeaderProps): React.ReactElement {
  const headerClass = [styles['header'], className].filter(Boolean).join(' ');
  return (
    <div className={headerClass} {...rest}>
      {children}
    </div>
  );
}

DialogHeader.displayName = 'VhyxDialogHeader';

export interface DialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/** Optional layout wrapper for the dialog footer (actions). */
function DialogFooter({ children, className, ...rest }: DialogFooterProps): React.ReactElement {
  const footerClass = [styles['footer'], className].filter(Boolean).join(' ');
  return (
    <div className={footerClass} {...rest}>
      {children}
    </div>
  );
}

DialogFooter.displayName = 'VhyxDialogFooter';

export interface DialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

/** The dialog's accessible title. Required for screen reader announcement. */
function DialogTitle({ children, className, ...rest }: DialogTitleProps): React.ReactElement {
  const ctx = useDialogContext('Dialog.Title');

  // Mark that a title is present so DialogContent skips the dev warning
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

DialogTitle.displayName = 'VhyxDialogTitle';

export interface DialogDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

/** Optional accessible description. */
function DialogDescription(
  { children, className, ...rest }: DialogDescriptionProps,
): React.ReactElement {
  const ctx = useDialogContext('Dialog.Description');
  const descClass = [styles['description'], className].filter(Boolean).join(' ');
  return (
    <p id={ctx.descriptionId} className={descClass} {...rest}>
      {children}
    </p>
  );
}

DialogDescription.displayName = 'VhyxDialogDescription';

export interface DialogCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
}

/** Button that closes the dialog. */
const DialogClose = React.forwardRef<HTMLButtonElement, DialogCloseProps>(
  ({ children, className, onClick, ...rest }, ref) => {
    const ctx = useDialogContext('Dialog.Close');

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

DialogClose.displayName = 'VhyxDialogClose';

// ─── Compound export ──────────────────────────────────────────────────────────

/**
 * Dialog — modal compound component with focus trap and full accessibility.
 *
 * Sub-components: Dialog.Trigger, Dialog.Portal, Dialog.Overlay, Dialog.Content,
 * Dialog.Header, Dialog.Footer, Dialog.Title, Dialog.Description, Dialog.Close.
 */
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Portal: DialogPortal,
  Overlay: DialogOverlay,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
});
