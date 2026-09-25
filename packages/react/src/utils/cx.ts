/** A value accepted by {@link cx}: strings are kept, falsy values dropped, objects keep truthy keys. */
export type ClassValue = string | number | false | null | undefined | Record<string, boolean | null | undefined> | ClassValue[];

/**
 * Joins class names, skipping falsy values. Tiny `clsx` equivalent with zero dependencies.
 *
 * Works with Tailwind: component styles live in `@layer components`, so any
 * utility you pass through `className` wins without `!important`.
 *
 * @example
 * cx('p-4', isActive && 'bg-accent', { 'opacity-50': disabled })
 */
export function cx(...values: ClassValue[]): string {
  const out: string[] = [];
  const push = (value: ClassValue): void => {
    if (!value && value !== 0) return;
    if (typeof value === 'string' || typeof value === 'number') {
      out.push(String(value));
    } else if (Array.isArray(value)) {
      value.forEach(push);
    } else {
      for (const [key, on] of Object.entries(value)) if (on) out.push(key);
    }
  };
  values.forEach(push);
  return out.join(' ');
}
