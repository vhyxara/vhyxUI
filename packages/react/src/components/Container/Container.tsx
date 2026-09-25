'use client';

import React from 'react';
import { cx } from '../../utils/cx';
import styles from './Container.module.css';

/** Max-width presets: sm 640 · md 768 · lg 1024 · xl 1280 · full. */
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/** Props for Container. */
export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. @default 'div' */
  as?: React.ElementType;
  /** Maximum width. @default 'lg' */
  size?: ContainerSize;
  /** Remove horizontal padding. */
  flush?: boolean;
}

/**
 * Container — centers content with a readable max width and responsive gutters.
 * @example
 * <Container size="md"><Prose /></Container>
 */
export const Container = React.forwardRef<HTMLElement, ContainerProps>(
  ({ as: Tag = 'div', size = 'lg', flush = false, className, ...rest }, ref) => (
    <Tag
      ref={ref}
      className={cx(styles['container'], className)}
      data-size={size}
      data-flush={flush ? 'true' : undefined}
      {...rest}
    />
  ),
);
Container.displayName = 'VhyxContainer';
