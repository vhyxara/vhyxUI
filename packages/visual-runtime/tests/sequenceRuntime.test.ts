import { describe, it, expect } from 'vitest';
import { VhyxUIError } from '@vhyxui/core';
import { createSequenceStructure } from '../src/structure';
import { createSequenceRuntime } from '../src/runtime';

function makeRuntime() {
  const structure = createSequenceStructure([
    { id: 'A', position: 0 },
    { id: 'B', position: 1 },
    { id: 'C', position: 2 },
  ]);
  return createSequenceRuntime(structure, { A: 3, B: 1, C: 2 });
}

describe('sequenceRuntime', () => {
  it('starts with seeded values and no flags set', () => {
    const runtime = makeRuntime();
    expect(runtime.getState()).toEqual({
      A: { value: 3, sorted: false, selected: false },
      B: { value: 1, sorted: false, selected: false },
      C: { value: 2, sorted: false, selected: false },
    });
  });

  it('compare is non-mutating but recorded to history', () => {
    const runtime = makeRuntime();
    const before = runtime.getState();
    runtime.compare('A', 'B');
    expect(runtime.getState()).toEqual(before);
    expect(runtime.getHistory()).toEqual([{ type: 'compare', a: 'A', b: 'B' }]);
  });

  it('swap exchanges values between two cells', () => {
    const runtime = makeRuntime();
    runtime.swap('A', 'B');
    const state = runtime.getState();
    expect(state.A?.value).toBe(1);
    expect(state.B?.value).toBe(3);
  });

  it('write copies a value one-directionally, leaving the source untouched', () => {
    const runtime = makeRuntime();
    runtime.write('A', 'C');
    const state = runtime.getState();
    expect(state.C?.value).toBe(3);
    expect(state.A?.value).toBe(3);
  });

  it('select sets selected and clears any previously selected cell', () => {
    const runtime = makeRuntime();
    runtime.select('A');
    expect(runtime.getState().A?.selected).toBe(true);

    runtime.select('B');
    const state = runtime.getState();
    expect(state.A?.selected).toBe(false);
    expect(state.B?.selected).toBe(true);
  });

  it('selected persists across unrelated compares (I-006)', () => {
    const runtime = makeRuntime();
    runtime.select('A');
    runtime.compare('B', 'C');
    runtime.compare('A', 'C');
    expect(runtime.getState().A?.selected).toBe(true);
  });

  it('commit sets sorted and clears selected', () => {
    const runtime = makeRuntime();
    runtime.select('A');
    runtime.commit('A');
    const state = runtime.getState();
    expect(state.A?.sorted).toBe(true);
    expect(state.A?.selected).toBe(false);
  });

  it('rejects operations on unknown cell ids without mutating state', () => {
    const runtime = makeRuntime();
    const before = runtime.getState();
    expect(() => runtime.compare('A', 'Z')).toThrow(VhyxUIError);
    expect(runtime.getState()).toEqual(before);
  });
});
