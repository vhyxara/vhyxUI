'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { textareaContract } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import { useId } from '../shared/useId';
import styles from './Textarea.module.css';

/** Size tokens available on the Textarea component. */
export type TextareaSize = 'sm' | 'md' | 'lg';

/** Resize behaviour for the textarea. */
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both' | 'auto';

/** Props for the Textarea component. */
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Size of the textarea. @default 'md' */
  size?: TextareaSize;
  /**
   * Resize behaviour.
   * 'auto' makes the textarea grow with content up to maxRows.
   * @default 'vertical'
   */
  resize?: TextareaResize;
  /** Minimum number of visible rows. @default 3 */
  minRows?: number;
  /** Maximum number of rows before scroll activates. Applies when resize='auto'. */
  maxRows?: number;
  /** When true, renders a character count below the textarea. Requires maxLength. */
  showCount?: boolean;
  /** When true, applies error visual state and sets aria-invalid. */
  error?: boolean;
  /** VhyxSeal contract override — merged with the default textarea contract. */
  contract?: Partial<ComponentContract>;
}

/**
 * Textarea — multi-line text input with optional auto-resize and character count.
 *
 * When resize="auto" the textarea grows with content up to maxRows.
 * error={true} triggers the vhyx-shake animation and applies danger styling.
 *
 * @example
 * <Textarea placeholder="Enter your message" minRows={3} maxRows={8} />
 */
const TextareaBase = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      resize = 'vertical',
      minRows = 3,
      maxRows,
      showCount = false,
      error = false,
      contract,
      className,
      id,
      value,
      onChange,
      maxLength,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      style,
      ...rest
    },
    ref,
  ) => {
    const internalId = useId('vhyx-textarea');
    const textareaId = id ?? internalId;
    const internalRef = useRef<HTMLTextAreaElement>(null);

    // Merge external ref with internal ref
    const setRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        (internalRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
        }
      },
      [ref],
    );

    const adjustHeight = useCallback(() => {
      const el = internalRef.current;
      if (!el || resize !== 'auto') return;

      el.style.height = 'auto';
      const scrollHeight = el.scrollHeight;

      if (maxRows !== undefined) {
        const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20;
        const maxHeight = lineHeight * maxRows;
        el.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        el.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden';
      } else {
        el.style.height = `${scrollHeight}px`;
        el.style.overflowY = 'hidden';
      }
    }, [resize, maxRows]);

    useEffect(() => {
      if (resize === 'auto') {
        adjustHeight();
      }
    }, [value, resize, adjustHeight]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(e);
        if (resize === 'auto') adjustHeight();
      },
      [onChange, resize, adjustHeight],
    );

    const charCount = typeof value === 'string' ? value.length : 0;

    const effectiveContract: Partial<ComponentContract> = {
      ...textareaContract,
      id: textareaId,
      ...contract,
    };

    const textareaClass = [styles['textarea'], className].filter(Boolean).join(' ');

    return (
      <div className={styles['wrapper']}>
        <textarea
          ref={setRef}
          id={textareaId}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          rows={minRows}
          aria-invalid={error ? true : undefined}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          className={textareaClass}
          data-size={size}
          data-resize={resize}
          data-error={error ? true : undefined}
          data-vhyx-contract={JSON.stringify(effectiveContract)}
          style={{
            resize: resize === 'auto' ? 'none' : resize,
            ...style,
          }}
          {...rest}
        />
        {showCount && maxLength !== undefined && (
          <span
            className={styles['count']}
            aria-live="polite"
            aria-atomic="true"
          >
            {charCount}/{maxLength}
          </span>
        )}
      </div>
    );
  },
);

TextareaBase.displayName = 'VhyxTextarea';

// Library-level contract for SealContext registration; per-instance ids set via DOM attribute.
const textareaSealContract = { ...textareaContract, id: 'vhyxui-textarea' } as Readonly<ComponentContract>;

export const Textarea = withAgentContract(TextareaBase, textareaSealContract) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<TextareaProps> & React.RefAttributes<HTMLTextAreaElement>
>;
Textarea.displayName = 'VhyxTextarea';
