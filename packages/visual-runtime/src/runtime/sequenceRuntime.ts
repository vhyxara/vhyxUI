import type { SequenceStructure } from '../structure/types';
import type { SequenceEvent } from '../events/types';
import { assertInvariant } from './invariant';

/**
 * Pattern A (sequence sorts): state keyed directly by structural entity id.
 * `sorted` and `selected` are independent persistent flags, set/cleared by
 * `select`/`commit` respectively — not a single status enum (Selection
 * Sort's "selected must survive several compares" requires this).
 */
export interface SequenceCellState {
  readonly value: unknown;
  readonly sorted: boolean;
  readonly selected: boolean;
}

export type SequenceRuntimeState = Readonly<Record<string, SequenceCellState>>;

export interface SequenceRuntime {
  getState(): SequenceRuntimeState;
  getHistory(): readonly SequenceEvent[];
  /** Non-mutating — ephemeral comparison, recorded to history only. */
  compare(a: string, b: string): void;
  /** Exchanges values between two cells. Rejected if either cell is committed. */
  swap(a: string, b: string): void;
  /** One-directional copy of `from`'s value into `to`. Rejected if `to` is committed. */
  write(from: string, to: string): void;
  /**
   * Marks `id` as the current candidate (Selection Sort semantics): clears
   * `selected` on whichever cell currently holds it, then sets it on `id`.
   * Rejected if `id` is committed.
   */
  select(id: string): void;
  /** Marks `id` as sorted and clears `selected`. Rejected if already committed. */
  commit(id: string): void;
}

export function createSequenceRuntime(
  structure: SequenceStructure,
  initialValues: Readonly<Record<string, unknown>>,
): SequenceRuntime {
  const state = new Map<string, SequenceCellState>();
  for (const entity of structure.entities) {
    assertInvariant(
      Object.prototype.hasOwnProperty.call(initialValues, entity.id),
      `Missing initial value for cell "${entity.id}"`,
      { id: entity.id },
    );
    state.set(entity.id, { value: initialValues[entity.id], sorted: false, selected: false });
  }

  const history: SequenceEvent[] = [];

  function requireCell(id: string): SequenceCellState {
    const cell = state.get(id);
    assertInvariant(cell !== undefined, `Unknown cell "${id}"`, { id });
    return cell as SequenceCellState;
  }

  function snapshot(): SequenceRuntimeState {
    const out: Record<string, SequenceCellState> = {};
    for (const [id, cell] of state) {
      out[id] = Object.freeze({ ...cell });
    }
    return Object.freeze(out);
  }

  return {
    getState: snapshot,
    getHistory: () => [...history],

    compare(a, b) {
      requireCell(a);
      requireCell(b);
      history.push({ type: 'compare', a, b });
    },

    swap(a, b) {
      const cellA = requireCell(a);
      const cellB = requireCell(b);
      assertInvariant(!cellA.sorted, `Cannot mutate committed cell "${a}"`, { id: a });
      assertInvariant(!cellB.sorted, `Cannot mutate committed cell "${b}"`, { id: b });

      state.set(a, { ...cellA, value: cellB.value });
      state.set(b, { ...cellB, value: cellA.value });
      history.push({ type: 'swap', a, b });
    },

    write(from, to) {
      const source = requireCell(from);
      const target = requireCell(to);
      assertInvariant(!target.sorted, `Cannot mutate committed cell "${to}"`, { id: to });

      state.set(to, { ...target, value: source.value });
      history.push({ type: 'write', from, to });
    },

    select(id) {
      const cell = requireCell(id);
      assertInvariant(!cell.sorted, `Cannot select committed cell "${id}"`, { id });

      for (const [otherId, otherCell] of state) {
        if (otherId !== id && otherCell.selected) {
          state.set(otherId, { ...otherCell, selected: false });
        }
      }
      state.set(id, { ...cell, selected: true });
      history.push({ type: 'select', id });
    },

    commit(id) {
      const cell = requireCell(id);
      assertInvariant(!cell.sorted, `Cell "${id}" is already committed`, { id });

      state.set(id, { ...cell, sorted: true, selected: false });
      history.push({ type: 'commit', id });
    },
  };
}
