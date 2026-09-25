import type { AxeMatchers } from 'vitest-axe/matchers';

declare module 'vitest' {
  // Augment Vitest's Assertion type so toHaveNoViolations is recognized.
  interface Assertion extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
