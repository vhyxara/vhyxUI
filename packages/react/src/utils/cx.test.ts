import { describe, it, expect } from 'vitest';
import { cx } from './cx';
import { spaceVar } from './space';

describe('cx', () => {
  it('joins truthy values, arrays and object keys', () => {
    expect(cx('a', false, null, undefined, 0, 'b', ['c', ['d']], { e: true, f: false })).toBe('a 0 b c d e');
  });
});

describe('spaceVar', () => {
  it('maps fractional steps to token names', () => {
    expect(spaceVar(0.5)).toBe('var(--vhyx-space-0-5)');
    expect(spaceVar(12)).toBe('var(--vhyx-space-12)');
  });
});
