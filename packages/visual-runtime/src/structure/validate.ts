import { VhyxUIError, VhyxUIErrorCode } from '@vhyxui/core';
import type { GraphEdge, GraphNode, GraphStructure, SequenceEntity, SequenceStructure } from './types';

function invalid(message: string, context?: Record<string, unknown>): never {
  throw new VhyxUIError({
    code: VhyxUIErrorCode.VHYXUI_STRUCTURE_INVALID,
    message,
    ...(context !== undefined ? { context } : {}),
  });
}

/**
 * Constructs a sequence Structure, rejecting duplicate entity ids, and
 * freezes it so nothing downstream can mutate topology after construction
 * (I-001).
 */
export function createSequenceStructure(entities: readonly SequenceEntity[]): SequenceStructure {
  const seen = new Set<string>();
  for (const entity of entities) {
    if (seen.has(entity.id)) {
      invalid(`Duplicate sequence entity id "${entity.id}"`, { id: entity.id });
    }
    seen.add(entity.id);
  }

  const frozenEntities = Object.freeze(entities.map((entity) => Object.freeze({ ...entity })));
  return Object.freeze({ type: 'sequence', entities: frozenEntities });
}

/**
 * Constructs a directed graph Structure. Rejects duplicate node/edge ids
 * and edges referencing nodes that don't exist, then freezes the result
 * (I-001).
 */
export function createGraphStructure(
  nodes: readonly GraphNode[],
  edges: readonly GraphEdge[],
): GraphStructure {
  const nodeIds = new Set<string>();
  for (const node of nodes) {
    if (nodeIds.has(node.id)) {
      invalid(`Duplicate graph node id "${node.id}"`, { id: node.id });
    }
    nodeIds.add(node.id);
  }

  const edgeIds = new Set<string>();
  for (const edge of edges) {
    if (edgeIds.has(edge.id)) {
      invalid(`Duplicate graph edge id "${edge.id}"`, { id: edge.id });
    }
    edgeIds.add(edge.id);

    if (!nodeIds.has(edge.from)) {
      invalid(`Edge "${edge.id}" references unknown "from" node "${edge.from}"`, {
        edge: edge.id,
        from: edge.from,
      });
    }
    if (!nodeIds.has(edge.to)) {
      invalid(`Edge "${edge.id}" references unknown "to" node "${edge.to}"`, {
        edge: edge.id,
        to: edge.to,
      });
    }
  }

  const frozenNodes = Object.freeze(nodes.map((node) => Object.freeze({ ...node })));
  const frozenEdges = Object.freeze(edges.map((edge) => Object.freeze({ ...edge })));
  return Object.freeze({ type: 'graph', nodes: frozenNodes, edges: frozenEdges });
}
