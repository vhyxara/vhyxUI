/**
 * Event vocabulary — Section 10 of visual-runtime-architecture.md.
 *
 * These ten event types are each individually evidenced across five spike
 * experiments (Bubble/Selection/Insertion/Merge Sort, BFS/DFS,
 * system-flow/messages). They are NOT a proven primitive algebra: no
 * compositional semantics or cross-primitive validation rules have been
 * demonstrated. Treat this as the current evidenced vocabulary, not a
 * closed or generalizable event system — do not add event types beyond
 * these ten without new evidence, and do not derive a shared/generic event
 * shape across topologies from this list.
 *
 * These types also double as this package's runtime event-history log
 * entries (I-005: Runtime owns temporal progression) — each Runtime method
 * appends the corresponding event object to its own private history.
 */

export type SequenceEventType = 'compare' | 'swap' | 'write' | 'select' | 'commit';
export type GraphEventType = 'discover' | 'visit' | 'traverseEdge' | 'spawn' | 'transfer';

export interface CompareEvent {
  readonly type: 'compare';
  readonly a: string;
  readonly b: string;
}

export interface SwapEvent {
  readonly type: 'swap';
  readonly a: string;
  readonly b: string;
}

/** One-directional copy (Merge Sort) — mechanically distinct from `swap`'s symmetric exchange. */
export interface WriteEvent {
  readonly type: 'write';
  readonly from: string;
  readonly to: string;
}

export interface SelectEvent {
  readonly type: 'select';
  readonly id: string;
}

export interface CommitEvent {
  readonly type: 'commit';
  readonly id: string;
}

export type SequenceEvent = CompareEvent | SwapEvent | WriteEvent | SelectEvent | CommitEvent;

export interface DiscoverEvent {
  readonly type: 'discover';
  readonly node: string;
}

export interface VisitEvent {
  readonly type: 'visit';
  readonly node: string;
}

export interface TraverseEdgeEvent {
  readonly type: 'traverseEdge';
  readonly edge: string;
}

export interface SpawnEvent {
  readonly type: 'spawn';
  readonly message: string;
  readonly node: string;
}

export interface TransferEvent {
  readonly type: 'transfer';
  readonly message: string;
  readonly edge: string;
}

export type GraphEvent = DiscoverEvent | VisitEvent | TraverseEdgeEvent | SpawnEvent | TransferEvent;
