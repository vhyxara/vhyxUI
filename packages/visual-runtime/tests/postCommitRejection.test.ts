import { describe, it, expect } from 'vitest';
import { VhyxUIError, VhyxUIErrorCode } from '@vhyxui/core';
import { createSequenceStructure } from '../src/structure';
import { createSequenceRuntime } from '../src/runtime';

/**
 * Section 5 / Section 10 acceptance criterion (mandatory, not optional):
 *
 *   Given:  cell A has committed = true
 *   When:   swap(A, B)
 *   Then:   Runtime must reject the event.
 *           Must not: mutate A, mutate B, append a partially-applied event,
 *           or silently ignore the violation.
 *           Rejected events must leave Runtime state completely unchanged.
 */
describe('post-commit mutation rejection (sequence side)', () => {
  function makeRuntime() {
    const structure = createSequenceStructure([
      { id: 'A', position: 0 },
      { id: 'B', position: 1 },
    ]);
    const runtime = createSequenceRuntime(structure, { A: 1, B: 2 });
    runtime.commit('A');
    return runtime;
  }

  it('throws VHYXUI_RUNTIME_INVARIANT_VIOLATION when swapping a committed cell', () => {
    const runtime = makeRuntime();
    expect(() => runtime.swap('A', 'B')).toThrow(VhyxUIError);

    try {
      runtime.swap('A', 'B');
    } catch (err) {
      expect(err).toBeInstanceOf(VhyxUIError);
      expect((err as VhyxUIError).code).toBe(VhyxUIErrorCode.VHYXUI_RUNTIME_INVARIANT_VIOLATION);
    }
  });

  it('leaves Runtime state completely unchanged after rejection — no partial mutation', () => {
    const runtime = makeRuntime();
    const beforeState = runtime.getState();
    const beforeHistory = runtime.getHistory();

    expect(() => runtime.swap('A', 'B')).toThrow(VhyxUIError);

    expect(runtime.getState()).toEqual(beforeState);
    expect(runtime.getHistory()).toEqual(beforeHistory);
  });

  it('also rejects write into a committed cell, unchanged', () => {
    const runtime = makeRuntime();
    const before = runtime.getState();
    expect(() => runtime.write('B', 'A')).toThrow(VhyxUIError);
    expect(runtime.getState()).toEqual(before);
  });

  it('also rejects select on a committed cell, unchanged', () => {
    const runtime = makeRuntime();
    const before = runtime.getState();
    expect(() => runtime.select('A')).toThrow(VhyxUIError);
    expect(runtime.getState()).toEqual(before);
  });

  it('also rejects re-committing an already-committed cell, unchanged', () => {
    const runtime = makeRuntime();
    const before = runtime.getState();
    expect(() => runtime.commit('A')).toThrow(VhyxUIError);
    expect(runtime.getState()).toEqual(before);
  });
});
