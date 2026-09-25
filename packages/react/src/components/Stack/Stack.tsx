'use client';

import React from 'react';
import { cx } from '../../utils/cx';
import { spaceVar, type Breakpoint, type Space } from '../../utils/space';
import styles from './Stack.module.css';

/** Flex alignment keywords. */
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
/** Flex justification keywords. */
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

/** Props for Stack. */
export interface StackProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. @default 'div' */
  as?: React.ElementType;
  /** Main axis. @default 'column' */
  direction?: 'row' | 'column';
  /** Gap between children, in token steps. @default 3 */
  gap?: Space;
  /** Cross-axis alignment. */
  align?: StackAlign;
  /** Main-axis distribution. */
  justify?: StackJustify;
  /** Allow children to wrap onto multiple lines. */
  wrap?: boolean;
  /** Switch a row to a column below this breakpoint (responsive without media queries in your code). */
  collapseBelow?: Breakpoint;
  /** Padding on all sides, in token steps. */
  padding?: Space;
}

const ALIGN: Record<StackAlign, string> = {
  start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', baseline: 'baseline',
};
const JUSTIFY: Record<StackJustify, string> = {
  start: 'flex-start', center: 'center', end: 'flex-end',
  between: 'space-between', around: 'space-around', evenly: 'space-evenly',
};

/**
 * Stack — the one layout primitive you need most: children in a row or column with consistent gaps.
 *
 * @example
 * <Stack gap={4}>
 *   <Heading>Title</Heading>
 *   <Text tone="subtle">Body</Text>
 * </Stack>
 *
 * @example
 * <Stack direction="row" justify="between" align="center" collapseBelow="md">…</Stack>
 */
export const Stack = React.forwardRef<HTMLElement, StackProps>(
  (
    { as: Tag = 'div', direction = 'column', gap = 3, align, justify, wrap = false, collapseBelow, padding, className, style, ...rest },
    ref,
  ) => (
    <Tag
      ref={ref}
      className={cx(styles['stack'], className)}
      data-direction={direction}
      data-wrap={wrap ? 'true' : undefined}
      data-collapse={collapseBelow}
      style={{
        gap: spaceVar(gap),
        ...(align ? { alignItems: ALIGN[align] } : {}),
        ...(justify ? { justifyContent: JUSTIFY[justify] } : {}),
        ...(padding !== undefined ? { padding: spaceVar(padding) } : {}),
        ...style,
      }}
      {...rest}
    />
  ),
);
Stack.displayName = 'VhyxStack';

/** Props for HStack/VStack — Stack without `direction`. */
export type DirectionalStackProps = Omit<StackProps, 'direction'>;

/** Horizontal Stack. Defaults `align="center"`. @example <HStack gap={2}><Button/><Button/></HStack> */
export const HStack = React.forwardRef<HTMLElement, DirectionalStackProps>(({ align = 'center', ...props }, ref) => (
  <Stack ref={ref} direction="row" align={align} {...props} />
));
HStack.displayName = 'VhyxHStack';

/** Vertical Stack. @example <VStack gap={4}>…</VStack> */
export const VStack = React.forwardRef<HTMLElement, DirectionalStackProps>((props, ref) => (
  <Stack ref={ref} direction="column" {...props} />
));
VStack.displayName = 'VhyxVStack';
