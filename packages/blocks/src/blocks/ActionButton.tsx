import React from 'react';
import { Button } from '@vhyxui/react';
import type { Action, LinkComponent } from './shared';

/** Renders an {@link Action} as a Button or a Button-styled link. */
export function ActionButton({
  action,
  linkAs = 'a',
  size = 'md',
  fallbackVariant = 'primary',
}: {
  action: Action;
  linkAs?: LinkComponent;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fallbackVariant?: NonNullable<Action['variant']>;
}): React.ReactElement {
  const variant = action.variant ?? fallbackVariant;
  const LinkTag = linkAs;
  if (action.href) {
    return (
      <Button asChild variant={variant} size={size} icon={action.icon}>
        <LinkTag href={action.href}>{action.label}</LinkTag>
      </Button>
    );
  }
  return (
    <Button variant={variant} size={size} icon={action.icon} onClick={action.onClick}>
      {action.label}
    </Button>
  );
}
