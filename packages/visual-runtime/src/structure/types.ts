/**
 * Structure schema — Section 10 of visual-runtime-architecture.md.
 *
 * Frozen at authoring time (I-001). A Structure carries topology and
 * identity only — never values, never mutable state. Runtime state is
 * layered on top of a Structure, never inside it.
 */

export interface SequenceEntity {
  readonly id: string;
  readonly position: number;
}

export interface GraphNode {
  readonly id: string;
}

/** Directed: an edge represents `from -> to` only, the reverse does not exist unless separately declared. */
export interface GraphEdge {
  readonly id: string;
  readonly from: string;
  readonly to: string;
}

export interface SequenceStructure {
  readonly type: 'sequence';
  readonly entities: readonly SequenceEntity[];
}

export interface GraphStructure {
  readonly type: 'graph';
  readonly nodes: readonly GraphNode[];
  readonly edges: readonly GraphEdge[];
}

export type Structure = SequenceStructure | GraphStructure;
