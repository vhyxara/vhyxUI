import type { GraphStructure } from '../structure/types';
import type { GraphEvent } from '../events/types';
import { assertInvariant } from './invariant';

/**
 * Pattern B (graph/flow): nodes carry only transient traversal state
 * (`discovered`, proven persistent by the BFS/DFS discover-once
 * invariant). Messages are an independent entity registry with a
 * `location` attribute referencing a node id — never stored on the node
 * itself (v0.5's system-flow finding: storing a value directly on a node
 * silently overwrites a prior message with no error).
 *
 * `visit` and `traverseEdge` are implemented as non-mutating/transient here
 * (recorded to history only). This is a deliberate, conservative reading,
 * not a settled architectural claim: only `discover`'s persistence is
 * directly evidenced by a spike (the discover-once invariant test); nothing
 * in the experiments proves `visited` or "currently traversing edge X" must
 * persist. If a future experiment proves otherwise, this should change.
 */
export interface GraphNodeState {
  readonly discovered: boolean;
}

export interface MessageState {
  readonly id: string;
  readonly location: string;
}

export interface GraphRuntimeState {
  readonly nodes: Readonly<Record<string, GraphNodeState>>;
  readonly messages: Readonly<Record<string, MessageState>>;
}

export interface GraphRuntime {
  getState(): GraphRuntimeState;
  getHistory(): readonly GraphEvent[];
  /** Rejected if `node` was already discovered (discover-once, proven). */
  discover(node: string): void;
  /** Non-mutating — see module doc. */
  visit(node: string): void;
  /** Non-mutating — see module doc. */
  traverseEdge(edge: string): void;
  /** Creates a new message entity located at `node`. Rejected if `message` id already exists. */
  spawn(message: string, node: string): void;
  /** Moves `message` across `edge`. Rejected unless `edge.from === message.location` (proven). */
  transfer(message: string, edge: string): void;
}

export function createGraphRuntime(structure: GraphStructure): GraphRuntime {
  const nodeIds = new Set(structure.nodes.map((node) => node.id));
  const edgesById = new Map(structure.edges.map((edge) => [edge.id, edge]));

  const discovered = new Set<string>();
  const messages = new Map<string, MessageState>();
  const history: GraphEvent[] = [];

  function requireNode(id: string): void {
    assertInvariant(nodeIds.has(id), `Unknown node "${id}"`, { id });
  }

  function requireEdge(id: string) {
    const edge = edgesById.get(id);
    assertInvariant(edge !== undefined, `Unknown edge "${id}"`, { id });
    return edge!;
  }

  function requireMessage(id: string): MessageState {
    const message = messages.get(id);
    assertInvariant(message !== undefined, `Unknown message "${id}"`, { id });
    return message as MessageState;
  }

  function snapshot(): GraphRuntimeState {
    const nodeState: Record<string, GraphNodeState> = {};
    for (const id of nodeIds) {
      nodeState[id] = Object.freeze({ discovered: discovered.has(id) });
    }
    const messageState: Record<string, MessageState> = {};
    for (const [id, message] of messages) {
      messageState[id] = Object.freeze({ ...message });
    }
    return Object.freeze({ nodes: Object.freeze(nodeState), messages: Object.freeze(messageState) });
  }

  return {
    getState: snapshot,
    getHistory: () => [...history],

    discover(node) {
      requireNode(node);
      assertInvariant(!discovered.has(node), `Node "${node}" is already discovered`, { node });

      discovered.add(node);
      history.push({ type: 'discover', node });
    },

    visit(node) {
      requireNode(node);
      history.push({ type: 'visit', node });
    },

    traverseEdge(edge) {
      requireEdge(edge);
      history.push({ type: 'traverseEdge', edge });
    },

    spawn(message, node) {
      requireNode(node);
      assertInvariant(!messages.has(message), `Message "${message}" already exists`, { message });

      messages.set(message, { id: message, location: node });
      history.push({ type: 'spawn', message, node });
    },

    transfer(message, edge) {
      const existingMessage = requireMessage(message);
      const existingEdge = requireEdge(edge);
      assertInvariant(
        existingEdge.from === existingMessage.location,
        `Message "${message}" is not at edge "${edge}"'s origin`,
        { message, edge, expected: existingEdge.from, actual: existingMessage.location },
      );

      messages.set(message, { ...existingMessage, location: existingEdge.to });
      history.push({ type: 'transfer', message, edge });
    },
  };
}
