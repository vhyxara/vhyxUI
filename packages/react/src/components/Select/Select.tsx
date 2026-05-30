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
import { selectContract } from '@vhyxui/core';
import { VhyxUIError, VhyxUIErrorCode } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import { Slot } from '../shared/Slot';
import { useId } from '../shared/useId';
import styles from './Select.module.css';

// ─── Context ──────────────────────────────────────────────────────────────────

interface SelectContextValue {
  value: string | undefined;
  onValueChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled: boolean;
  size: 'sm' | 'md' | 'lg';
  placeholder: string | undefined;
  triggerId: string;
  contentId: string;
  triggerRef: React.MutableRefObject<HTMLButtonElement | null>;
  contentRef: React.MutableRefObject<HTMLDivElement | null>;
  focusedValue: string | undefined;
  setFocusedValue: (value: string | undefined) => void;
  registerItem: (value: string, label: string, disabled?: boolean) => void;
  getSelectedLabel: () => string | undefined;
  navigateItems: (direction: 'up' | 'down' | 'home' | 'end') => void;
  itemElementsRef: React.MutableRefObject<Map<string, HTMLElement>>;
  itemOrderRef: React.MutableRefObject<string[]>;
  itemRegistryRef: React.MutableRefObject<Map<string, { label: string; disabled?: boolean }>>;
}

const SelectContext = createContext<SelectContextValue | null>(null);

function useSelectContext(componentName: string): SelectContextValue {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_MISSING_CONTEXT,
      message: `${componentName} must be used within <Select>`,
      suggestion: 'Wrap your component tree with <Select>',
    });
  }
  return ctx;
}

// ─── Select Root ──────────────────────────────────────────────────────────────

/** Size tokens for Select. */
export type SelectSize = 'sm' | 'md' | 'lg';

/** Root props for the Select compound component. */
export interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Controlled selected value. */
  value?: string;
  /** Default selected value for uncontrolled mode. */
  defaultValue?: string;
  /** Called when a new value is selected. */
  onValueChange?: (value: string) => void;
  /** When true, the trigger is disabled. */
  disabled?: boolean;
  /** Size applied to all Select sub-components. @default 'md' */
  size?: SelectSize;
  /** Placeholder text shown when no value is selected. */
  placeholder?: string;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
}

/**
 * Select — compound dropdown with full keyboard navigation.
 *
 * Sub-components: Select.Trigger, Select.Content, Select.Item,
 * Select.Group, Select.Label, Select.Separator.
 */
