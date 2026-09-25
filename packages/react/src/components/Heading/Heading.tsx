'use client';

import React from 'react';
import { cx } from '../../utils/cx';
import styles from '../Text/Text.module.css';

/** Heading level 1–6. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** Visual heading size, independent of level. */
export type HeadingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Props for Heading. */
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Semantic level → renders `<h1>`…`<h6>`. @default 2 */
  level?: HeadingLevel;
  /** Visual size. Defaults from level so semantics and looks stay independent. */
  size?: HeadingSize;
}

const SIZE_FOR_LEVEL: Record<HeadingLevel, HeadingSize> = { 1: '2xl', 2: 'xl', 3: 'lg', 4: 'md', 5: 'sm', 6: 'xs' };

/**
 * Heading — semantic level and visual size are separate, so outlines stay correct.
 * @example
 * <Heading level={1}>Dashboard</Heading>
 * <Heading level={2} size="sm">Recent activity</Heading>
 */
export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 2, size, className, ...rest }, ref) => {
    const Tag = `h${level}` as const;
    return <Tag ref={ref} className={cx(styles['heading'], className)} data-size={size ?? SIZE_FOR_LEVEL[level]} {...rest} />;
  },
);
Heading.displayName = 'VhyxHeading';
