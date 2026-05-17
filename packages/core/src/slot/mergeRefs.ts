import type React from 'react';

/**
 * Merges multiple React refs into a single callback ref.
 *
 * Handles RefObject (created by createRef/useRef) and callback refs.
 * Null and undefined entries are skipped safely.
 *
 * @param refs - Any number of React refs to merge. Null and undefined are accepted.
 * @returns A single callback ref that sets all provided refs when called.
 */
export function mergeRefs<T>(
  ...refs: ReadonlyArray<React.Ref<T> | null | undefined>
): React.RefCallback<T> {
  return (value: T | null): void => {
    for (const ref of refs) {
      if (ref === null || ref === undefined) continue;

      if (typeof ref === 'function') {
        ref(value);
      } else {
        // RefObject — the ref property is readonly in the public type but
        // must be mutated here to satisfy the contract React expects of a merged ref.
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    }
  };
}
