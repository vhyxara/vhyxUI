import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// CSS Modules renames every `animation` name to a scoped identifier, and only keyframes declared in the same
// module file are renamed to match. A rule that names a keyframe declared elsewhere (for example the global
// motion keyframes in @vhyxui/tokens) ships pointing at a name with no @keyframes behind it, and silently never
// animates. That broke every overlay's motion once; this guards each module against it.
const componentsDir = resolve(__dirname, '..');

function moduleFiles(): string[] {
  return readdirSync(componentsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) =>
      readdirSync(resolve(componentsDir, d.name))
        .filter((f) => f.endsWith('.module.css'))
        .map((f) => resolve(componentsDir, d.name, f)),
    );
}

const NOT_NAMES = new Set(['none', 'both', 'forwards', 'backwards', 'infinite', 'linear', 'alternate', 'reverse', 'normal', 'running', 'paused']);

function animationNames(css: string): string[] {
  const names: string[] = [];
  for (const m of css.matchAll(/animation(?:-name)?\s*:\s*([^;]+);/g)) {
    for (const part of (m[1] ?? '').split(',')) {
      // Strip var(...)/calc(...) so their contents are not mistaken for names.
      const first = part.replace(/[a-z-]+\([^)]*\)\)?/g, ' ').trim().split(/\s+/)[0];
      if (first && /^[a-z][\w-]*$/i.test(first) && !NOT_NAMES.has(first)) names.push(first);
    }
  }
  return names;
}

describe('component CSS modules', () => {
  it.each(moduleFiles().map((f) => [f.slice(componentsDir.length + 1), f]))(
    '%s declares every keyframe it animates',
    (_label, file) => {
      const css = readFileSync(file, 'utf-8').replace(/\/\*[\s\S]*?\*\//g, '');
      const declared = new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1]));
      const missing = animationNames(css).filter((n) => !declared.has(n));
      expect(missing).toEqual([]);
    },
  );
});
