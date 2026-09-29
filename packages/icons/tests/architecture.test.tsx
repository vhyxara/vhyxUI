import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { readFileSync } from 'node:fs';
import * as React from '../src/index.js';
import { CheckIcon, LoaderCircleIcon, createIcon } from '../src/index.js';
import { checkNode, toSvg } from '../src/svg.js';
import { defineIconElement, iconNames, icons } from '../src/element.js';
// @ts-expect-error — plain ESM helper without types
import { loadIcons, parseSvg, toSprite, BUDGET } from '../scripts/lib.mjs';

import { resolve } from 'node:path';
const dir = resolve(process.cwd(), 'icons');

describe('source pipeline', () => {
  const all = loadIcons(dir);

  it('every source file is valid, listed in icons.json and within the size budget', () => {
    expect(all.length).toBe(iconNames.length);
    for (const i of all) expect(JSON.stringify(i.main.nodes).length).toBeLessThanOrEqual(BUDGET);
  });

  it('exports one React component per icon', () => {
    const components = Object.keys(React).filter((k) => /^[A-Z]\w*Icon$/.test(k));
    expect(components.length).toBe(all.length);
  });

  it('rejects groups, paint attributes and foreign grids', () => {
    expect(() => parseSvg('<svg viewBox="0 0 24 24"><g><path d="M0 0"/></g></svg>')).toThrow(/not allowed|unexpected/);
    expect(() => parseSvg('<svg viewBox="0 0 24 24"><path d="M0 0" stroke="red"/></svg>')).toThrow(/stroke/);
    expect(() => parseSvg('<svg viewBox="0 0 32 32"><path d="M0 0"/></svg>')).toThrow(/viewBox/);
    expect(() => parseSvg('<svg viewBox="0 0 24 24" fill="red"><path d="M0 0"/></svg>')).toThrow(/may only set/);
  });

  it('builds a sprite with one symbol per icon', () => {
    const sprite = toSprite(all);
    expect(sprite.match(/<symbol /g)?.length).toBe(all.length);
    expect(sprite).toContain('id="vhyx-icon-triangle-alert"');
  });

  it('contains only original Vhyxara drawings', () => {
    const meta = JSON.parse(readFileSync(resolve(dir, 'icons.json'), 'utf8'));
    for (const m of Object.values(meta.icons) as Array<{ source: string; category: string }>) {
      expect(m.source).toBe('vhyxara');
      expect(m.category).toBeTruthy();
    }
  });
});

describe('React components', () => {
  it('maps size tokens to CSS variables and keeps pixel sizes as attributes', () => {
    const { container, rerender } = render(<CheckIcon size="sm" />);
    let svg = container.querySelector('svg')!;
    expect(svg.style.width).toBe('var(--vhyx-icon-size-sm, 16px)');
    expect(svg.hasAttribute('width')).toBe(false);
    rerender(<CheckIcon size={20} />);
    svg = container.querySelector('svg')!;
    expect(svg.getAttribute('width')).toBe('20');
  });

  it('reads the stroke token unless a stroke width is given', () => {
    const { container } = render(<CheckIcon />);
    expect(container.querySelector('svg')!.style.strokeWidth).toBe('var(--vhyx-icon-stroke, 2)');
  });

  it('adds motion classes and normalised path lengths for the draw animation', () => {
    const { container } = render(<CheckIcon animate="draw" />);
    const svg = container.querySelector('svg')!;
    expect(svg.getAttribute('class')).toContain('vhyx-icon--draw');
    expect(svg.querySelector('path')!.getAttribute('pathLength')).toBe('1');
    const spin = render(<LoaderCircleIcon animate="spin" />).container.querySelector('svg')!;
    expect(spin.getAttribute('class')).toContain('vhyx-icon--spin');
  });

  it('switches to the optical 16px drawing at small sizes', () => {
    const Small = createIcon('SmallIcon', [['path', { d: 'M0 0h24' }]], { small: [['path', { d: 'M0 0h16' }]] });
    const big = render(<Small size="lg" />).container.querySelector('svg')!;
    expect(big.getAttribute('viewBox')).toBe('0 0 24 24');
    const small = render(<Small size="sm" />).container.querySelector('svg')!;
    expect(small.getAttribute('viewBox')).toBe('0 0 16 16');
    expect(small.querySelector('path')!.getAttribute('d')).toBe('M0 0h16');
  });

  it('renders solid variants with fill instead of strokes', () => {
    const Solid = createIcon('SolidIcon', [['circle', { cx: '12', cy: '12', r: '10' }]], { solid: true });
    const svg = render(<Solid />).container.querySelector('svg')!;
    expect(svg.getAttribute('fill')).toBe('currentColor');
    expect(svg.hasAttribute('stroke')).toBe(false);
  });
});

describe('framework-free SVG', () => {
  it('renders a decorative string by default', () => {
    const svg = toSvg(checkNode);
    expect(svg).toMatch(/^<svg [^>]*aria-hidden="true"/);
    expect(svg).toContain('stroke="currentColor"');
    expect(svg).toContain('<path d=');
  });

  it('labels and escapes titles', () => {
    const svg = toSvg(checkNode, { title: 'Done <now> & "ok"', size: 'md' });
    expect(svg).toContain('role="img"');
    expect(svg).toContain('<title>Done &lt;now&gt; &amp; &quot;ok&quot;</title>');
    expect(svg).toContain('width:var(--vhyx-icon-size-md, 20px)');
  });
});

describe('<vhyx-icon> web component', () => {
  it('renders icons by name and updates when attributes change', () => {
    defineIconElement();
    defineIconElement(); // idempotent
    const el = document.createElement('vhyx-icon');
    el.setAttribute('name', 'check');
    el.setAttribute('label', 'Saved');
    document.body.append(el);
    expect(el.querySelector('svg')?.getAttribute('aria-label')).toBe('Saved');
    el.setAttribute('name', 'x');
    expect(el.innerHTML).toContain(icons.x[0]![1].d!);
    el.setAttribute('name', 'does-not-exist');
    expect(el.innerHTML).toBe('');
    el.remove();
  });
});
