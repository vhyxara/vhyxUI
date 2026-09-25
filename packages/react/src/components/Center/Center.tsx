'use client';

import React from 'react';

/** Props for Center. */
export interface CenterProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. @default 'div' */
  as?: React.ElementType;
  /** Use `inline-flex` instead of `flex`. */
  inline?: boolean;
  /** Fill the viewport height — handy for auth and empty screens. */
  fullHeight?: boolean;
}

/**
 * Center — centers its children on both axes.
 * @example
 * <Center fullHeight><Spinner /></Center>
 */
export const Center = React.forwardRef<HTMLElement, CenterProps>(
  ({ as: Tag = 'div', inline = false, fullHeight = false, style, ...rest }, ref) => (
    <Tag
      ref={ref}
      style={{
        display: inline ? 'inline-flex' : 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...(fullHeight ? { minHeight: '100dvh' } : {}),
        ...style,
      }}
      {...rest}
    />
  ),
);
Center.displayName = 'VhyxCenter';
