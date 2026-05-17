import { describe, it, expect } from 'vitest';
import type { Size, Orientation, Side, Align, ColorVariant } from '../src/types/common';

// These tests are both runtime assertions and compile-time type checks.
// If a string literal is not valid for the union type, TypeScript will error
// at compile time when building the array below — catching type regressions early.

describe('Size type', () => {
  it('accepts all five defined size values', () => {
    const values: Size[] = ['xs', 'sm', 'md', 'lg', 'xl'];
    expect(values).toHaveLength(5);
    expect(values).toContain('xs');
    expect(values).toContain('sm');
    expect(values).toContain('md');
    expect(values).toContain('lg');
    expect(values).toContain('xl');
  });
});

describe('Orientation type', () => {
  it('accepts both defined orientation values', () => {
    const values: Orientation[] = ['horizontal', 'vertical'];
    expect(values).toHaveLength(2);
    expect(values).toContain('horizontal');
    expect(values).toContain('vertical');
  });
});

describe('Side type', () => {
  it('accepts all four defined side values', () => {
    const values: Side[] = ['top', 'right', 'bottom', 'left'];
    expect(values).toHaveLength(4);
    expect(values).toContain('top');
    expect(values).toContain('right');
    expect(values).toContain('bottom');
    expect(values).toContain('left');
  });
});

describe('Align type', () => {
  it('accepts all three defined align values', () => {
    const values: Align[] = ['start', 'center', 'end'];
    expect(values).toHaveLength(3);
    expect(values).toContain('start');
    expect(values).toContain('center');
    expect(values).toContain('end');
  });
});

describe('ColorVariant type', () => {
  it('accepts all five defined color variant values', () => {
    const values: ColorVariant[] = ['default', 'success', 'warning', 'danger', 'info'];
    expect(values).toHaveLength(5);
    expect(values).toContain('default');
    expect(values).toContain('success');
    expect(values).toContain('warning');
    expect(values).toContain('danger');
    expect(values).toContain('info');
  });
});
