/** Spacing steps available in @vhyxui/tokens (`--vhyx-space-*`). */
export type Space =
  | 0 | 0.5 | 1 | 1.5 | 2 | 2.5 | 3 | 3.5 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 12 | 14 | 16 | 20 | 24 | 32;

/** Viewport breakpoints shared by responsive layout props. sm 640px · md 768px · lg 1024px. */
export type Breakpoint = 'sm' | 'md' | 'lg';

/**
 * Converts a spacing step to its CSS variable, e.g. `2.5` → `var(--vhyx-space-2-5)`.
 * @example
 * spaceVar(4) // 'var(--vhyx-space-4)'
 */
export function spaceVar(step: Space): string {
  return `var(--vhyx-space-${String(step).replace('.', '-')})`;
}
