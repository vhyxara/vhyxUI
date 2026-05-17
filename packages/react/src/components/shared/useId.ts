import { useId as useReactId } from 'react';

/**
 * Generates a stable, unique, prefixed ID for label/input association.
 *
 * Wraps React 18's built-in useId hook. Zero external dependency.
 * The generated ID is stable across renders and unique per component instance.
 *
 * @param prefix - Optional prefix prepended before the React-generated ID.
 *   Defaults to 'vhyx'. Use this to differentiate IDs by component type.
 * @returns A stable string of the form `{prefix}-{reactId}`.
 *
 * @example
 * const id = useId(); // "vhyx-:r0:"
 * const labelId = useId('vhyx-input'); // "vhyx-input-:r1:"
 */
export function useId(prefix: string = 'vhyx'): string {
  const id = useReactId();
  return `${prefix}-${id}`;
}
