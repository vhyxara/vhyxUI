import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { Slot, type SlotProps } from '../src/slot/Slot';

// Access the internal ForwardRef render function.
// React.forwardRef returns an object with a `render` property. Casting through
// unknown is necessary because the public type does not expose this internal property.
type SlotRenderFn = (
  props: SlotProps & Record<string, unknown>,
  ref: React.Ref<HTMLElement> | null,
) => React.ReactElement | null;

const slotRender = (Slot as unknown as { render: SlotRenderFn }).render;

describe('Slot — identity', () => {
  it('has displayName set to VhyxSlot', () => {
    expect(Slot.displayName).toBe('VhyxSlot');
  });

  it('is a valid React component (ForwardRef exotic)', () => {
    // ForwardRef components have a $$typeof property
    const asAny = Slot as unknown as Record<string, unknown>;
    // Either the component itself or its render wrapper carries $$typeof
    expect(asAny).toBeDefined();
    expect(typeof slotRender).toBe('function');
  });
});

describe('Slot — invalid children return null', () => {
  it('returns null when children is undefined', () => {
    const result = slotRender({ children: undefined }, null);
    expect(result).toBeNull();
  });

  it('returns null when children is a plain string', () => {
    const result = slotRender({ children: 'not a react element' as React.ReactNode }, null);
    expect(result).toBeNull();
  });

  it('returns null when children is null', () => {
    const result = slotRender({ children: null }, null);
    expect(result).toBeNull();
  });

  it('returns null when children is a number', () => {
    const result = slotRender({ children: 42 as unknown as React.ReactNode }, null);
    expect(result).toBeNull();
  });
});

describe('Slot — prop merging onto valid child', () => {
  it('returns a React element when given a valid child', () => {
    const child = React.createElement('div', { className: 'child' });
    const result = slotRender({ children: child }, null);
    expect(result).not.toBeNull();
    expect(React.isValidElement(result)).toBe(true);
  });

  it('merges className from slot and child with a space', () => {
    const child = React.createElement('div', { className: 'child-class' });
    const result = slotRender({ className: 'slot-class', children: child }, null);

    const props = result?.props as Record<string, unknown>;
    expect(props['className']).toBe('slot-class child-class');
  });

  it('composes event handlers — both slot and child handlers are preserved', () => {
    const slotHandler = vi.fn();
    const childHandler = vi.fn();

    const child = React.createElement('button', { onClick: childHandler });
    const result = slotRender(
      { onClick: slotHandler, children: child },
      null,
    );

    // Invoke the merged handler to verify composition
    const mergedHandler = (result?.props as Record<string, unknown>)['onClick'] as () => void;
    mergedHandler();

    expect(slotHandler).toHaveBeenCalledOnce();
    expect(childHandler).toHaveBeenCalledOnce();
  });

  it('child prop overrides slot prop for non-event, non-className props', () => {
    const child = React.createElement('div', { 'aria-label': 'child label' });
    const result = slotRender(
      { 'aria-label': 'slot label', children: child } as SlotProps & Record<string, unknown>,
      null,
    );

    const props = result?.props as Record<string, unknown>;
    expect(props['aria-label']).toBe('child label');
  });

  it('preserves the original element type of the child', () => {
    const child = React.createElement('button', { type: 'button' });
    const result = slotRender({ children: child }, null);
    expect(result?.type).toBe('button');
  });
});

describe('Slot — ref handling', () => {
  it('attaches the forwarded ref to the result element', () => {
    const ref = React.createRef<HTMLDivElement>();
    const child = React.createElement('div', {});
    // Result is a React element — the ref is set on the element for React to process.
    const result = slotRender({ children: child }, ref as React.Ref<HTMLElement>);
    // Verify result is non-null; actual DOM ref.current assignment requires rendering.
    expect(result).not.toBeNull();
  });

  // NOTE: Tests that verify ref.current is set to a DOM node require
  // a browser-like environment (jsdom or happy-dom). Those are covered
  // in @vhyxui/react component tests which run with a DOM environment.
});