const SelectRoot = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      disabled = false,
      size = 'md',
      placeholder,
      contract,
      children,
      className,
      ...htmlProps
    },
    ref,
  ) => {
    const triggerId = useId('vhyx-select-trigger');
    const contentId = useId('vhyx-select-content');
    const internalId = useId('vhyx-select');

    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
    const currentValue = isControlled ? value : internalValue;

    const [open, setOpen] = useState(false);
    const [focusedValue, setFocusedValue] = useState<string | undefined>(undefined);

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    // Persistent registries — never cleared so labels survive open/close cycles
    const itemRegistryRef = useRef<Map<string, { label: string; disabled?: boolean }>>(new Map());
    const itemOrderRef = useRef<string[]>([]);
    const itemElementsRef = useRef<Map<string, HTMLElement>>(new Map());

    // State-backed selected label so trigger re-renders when registry populates.
    // Ref tracks current value for use inside stable callbacks.
    const [selectedLabel, setSelectedLabel] = useState<string | undefined>(undefined);
    const currentValueRef = useRef(currentValue);
    currentValueRef.current = currentValue;

    // Sync selectedLabel when currentValue changes (controlled/uncontrolled switch)
    useEffect(() => {
      if (currentValue === undefined) {
        setSelectedLabel(undefined);
        return;
      }
      const entry = itemRegistryRef.current.get(currentValue);
      if (entry) setSelectedLabel(entry.label);
      else setSelectedLabel(undefined);
    }, [currentValue]);

    const registerItem = useCallback(
      (itemValue: string, label: string, itemDisabled?: boolean) => {
        if (!itemRegistryRef.current.has(itemValue)) {
          itemOrderRef.current.push(itemValue);
        }
        const entry: { label: string; disabled?: boolean } = { label };
        if (itemDisabled !== undefined) entry.disabled = itemDisabled;
        itemRegistryRef.current.set(itemValue, entry);
        // If this item matches the current selected value, update the trigger display
        if (itemValue === currentValueRef.current) {
          setSelectedLabel(label);
        }
      },
      [],
    );

    const getSelectedLabel = useCallback((): string | undefined => {
      return selectedLabel;
    }, [selectedLabel]);

    const navigateItems = useCallback(
      (direction: 'up' | 'down' | 'home' | 'end') => {
        const order = itemOrderRef.current.filter(
          (v) => !itemRegistryRef.current.get(v)?.disabled,
        );
        if (order.length === 0) return;

        let nextValue: string | undefined;
        if (direction === 'home') {
          nextValue = order[0];
        } else if (direction === 'end') {
          nextValue = order[order.length - 1];
        } else {
          const idx = focusedValue !== undefined ? order.indexOf(focusedValue) : -1;
          nextValue =
            direction === 'down'
              ? order[Math.min(idx + 1, order.length - 1)]
              : order[Math.max(idx - 1, 0)];
        }

        if (nextValue !== undefined) {
          setFocusedValue(nextValue);
          itemElementsRef.current.get(nextValue)?.focus();
        }
      },
      [focusedValue],
    );

    const handleValueChange = useCallback(
      (newValue: string) => {
        if (!isControlled) setInternalValue(newValue);
        onValueChange?.(newValue);
        setOpen(false);
        setFocusedValue(undefined);
        triggerRef.current?.focus();
      },
      [isControlled, onValueChange],
    );

    const handleOpenChange = useCallback(
      (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (nextOpen) {
          const initial = currentValue ?? itemOrderRef.current[0];
          setFocusedValue(initial);
          // Focus is handled by SelectContent's useEffect after render
        } else {
          setFocusedValue(undefined);
        }
      },
      [currentValue],
    );

    const effectiveContract: Partial<ComponentContract> = useMemo(
      () => ({ ...selectContract, id: internalId, ...contract }),
      [internalId, contract],
    );

    const ctx = useMemo<SelectContextValue>(
      () => ({
        value: currentValue,
        onValueChange: handleValueChange,
        open,
        onOpenChange: handleOpenChange,
        disabled,
        size,
        placeholder,
        triggerId,
        contentId,
        triggerRef,
        contentRef,
        focusedValue,
        setFocusedValue,
        registerItem,
        getSelectedLabel,
        navigateItems,
        itemElementsRef,
        itemOrderRef,
        itemRegistryRef,
      }),
      [
        currentValue,
        handleValueChange,
        open,
        handleOpenChange,
        disabled,
        size,
        placeholder,
        triggerId,
        contentId,
        focusedValue,
        registerItem,
        getSelectedLabel,
        navigateItems,
      ],
    );

    // Close on Escape key
    useEffect(() => {
      if (!open) return;
      function onKey(e: KeyboardEvent): void {
        if (e.key === 'Escape') {
          setOpen(false);
          setFocusedValue(undefined);
          triggerRef.current?.focus();
        }
      }
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    // Click-outside to close.
    // Checks both triggerRef AND contentRef so item clicks don't close
    // the dropdown before the click event fires (mousedown precedes click).
    useEffect(() => {
      if (!open) return;
      function onMouseDown(e: MouseEvent): void {
        const target = e.target as Node;
        if (triggerRef.current?.contains(target)) return;
        if (contentRef.current?.contains(target)) return;
        setOpen(false);
        setFocusedValue(undefined);
      }
      document.addEventListener('mousedown', onMouseDown);
      return () => document.removeEventListener('mousedown', onMouseDown);
    }, [open]);

    return (
      <SelectContext.Provider value={ctx}>
        <div
          ref={ref}
          className={className}
          data-size={size}
          data-disabled={disabled ? true : undefined}
          data-vhyx-contract={JSON.stringify(effectiveContract)}
          {...htmlProps}
        >
          {children}
        </div>
      </SelectContext.Provider>
    );
  },
);

SelectRoot.displayName = 'VhyxSelect';

// ─── Select.Trigger ───────────────────────────────────────────────────────────

export interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Optional icon rendered on the right. Defaults to a chevron SVG. */
  icon?: React.ReactNode;
  /** When true, renders as the child element via Slot instead of <button>. */
  asChild?: boolean;
}

