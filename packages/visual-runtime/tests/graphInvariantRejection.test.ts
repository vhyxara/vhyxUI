import { describe, it, expect } from 'vitest';
import { VhyxUIError, VhyxUIErrorCode } from '@vhyxui/core';
import { createGraphStructure } from '../src/structure';
import { createGraphRuntime } from '../src/runtime';

/**
 * Equivalent acceptance-shape tests for the graph-side invariants already
 * proven by the BFS/DFS and system-flow spikes (decision.md v0.4/v0.5):
 * discover-once, and edge-direction-match on transfer. Same assert shape
 * as tests/postCommitRejection.test.ts — rejection must leave state
 * completely unchanged, not merely throw.
 */
describe('graph-side invariant rejection', () => {
  function makeRuntime() {
    const structure = createGraphStructure(
      [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
      [
        { id: 'e1', from: 'A', to: 'B' },
        { id: 'e2', from: 'B', to: 'C' },
      ],
    );
    return createGraphRuntime(structure);
  }

  it('rejects discovering an already-discovered node, unchanged', () => {
    const runtime = makeRuntime();
    runtime.discover('A');
    const before = runtime.getState();
    const beforeHistory = runtime.getHistory();

    expect(() => runtime.discover('A')).toThrow(VhyxUIError);

    try {
      runtime.discover('A');
    } catch (err) {
      expect(err).toBeInstanceOf(VhyxUIError);
      expect((err as VhyxUIError).code).toBe(VhyxUIErrorCode.VHYXUI_RUNTIME_INVARIANT_VIOLATION);
    }

    expect(runtime.getState()).toEqual(before);
    expect(runtime.getHistory()).toEqual(beforeHistory);
  });

  it('rejects a transfer whose edge does not originate at the message location, unchanged', () => {
    const runtime = makeRuntime();
    runtime.spawn('m1', 'A');
    const before = runtime.getState();
    const beforeHistory = runtime.getHistory();

    // e2 goes B -> C, but m1 is located at A — mismatched origin.
    expect(() => runtime.transfer('m1', 'e2')).toThrow(VhyxUIError);

    try {
      runtime.transfer('m1', 'e2');
    } catch (err) {
      expect(err).toBeInstanceOf(VhyxUIError);
      expect((err as VhyxUIError).code).toBe(VhyxUIErrorCode.VHYXUI_RUNTIME_INVARIANT_VIOLATION);
    }

    expect(runtime.getState()).toEqual(before);
    expect(runtime.getHistory()).toEqual(beforeHistory);
  });
});
