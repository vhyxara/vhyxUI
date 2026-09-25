import '@testing-library/jest-dom/vitest';
import { expect } from 'vitest';
// vitest-axe@0.1.0 matchers.d.ts uses 'export type *' — toHaveNoViolations is a real
// runtime function but TypeScript treats it as type-only. Import the dist file directly.
import { toHaveNoViolations } from 'vitest-axe/dist/matchers';

// Register vitest-axe matcher — vitest-axe@0.1.0 does not auto-extend via extend-expect
expect.extend({ toHaveNoViolations });
