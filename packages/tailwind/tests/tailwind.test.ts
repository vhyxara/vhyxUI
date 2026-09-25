import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';

const require = createRequire(import.meta.url);
const root = join(__dirname, '..');
const preset = require('../preset.cjs') as {
  corePlugins: { preflight: boolean };
  theme: { extend: { colors: Record<string, string>; borderRadius: Record<string, string> } };
};
const tokens = readFileSync(join(root, '../tokens/tokens.css'), 'utf8');
const theme = readFileSync(join(root, 'theme.css'), 'utf8');

describe('@vhyxui/tailwind', () => {
  it('v3 preset maps colors to VhyxUI variables and disables preflight', () => {
    expect(preset.theme.extend.colors['accent']).toBe('var(--vhyx-color-accent)');
    expect(preset.theme.extend.borderRadius['md']).toBe('var(--vhyx-radius-md)');
    expect(preset.corePlugins.preflight).toBe(false);
  });

  it('every referenced variable exists in @vhyxui/tokens', () => {
    const referenced = new Set([...theme.matchAll(/var\((--vhyx-[a-z0-9-]+)\)/g)].map((m) => m[1]));
    const missing = [...referenced].filter((v) => !tokens.includes(`${v}:`));
    expect(missing).toEqual([]);
  });

  it('v4 theme declares inline theme and a dark variant', () => {
    expect(theme).toContain('@theme inline');
    expect(theme).toContain('@custom-variant dark');
    expect(theme).toContain('--color-foreground: var(--vhyx-color-text);');
  });
});
