import { describe, it, expect, vi } from 'vitest';
import { mergeProps } from '../src/slot/mergeProps';

describe('mergeProps — event handlers', () => {
  it('calls both handlers when both slot and child define the same event', () => {
    const slotHandler = vi.fn();
    const childHandler = vi.fn();

    const merged = mergeProps(
      { onClick: slotHandler },
      { onClick: childHandler },
    );

    (merged['onClick'] as (e: unknown) => void)('event');

    expect(slotHandler).toHaveBeenCalledOnce();
    expect(slotHandler).toHaveBeenCalledWith('event');
    expect(childHandler).toHaveBeenCalledOnce();
    expect(childHandler).toHaveBeenCalledWith('event');
  });

  it('calls slot handler before child handler', () => {
    const order: string[] = [];
    const merged = mergeProps(
      { onClick: () => order.push('slot') },
      { onClick: () => order.push('child') },
    );

    (merged['onClick'] as () => void)();

    expect(order).toEqual(['slot', 'child']);
  });

  it('uses child handler when only child defines it', () => {
    const childHandler = vi.fn();
    const merged = mergeProps({}, { onClick: childHandler });

    (merged['onClick'] as () => void)();

    expect(childHandler).toHaveBeenCalledOnce();
  });

  it('uses slot handler when only slot defines it', () => {
    const slotHandler = vi.fn();
    const merged = mergeProps({ onClick: slotHandler }, {});

    (merged['onClick'] as () => void)();

    expect(slotHandler).toHaveBeenCalledOnce();
  });

  it('recognises all standard React event handler names', () => {
    const slotFn = vi.fn();
    const childFn = vi.fn();

    const events = ['onChange', 'onBlur', 'onFocus', 'onMouseEnter', 'onKeyDown'];
    for (const event of events) {
      const merged = mergeProps({ [event]: slotFn }, { [event]: childFn });
      (merged[event] as () => void)();
    }

    expect(slotFn).toHaveBeenCalledTimes(events.length);
    expect(childFn).toHaveBeenCalledTimes(events.length);
  });
});

describe('mergeProps — className', () => {
  it('concatenates slot and child className with a space', () => {
    const merged = mergeProps(
      { className: 'slot-class' },
      { className: 'child-class' },
    );
    expect(merged['className']).toBe('slot-class child-class');
  });

  it('uses only child className when slot has none', () => {
    const merged = mergeProps({}, { className: 'child-class' });
    expect(merged['className']).toBe('child-class');
  });

  it('uses only slot className when child has none', () => {
    const merged = mergeProps({ className: 'slot-class' }, {});
    expect(merged['className']).toBe('slot-class');
  });

  it('handles empty className strings without producing extra spaces', () => {
    const merged = mergeProps({ className: '' }, { className: 'child-class' });
    // Empty string is falsy — should not produce " child-class"
    expect(merged['className']).toBe('child-class');
  });
});

describe('mergeProps — style', () => {
  it('merges style objects with child values overriding slot values', () => {
    const merged = mergeProps(
      { style: { color: 'red', fontWeight: 'bold' } },
      { style: { color: 'blue' } },
    );
    expect(merged['style']).toEqual({ color: 'blue', fontWeight: 'bold' });
  });

  it('uses child style when slot has no style', () => {
    const merged = mergeProps({}, { style: { color: 'blue' } });
    expect(merged['style']).toEqual({ color: 'blue' });
  });

  it('uses slot style when child has no style', () => {
    const merged = mergeProps({ style: { color: 'red' } }, {});
    expect(merged['style']).toEqual({ color: 'red' });
  });
});

describe('mergeProps — non-event props', () => {
  it('child value overrides slot value for regular props', () => {
    const merged = mergeProps(
      { 'aria-label': 'slot label', 'data-testid': 'slot' },
      { 'aria-label': 'child label' },
    );
    expect(merged['aria-label']).toBe('child label');
    expect(merged['data-testid']).toBe('slot');
  });

  it('slot value is used when child does not define the prop', () => {
    const merged = mergeProps({ id: 'slot-id' }, {});
    expect(merged['id']).toBe('slot-id');
  });

  it('child value is used when child defines undefined for a prop', () => {
    const merged = mergeProps({ id: 'slot-id' }, { id: undefined });
    expect(merged['id']).toBeUndefined();
  });
});

describe('mergeProps — edge cases', () => {
  it('returns empty object when both inputs are empty', () => {
    const merged = mergeProps({}, {});
    expect(Object.keys(merged)).toHaveLength(0);
  });

  it('does not mutate the slot props input', () => {
    const slotProps = { className: 'slot' };
    mergeProps(slotProps, { className: 'child' });
    expect(slotProps.className).toBe('slot');
  });

  it('does not mutate the child props input', () => {
    const childProps = { className: 'child' };
    mergeProps({ className: 'slot' }, childProps);
    expect(childProps.className).toBe('child');
  });
});