/** The button that opens or closes the Select dropdown. */
const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ icon, className, asChild = false, ...rest }, ref) => {
    const ctx = useSelectContext('Select.Trigger');
    const displayLabel = ctx.getSelectedLabel();

    const setRef = useCallback(
      (node: HTMLButtonElement | null) => {
        ctx.triggerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
      },
      [ref, ctx.triggerRef],
    );

    const handleClick = useCallback(() => {
      if (!ctx.disabled) ctx.onOpenChange(!ctx.open);
    }, [ctx]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          if (!ctx.open) ctx.onOpenChange(true);
        }
      },
      [ctx],
    );

    const triggerClass = [styles['trigger'], className].filter(Boolean).join(' ');

    const triggerProps = {
      id: ctx.triggerId,
      role: 'combobox' as const,
      'aria-haspopup': 'listbox' as const,
      'aria-expanded': ctx.open,
      'aria-controls': ctx.open ? ctx.contentId : undefined,
      disabled: ctx.disabled,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      className: triggerClass,
      'data-size': ctx.size,
      'data-state': ctx.open ? 'open' : 'closed',
      'data-placeholder': !displayLabel ? (true as const) : undefined,
      ...rest,
    };

    if (asChild) {
      return (
        <Slot ref={setRef as React.Ref<HTMLElement>} {...triggerProps}>
          {rest.children}
        </Slot>
      );
    }

    return (
      <button ref={setRef} type="button" {...triggerProps}>
        <span className={styles['trigger-value']}>
          {displayLabel ?? ctx.placeholder ?? 'Select…'}
        </span>
        <span className={styles['trigger-icon']} aria-hidden="true">
          {icon ?? (
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={1.5}>
              <path d="M2.5 4.5L6 8L9.5 4.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
      </button>
    );
  },
);

SelectTrigger.displayName = 'VhyxSelectTrigger';

// ─── Select.Content ───────────────────────────────────────────────────────────

export interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

/**
 * Portal-rendered listbox. Deferred to client-only via `mounted` state so
 * SSR and client initial renders both produce null — eliminating the
 * hydration mismatch that occurred when SSR returned null but the client
 * immediately rendered the portal with differing data-state / position values.
 *
 * SelectItem labels register on their own mount effects after this content
 * mounts client-side, so the trigger label display is updated via state.
 */
function SelectContent({ children, className, ...rest }: SelectContentProps): React.ReactPortal | null {
  const ctx = useSelectContext('Select.Content');
  const [mounted, setMounted] = useState(false);
  const [positionStyle, setPositionStyle] = useState<React.CSSProperties>({
    position: 'fixed',
    top: 0,
    left: 0,
    minWidth: 0,
    zIndex: 'var(--vhyx-z-dropdown)',
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!ctx.open || !ctx.triggerRef.current) return;
    const rect = ctx.triggerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const contentHeight = ctx.contentRef.current?.scrollHeight ?? 300;

    // Flip above the trigger when there is more room above than below.
    const showAbove = spaceBelow < contentHeight && spaceAbove > spaceBelow;

    setPositionStyle({
      position: 'fixed',
      top: showAbove ? rect.top - contentHeight - 4 : rect.bottom + 4,
      left: rect.left,
      minWidth: rect.width,
      zIndex: 'var(--vhyx-z-dropdown)',
      maxHeight: showAbove
        ? Math.min(contentHeight, spaceAbove - 8)
        : Math.min(contentHeight, spaceBelow - 8),
      overflowY: 'auto',
    });
  }, [ctx.open, ctx.triggerRef]);

  // Move focus to the initial item when the dropdown opens.
  // Done in an effect (not requestAnimationFrame) so it works in jsdom tests.
  useEffect(() => {
    if (!ctx.open || !ctx.focusedValue) return;
    ctx.itemElementsRef.current.get(ctx.focusedValue)?.focus();
  }, [ctx.open]); // eslint-disable-line react-hooks/exhaustive-deps

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      ctx.contentRef.current = node;
    },
    [ctx.contentRef],
  );

  // Render nothing until client mount — matches SSR output exactly.
  if (!mounted) return null;

  const contentClass = [styles['content'], className].filter(Boolean).join(' ');

  const content = (
    <div
      ref={setRef}
      id={ctx.contentId}
      role="listbox"
      aria-labelledby={ctx.triggerId}
      className={contentClass}
      data-state={ctx.open ? 'open' : 'closed'}
      style={positionStyle}
      {...rest}
    >
      {children}
    </div>
  );

  return ReactDOM.createPortal(content, document.body) as React.ReactPortal;
}

