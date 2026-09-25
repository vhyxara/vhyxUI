import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { createRequire } from 'node:module';
import { compile } from 'tailwindcss';

const require = createRequire(import.meta.url);
const theme = readFileSync(join(__dirname, '..', 'theme.css'), 'utf8');

async function build(candidates: string[]): Promise<string> {
  const compiler = await compile(`@import "tailwindcss";\n${theme}`, {
    base: __dirname,
    async loadStylesheet(id: string, base: string) {
      const request = id === 'tailwindcss' ? 'tailwindcss/index.css' : id.startsWith('.') ? join(base, id) : id;
      const path = require.resolve(request, { paths: [base] });
      return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
    },
  });
  return compiler.build(candidates);
}

describe('@vhyxui/tailwind with a real Tailwind v4 compiler', () => {
  it('generates utilities that reference VhyxUI variables', async () => {
    const css = await build(['bg-accent', 'text-foreground-subtle', 'rounded-md', 'shadow-lg', 'dark:bg-surface']);
    expect(css).toContain('.bg-accent');
    expect(css).toContain('var(--vhyx-color-accent)');
    expect(css).toContain('var(--vhyx-color-text-subtle)');
    expect(css).toContain('var(--vhyx-radius-md)');
    expect(css).toMatch(/data-theme="dark"|data-theme=dark/);
  });

  it('places utilities in the utilities layer so they beat component styles', async () => {
    const css = await build(['p-4']);
    expect(css).toContain('@layer utilities');
  });
});
