'use client';

import React from 'react';
import { cx } from '../../utils/cx';
import { spaceVar, type Breakpoint, type Space } from '../../utils/space';
import styles from './Grid.module.css';

/** Props for Grid. */
export interface GridProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. @default 'div' */
  as?: React.ElementType;
  /** Fixed number of equal columns. Ignored when `minChildWidth` is set. @default 1 */
  columns?: number;
  /**
   * Responsive auto-fit: as many columns as fit, each at least this wide
   * (e.g. `"16rem"` or `240`). The easiest way to build card grids.
   */
  minChildWidth?: string | number;
  /** Gap between cells, in token steps. @default 4 */
  gap?: Space;
  /** Collapse to a single column below this breakpoint (fixed `columns` only). */
  collapseBelow?: Breakpoint;
}

/**
 * Grid — equal columns or responsive auto-fit cards in one prop.
 *
 * @example
 * <Grid minChildWidth="16rem" gap={6}>{cards}</Grid>
 * <Grid columns={3} collapseBelow="md">…</Grid>
 */
export const Grid = React.forwardRef<HTMLElement, GridProps>(
  ({ as: Tag = 'div', columns = 1, minChildWidth, gap = 4, collapseBelow, className, style, ...rest }, ref) => {
    const min = typeof minChildWidth === 'number' ? `${minChildWidth}px` : minChildWidth;
    const template = min
      ? `repeat(auto-fit, minmax(min(${min}, 100%), 1fr))`
      : `repeat(${Math.max(1, Math.floor(columns))}, minmax(0, 1fr))`;
    return (
      <Tag
        ref={ref}
        className={cx(styles['grid'], className)}
        data-collapse={min ? undefined : collapseBelow}
        style={{ gridTemplateColumns: template, gap: spaceVar(gap), ...style }}
        {...rest}
      />
    );
  },
);
Grid.displayName = 'VhyxGrid';
