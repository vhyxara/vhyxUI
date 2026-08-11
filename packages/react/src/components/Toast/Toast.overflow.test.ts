import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// The toast region's width is entirely CSS-driven (position: fixed, anchored
// to a viewport corner) — jsdom doesn't apply stylesheets at all, so there's
// no rendered layout to assert against (confirmed by this package's own
// Select.zindex.test.ts, which hit the same limitation for a different
// token). The real regression guard reads the actual shipped
// Toast.module.css and checks the real invariant: the region's own
// `max-width` must be at least as large as each toast's `min-width`, or a
// flex child's min-width (which always wins over a shrinking container)
// pushes the rendered toast wider than the region box it's positioned
// relative to — and since the region already sits close to the viewport
// edge, that overflow renders off-screen, not just visually cramped.
function readToastCss(): string {
  return readFileSync(resolve(__dirname, './Toast.module.css'), 'utf-8');
}

function readSpacingTokens(): string {
  return readFileSync(
    resolve(__dirname, '../../../../tokens/src/semantic/spacing.css'),
    'utf-8',
  );
}

/** Resolves a CSS width value (a literal `Nrem`, or `var(--vhyx-space-N)`) to a px number. */
function resolveWidthPx(value: string, spacingCss: string): number {
  const remMatch = value.match(/^(\d+(?:\.\d+)?)rem$/);
  if (remMatch) return Number(remMatch[1]) * 16;

  const varMatch = value.match(/^var\((--[\w-]+)\)$/);
  if (varMatch) {
    const tokenMatch = spacingCss.match(new RegExp(`${varMatch[1]}:\\s*(\\d+(?:\\.\\d+)?)rem`));
    if (!tokenMatch) throw new Error(`Token ${varMatch[1]} not found in spacing.css`);
    return Number(tokenMatch[1]) * 16;
  }

  throw new Error(`Unrecognized width value: ${value}`);
}

function extractDeclaration(css: string, selector: string, property: string): string {
  const selectorIndex = css.indexOf(selector);
  if (selectorIndex === -1) throw new Error(`Selector ${selector} not found`);
  const blockStart = css.indexOf('{', selectorIndex);
  const blockEnd = css.indexOf('}', blockStart);
  const block = css.slice(blockStart, blockEnd);
  const match = block.match(new RegExp(`${property}:\\s*([^;]+);`));
  if (!match) throw new Error(`Property ${property} not found in ${selector}'s block`);
  return match[1].trim();
}

describe('Toast — region max-width must not be smaller than a toast item\'s own min-width', () => {
  it('resolves to a region max-width >= the toast min-width, so a real toast never overflows its own positioned region off-screen', () => {
    const toastCss = readToastCss();
    const spacingCss = readSpacingTokens();

    const regionMaxWidth = extractDeclaration(toastCss, '.region {', 'max-width');
    const toastMinWidth = extractDeclaration(toastCss, '.toast {', 'min-width');

    const regionMaxWidthPx = resolveWidthPx(regionMaxWidth, spacingCss);
    const toastMinWidthPx = resolveWidthPx(toastMinWidth, spacingCss);

    // Pre-fix: .region's max-width resolved to var(--vhyx-space-32) = 8rem
    // (128px) — the largest token in the spacing scale, but still smaller
    // than .toast's own hardcoded 18rem (288px) min-width. A real toast
    // (confirmed live, playground repro at data-position="bottom-right")
    // rendered 144px past the browser's right edge as a direct result.
    expect(regionMaxWidthPx).toBeGreaterThanOrEqual(toastMinWidthPx);
  });
});
