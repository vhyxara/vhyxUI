import { VhyxUIError, VhyxUIErrorCode } from '@vhyxui/core';

/**
 * Shared rejection plumbing for both Runtime patterns (sequence and graph).
 * This is the ONLY thing sequenceRuntime and graphRuntime share — it is
 * error/invariant infrastructure, not a unified runtime state
 * representation, and must not become one.
 *
 * Callers must invoke this for every precondition BEFORE performing any
 * mutation (validate-then-commit) so a rejected event leaves state
 * completely unchanged — there is no mutation step to roll back.
 */
export function assertInvariant(
  condition: boolean,
  message: string,
  context?: Record<string, unknown>,
): asserts condition {
  if (!condition) {
    throw new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_RUNTIME_INVARIANT_VIOLATION,
      message,
      ...(context !== undefined ? { context } : {}),
    });
  }
}
