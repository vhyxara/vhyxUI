'use client';

import React from 'react';
import { cx } from '../../utils/cx';
import styles from './Text.module.css';

/** Text size scale. */
export type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
/** Semantic colour of text. */
export type TextTone = 'default' | 'subtle' | 'muted' | 'accent' | 'success' | 'warning' | 'danger' | 'inherit';
/** Font weight. */
export type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/** Props for Text. */
export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. @default 'p' */
  as?: React.ElementType;
  /** @default 'md' */
  size?: TextSize;
  /** @default 'default' */
  tone?: TextTone;
  weight?: TextWeight;
  align?: 'start' | 'center' | 'end';
  /** Monospace font. */
  mono?: boolean;
  /** Single line with ellipsis. */
  truncate?: boolean;
  /** Clamp to N lines with ellipsis. */
  lines?: number;
}

/**
 * Text — body copy with token-based size, tone and weight.
 * @example
 * <Text tone="subtle" size="sm">Last updated 2 minutes ago</Text>
 */
export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ as: Tag = 'p', size = 'md', tone = 'default', weight, align, mono, truncate, lines, className, style, ...rest }, ref) => (
    <Tag
      ref={ref}
      className={cx(styles['text'], className)}
      data-size={size}
      data-tone={tone === 'default' ? undefined : tone}
      data-weight={weight}
      data-align={align}
      data-mono={mono ? 'true' : undefined}
      data-truncate={truncate ? 'true' : undefined}
      data-clamp={lines ? String(lines) : undefined}
      style={lines ? { WebkitLineClamp: lines, ...style } : style}
      {...rest}
    />
  ),
);
Text.displayName = 'VhyxText';
