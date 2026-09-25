'use client';

import React from 'react';

/** Props for VisuallyHidden. */
export interface VisuallyHiddenProps extends React.HTMLAttributes<HTMLElement> {
  /** Element to render. @default 'span' */
  as?: React.ElementType;
}

const HIDDEN: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

/**
 * VisuallyHidden — content for screen readers only.
 * @example
 * <button><Icon /><VisuallyHidden>Close</VisuallyHidden></button>
 */
export function VisuallyHidden({ as: Tag = 'span', style, ...rest }: VisuallyHiddenProps): React.ReactElement {
  return <Tag style={{ ...HIDDEN, ...style }} {...rest} />;
}
