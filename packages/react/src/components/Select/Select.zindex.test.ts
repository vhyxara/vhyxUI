import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Select.Content's z-index is entirely token-driven (Select.tsx references
// var(--vhyx-z-dropdown), never a hardcoded number) — jsdom's getComputedStyle
// doesn't resolve CSS custom properties (confirmed by the existing tests in
// Select.test.tsx, which assert the unresolved 'var(--vhyx-z-dropdown)'
// string), so the real regression guard for finding #7 has to check the
// actual numeric ordering in the shipped token source, not a jsdom-rendered
// component. Reads the real file, not a hardcoded duplicate of its values,
// so a future edit to zindex.css that regresses the ordering fails this test
// immediately.
function readZIndexTokens(): string {
  return readFileSync(
    resolve(__dirname, '../../../../tokens/src/semantic/zindex.css'),
    'utf-8',
  );
}

function extractZIndex(css: string, tokenName: string): number {
  const match = css.match(new RegExp(`--${tokenName}:\\s*(-?\\d+)`));
  if (!match) throw new Error(`Token --${tokenName} not found in zindex.css`);
  return Number(match[1]);
}

describe('z-index tokens — --vhyx-z-dropdown must render above Dialog', () => {
  it('--vhyx-z-dropdown is numerically greater than --vhyx-z-overlay and --vhyx-z-modal', () => {
    const css = readZIndexTokens();
    const dropdown = extractZIndex(css, 'vhyx-z-dropdown');
    const overlay = extractZIndex(css, 'vhyx-z-overlay');
    const modal = extractZIndex(css, 'vhyx-z-modal');

    // Select.Content is portaled to document.body, same as Dialog.Content —
    // a dropdown opened inside a Dialog previously rendered behind both the
    // Dialog's overlay and its content because --vhyx-z-dropdown (100) sat
    // below --vhyx-z-overlay (300) and --vhyx-z-modal (400).
    expect(dropdown).toBeGreaterThan(overlay);
    expect(dropdown).toBeGreaterThan(modal);
  });

  it('--vhyx-z-dropdown stays below --vhyx-z-popover/-toast/-tooltip (not raised further than necessary)', () => {
    const css = readZIndexTokens();
    const dropdown = extractZIndex(css, 'vhyx-z-dropdown');
    const popover = extractZIndex(css, 'vhyx-z-popover');
    const toast = extractZIndex(css, 'vhyx-z-toast');
    const tooltip = extractZIndex(css, 'vhyx-z-tooltip');

    expect(dropdown).toBeLessThan(popover);
    expect(dropdown).toBeLessThan(toast);
    expect(dropdown).toBeLessThan(tooltip);
  });
});
