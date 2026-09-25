'use client';

import React from 'react';

/** Props for Kbd. */
export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Keys to render joined with "+", e.g. `['⌘', 'K']`. Alternative to children. */
  keys?: string[];
}

const KEY_STYLE: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  minWidth: '1.5em',
  justifyContent: 'center',
  padding: '0 var(--vhyx-space-1-5)',
  fontFamily: 'var(--vhyx-font-mono)',
  fontSize: 'var(--vhyx-text-xs)',
  lineHeight: 1.6,
  color: 'var(--vhyx-color-text-subtle)',
  background: 'var(--vhyx-color-bg-subtle)',
  border: 'var(--vhyx-border-width) solid var(--vhyx-color-border)',
  borderBottomWidth: 2,
  borderRadius: 'var(--vhyx-radius-sm)',
};

/**
 * Kbd — keyboard shortcut hint.
 * @example
 * <Kbd keys={['⌘', 'K']} />
 */
export function Kbd({ keys, children, style, ...rest }: KbdProps): React.ReactElement {
  if (keys && keys.length > 0) {
    return (
      <kbd style={{ display: 'inline-flex', gap: 'var(--vhyx-space-1)', ...style }} {...rest}>
        {keys.map((k, i) => (
          <kbd key={`${k}-${i}`} style={KEY_STYLE}>{k}</kbd>
        ))}
      </kbd>
    );
  }
  return <kbd style={{ ...KEY_STYLE, ...style }} {...rest}>{children}</kbd>;
}
