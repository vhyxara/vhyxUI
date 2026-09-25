'use client';

import React from 'react';
import { cx } from '../../utils/cx';
import styles from './Skeleton.module.css';

/** Props for Skeleton. */
export interface SkeletonProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** @default 'rect' */
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
  /** Repeat as N stacked text lines (last one shorter). */
  lines?: number;
}

/**
 * Skeleton — loading placeholder. Hidden from assistive tech; pair it with an
 * `aria-busy` container. Respects `prefers-reduced-motion`.
 * @example
 * <Skeleton variant="circle" width={40} height={40} />
 * <Skeleton variant="text" lines={3} />
 */
export function Skeleton({ variant = 'rect', width, height, lines, className, style, ...rest }: SkeletonProps): React.ReactElement {
  const size = { ...(width !== undefined ? { width } : {}), ...(height !== undefined ? { height } : {}) };
  if (lines && lines > 1) {
    return (
      <span aria-hidden="true" style={{ display: 'block', ...style }} className={className} {...rest}>
        {Array.from({ length: lines }, (_, i) => (
          <span
            key={i}
            className={styles['skeleton']}
            data-variant="text"
            style={{ ...size, ...(i === lines - 1 ? { width: '60%' } : {}) }}
          />
        ))}
      </span>
    );
  }
  return <span aria-hidden="true" className={cx(styles['skeleton'], className)} data-variant={variant} style={{ ...size, ...style }} {...rest} />;
}