SelectContent.displayName = 'VhyxSelectContent';

// ─── Select.Item ──────────────────────────────────────────────────────────────

export interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The value this item represents. */
  value: string;
  /** When true, this item cannot be selected. */
  disabled?: boolean;
  children: React.ReactNode;
}

/** A single selectable option inside Select.Content. */
const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ value, disabled, children, className, onClick, onKeyDown, ...rest }, ref) => {
    const ctx = useSelectContext('Select.Item');
    const isSelected = ctx.value === value;
    const isFocused = ctx.focusedValue === value;

    const labelText = typeof children === 'string' ? children : '';

    // Register on mount — no cleanup so label persists after dropdown closes
    useEffect(() => {
      ctx.registerItem(value, labelText, disabled);
    }, [ctx, value, labelText, disabled]);

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (node) {
          ctx.itemElementsRef.current.set(value, node);
        } else {
          ctx.itemElementsRef.current.delete(value);
        }
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      },
      [ref, ctx, value],
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(e);
        if (!disabled) ctx.onValueChange(value);
      },
      [onClick, disabled, ctx, value],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e);
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (!disabled) ctx.onValueChange(value);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          ctx.navigateItems('down');
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          ctx.navigateItems('up');
        } else if (e.key === 'Home') {
          e.preventDefault();
          ctx.navigateItems('home');
        } else if (e.key === 'End') {
          e.preventDefault();
          ctx.navigateItems('end');
        }
      },
      [onKeyDown, disabled, ctx, value],
    );

    const itemClass = [styles['item'], className].filter(Boolean).join(' ');

    return (
      <div
        ref={setRef}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled ? true : undefined}
        tabIndex={isFocused ? 0 : -1}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={itemClass}
        data-state={isSelected ? 'selected' : 'unselected'}
        data-disabled={disabled ? true : undefined}
        data-focused={isFocused ? true : undefined}
        {...rest}
      >
        {children}
        {isSelected && (
          <span className={styles['item-check']} aria-hidden="true">
            <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
              <polyline points="2,6 5,9 10,3" />
            </svg>
          </span>
        )}
      </div>
    );
  },
);

SelectItem.displayName = 'VhyxSelectItem';

// ─── Select.Group ─────────────────────────────────────────────────────────────

export interface SelectGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function SelectGroup({ children, className, ...rest }: SelectGroupProps): React.ReactElement {
  const labelId = useId('vhyx-select-group-label');
  const groupClass = [styles['group'], className].filter(Boolean).join(' ');
  return (
    <div role="group" aria-labelledby={labelId} className={groupClass} {...rest}>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          (child.type as { displayName?: string }).displayName === 'VhyxSelectLabel'
        ) {
          return React.cloneElement(child as React.ReactElement<{ id?: string }>, { id: labelId });
        }
        return child;
      })}
    </div>
  );
}

SelectGroup.displayName = 'VhyxSelectGroup';

// ─── Select.Label ─────────────────────────────────────────────────────────────

export interface SelectLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
}

function SelectLabel({ children, className, ...rest }: SelectLabelProps): React.ReactElement {
  const labelClass = [styles['label'], className].filter(Boolean).join(' ');
  return (
    <span className={labelClass} {...rest}>
      {children}
    </span>
  );
}

SelectLabel.displayName = 'VhyxSelectLabel';

// ─── Select.Separator ─────────────────────────────────────────────────────────

export interface SelectSeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

function SelectSeparator({ className, ...rest }: SelectSeparatorProps): React.ReactElement {
  const sepClass = [styles['separator'], className].filter(Boolean).join(' ');
  return <hr aria-hidden="true" className={sepClass} {...rest} />;
}

SelectSeparator.displayName = 'VhyxSelectSeparator';

// ─── Compound export ──────────────────────────────────────────────────────────

/** Select — compound dropdown with full keyboard navigation. */
// Library-level contract for SealContext registration; per-instance ids set via DOM attribute.
const selectSealContract = { ...selectContract, id: 'vhyxui-select' } as Readonly<ComponentContract>;

export const Select = Object.assign(
  withAgentContract(SelectRoot, selectSealContract),
  {
    Trigger: SelectTrigger,
    Content: SelectContent,
    Item: SelectItem,
    Group: SelectGroup,
    Label: SelectLabel,
    Separator: SelectSeparator,
  },
);
Select.displayName = 'VhyxSelect';
