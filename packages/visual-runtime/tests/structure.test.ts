import { describe, it, expect } from 'vitest';
import { VhyxUIError, VhyxUIErrorCode } from '@vhyxui/core';
import { createSequenceStructure, createGraphStructure } from '../src/structure';

describe('createSequenceStructure', () => {
  it('constructs a valid sequence structure', () => {
    const structure = createSequenceStructure([
      { id: 'A', position: 0 },
      { id: 'B', position: 1 },
    ]);
    expect(structure.type).toBe('sequence');
    expect(structure.entities).toHaveLength(2);
  });

  it('rejects duplicate entity ids', () => {
    expect(() =>
      createSequenceStructure([
        { id: 'A', position: 0 },
        { id: 'A', position: 1 },
      ]),
    ).toThrow(VhyxUIError);

    try {
      createSequenceStructure([
        { id: 'A', position: 0 },
        { id: 'A', position: 1 },
      ]);
    } catch (err) {
      expect(err).toBeInstanceOf(VhyxUIError);
      expect((err as VhyxUIError).code).toBe(VhyxUIErrorCode.VHYXUI_STRUCTURE_INVALID);
    }
  });

  it('is immutable after construction', () => {
    const structure = createSequenceStructure([{ id: 'A', position: 0 }]);
    expect(() => {
      (structure.entities as unknown as { id: string }[]).push({ id: 'B' } as never);
    }).toThrow();
    expect(Object.isFrozen(structure)).toBe(true);
    expect(Object.isFrozen(structure.entities[0])).toBe(true);
  });
});

describe('createGraphStructure', () => {
  it('constructs a valid directed graph structure', () => {
    const structure = createGraphStructure(
      [{ id: 'A' }, { id: 'B' }],
      [{ id: 'e1', from: 'A', to: 'B' }],
    );
    expect(structure.type).toBe('graph');
    expect(structure.nodes).toHaveLength(2);
    expect(structure.edges).toHaveLength(1);
  });

  it('rejects duplicate node ids', () => {
    expect(() => createGraphStructure([{ id: 'A' }, { id: 'A' }], [])).toThrow(VhyxUIError);
  });

  it('rejects duplicate edge ids', () => {
    expect(() =>
      createGraphStructure(
        [{ id: 'A' }, { id: 'B' }],
        [
          { id: 'e1', from: 'A', to: 'B' },
          { id: 'e1', from: 'B', to: 'A' },
        ],
      ),
    ).toThrow(VhyxUIError);
  });

  it('rejects an edge referencing an unknown "from" node', () => {
    expect(() => createGraphStructure([{ id: 'B' }], [{ id: 'e1', from: 'A', to: 'B' }])).toThrow(
      VhyxUIError,
    );
  });

  it('rejects an edge referencing an unknown "to" node', () => {
    expect(() => createGraphStructure([{ id: 'A' }], [{ id: 'e1', from: 'A', to: 'B' }])).toThrow(
      VhyxUIError,
    );
  });

  it('is immutable after construction', () => {
    const structure = createGraphStructure([{ id: 'A' }], []);
    expect(Object.isFrozen(structure)).toBe(true);
    expect(Object.isFrozen(structure.nodes[0])).toBe(true);
  });
});
