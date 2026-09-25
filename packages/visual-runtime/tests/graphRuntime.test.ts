import { describe, it, expect } from 'vitest';
import { VhyxUIError } from '@vhyxui/core';
import { createGraphStructure } from '../src/structure';
import { createGraphRuntime } from '../src/runtime';

function makeRuntime() {
  const structure = createGraphStructure(
    [{ id: 'A' }, { id: 'B' }, { id: 'C' }],
    [
      { id: 'e1', from: 'A', to: 'B' },
      { id: 'e2', from: 'B', to: 'C' },
      { id: 'e3', from: 'A', to: 'C' },
    ],
  );
  return createGraphRuntime(structure);
}

describe('graphRuntime', () => {
  it('starts with no discovered nodes and no messages', () => {
    const runtime = makeRuntime();
    const state = runtime.getState();
    expect(state.nodes.A?.discovered).toBe(false);
    expect(state.messages).toEqual({});
  });

  it('discover marks a node as discovered', () => {
    const runtime = makeRuntime();
    runtime.discover('A');
    expect(runtime.getState().nodes.A?.discovered).toBe(true);
  });

  it('visit and traverseEdge are non-mutating but recorded to history', () => {
    const runtime = makeRuntime();
    const before = runtime.getState();
    runtime.visit('A');
    runtime.traverseEdge('e1');
    expect(runtime.getState()).toEqual(before);
    expect(runtime.getHistory()).toEqual([
      { type: 'visit', node: 'A' },
      { type: 'traverseEdge', edge: 'e1' },
    ]);
  });

  it('spawn creates a message at the given node', () => {
    const runtime = makeRuntime();
    runtime.spawn('m1', 'A');
    expect(runtime.getState().messages.m1).toEqual({ id: 'm1', location: 'A' });
  });

  it('rejects spawning a message id that already exists', () => {
    const runtime = makeRuntime();
    runtime.spawn('m1', 'A');
    const before = runtime.getState();
    expect(() => runtime.spawn('m1', 'B')).toThrow(VhyxUIError);
    expect(runtime.getState()).toEqual(before);
  });

  it('transfer moves a message along an edge matching its current location', () => {
    const runtime = makeRuntime();
    runtime.spawn('m1', 'A');
    runtime.transfer('m1', 'e1');
    expect(runtime.getState().messages.m1?.location).toBe('B');
  });

  it('two messages travel the same path independently, with no cross-contamination', () => {
    const runtime = makeRuntime();
    runtime.spawn('m1', 'A');
    runtime.spawn('m2', 'A');
    runtime.transfer('m1', 'e1');
    const state = runtime.getState();
    expect(state.messages.m1?.location).toBe('B');
    expect(state.messages.m2?.location).toBe('A');
  });
});
