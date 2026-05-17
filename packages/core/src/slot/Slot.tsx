import React from 'react';
import { mergeProps } from './mergeProps';
import { mergeRefs } from './mergeRefs';

/** Props accepted by the Slot component. Extends all standard HTML element attributes. */
export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  /** The single child element whose props will be merged with the Slot's own props. */
  children?: React.ReactNode;
}

/**
 * Slot — the asChild pattern implementation.
 *
 * Merges its own props onto its immediate child element, allowing a parent
 * component to pass behaviour (event handlers, className, style, ARIA attributes)
 * through to a developer-supplied element without wrapping it in an extra DOM node.
 *
 * Merge rules (handled by mergeProps):
 * - Event handlers: both slot and child handlers are called (slot fires first).
 * - className: concatenated with a space.
 * - style: merged as objects (child values override slot values).
 * - All other props: child value overrides slot default.
 *
 * Zero Radix dependency — per DECISION-012.
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(
  ({ children, ...slotProps }, ref) => {
    if (!React.isValidElement(children)) {
      return null;
    }

    type ChildWithRef = React.ReactElement & {
      ref?: React.Ref<unknown>;
      props: Record<string, unknown>;
    };

    const child = children as ChildWithRef;

    return React.cloneElement(child, {
      ...mergeProps(slotProps as Record<string, unknown>, child.props),
      // Merge the Slot's forwarded ref with the child's own ref so both are satisfied.
      ref: ref != null ? mergeRefs(ref, child.ref) : child.ref,
    } as React.HTMLAttributes<HTMLElement>);
  },
);

Slot.displayName = 'VhyxSlot';
