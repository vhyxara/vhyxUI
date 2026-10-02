// Shared helpers for the icon pipeline: parse and validate SVG sources, name conversions,
// and serialisers for SVG files and the sprite sheet.
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { checkKeylines } from './geometry.mjs';

export const GRID = '0 0 24 24';
export const SMALL_GRID = '0 0 16 16';
/** Elements and attributes an icon source may use. Everything else is rejected. */
export const ALLOWED = {
  path: ['d'],
  circle: ['cx', 'cy', 'r'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  rect: ['x', 'y', 'width', 'height', 'rx', 'ry'],
  line: ['x1', 'y1', 'x2', 'y2'],
  polyline: ['points'],
  polygon: ['points'],
};
/** Maximum bytes of geometry per icon drawing — keeps every icon tiny. */
export const BUDGET = 1600;

export const toPascal = (name) => name.split('-').map((p) => p[0].toUpperCase() + p.slice(1)).join('');
export const toCamel = (name) => { const p = toPascal(name); return p[0].toLowerCase() + p.slice(1); };
export const componentName = (name, variant = '') => `${toPascal(name)}${variant === 'solid' ? 'Solid' : ''}Icon`;
export const nodeName = (name, variant = '') => `${toCamel(name)}${variant === 'solid' ? 'Solid' : variant === 'small' ? 'Small' : ''}Node`;

/** Parses one icon source file into `{ viewBox, nodes }`, throwing on anything outside the allowed subset. */
export function parseSvg(text, file = 'icon') {
  const root = text.match(/<svg\b([^>]*)>([\s\S]*)<\/svg>/);
  if (!root) throw new Error(`${file}: not an <svg> document`);
  const rootAttrs = Object.fromEntries([...root[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
  const viewBox = rootAttrs.viewBox;
  if (viewBox !== GRID && viewBox !== SMALL_GRID) throw new Error(`${file}: viewBox must be "${GRID}" or "${SMALL_GRID}"`);
  const extra = Object.keys(rootAttrs).filter((k) => k !== 'viewBox' && k !== 'xmlns');
  if (extra.length) throw new Error(`${file}: <svg> may only set viewBox and xmlns (found ${extra.join(', ')})`);
  const body = root[2].replace(/<!--[\s\S]*?-->/g, '').trim();
  const nodes = [];
  const leftover = body.replace(/<(\w+)\b([^>]*?)\/>/g, (_, tag, attrs) => {
    if (!ALLOWED[tag]) throw new Error(`${file}: <${tag}> is not allowed (use ${Object.keys(ALLOWED).join(', ')})`);
    const a = Object.fromEntries([...attrs.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1], m[2]]));
    // `fill` is allowed only to mark filled detail shapes (dots) that follow currentColor.
    const bad = Object.keys(a).filter((k) => !ALLOWED[tag].includes(k) && !(k === 'fill' && (a[k] === 'currentColor' || a[k] === 'none')));
    if (bad.length) throw new Error(`${file}: <${tag}> attribute(s) ${bad.join(', ')} not allowed — colour, stroke and style come from the component`);
    nodes.push([tag, a]);
    return '';
  });
  if (leftover.trim()) throw new Error(`${file}: unexpected content "${leftover.trim().slice(0, 40)}" (only self-closing shapes are allowed)`);
  if (!nodes.length) throw new Error(`${file}: no shapes`);
  const size = JSON.stringify(nodes).length;
  if (size > BUDGET) throw new Error(`${file}: ${size} bytes of geometry exceeds the ${BUDGET}-byte budget`);
  return { viewBox, nodes };
}

/** Serialises shapes to a normalised source file. */
export function toSvgFile(nodes, viewBox = GRID) {
  const shapes = nodes.map(([tag, attrs]) => `  <${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">\n${shapes.join('\n')}\n</svg>\n`;
}

/** Reads icons/icons.json and every source file, returning validated icon records sorted by name. */
export function loadIcons(dir) {
  const meta = JSON.parse(readFileSync(join(dir, 'icons.json'), 'utf8'));
  const files = new Set(readdirSync(dir).filter((f) => f.endsWith('.svg')));
  const offGrid = [];
  const icons = Object.entries(meta.icons).sort(([a], [b]) => a.localeCompare(b)).map(([name, m]) => {
    if (!/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/.test(name)) throw new Error(`icons.json: "${name}" must be kebab-case`);
    const read = (suffix) => {
      const f = `${name}${suffix}.svg`;
      if (!files.has(f)) return undefined;
      files.delete(f);
      return parseSvg(readFileSync(join(dir, f), 'utf8'), f);
    };
    const main = read('');
    if (!main) throw new Error(`icons.json lists "${name}" but icons/${name}.svg is missing`);
    if (main.viewBox !== GRID) throw new Error(`${name}.svg: the main drawing must use the 24×24 grid`);
    const small = read('.16');
    if (small && small.viewBox !== SMALL_GRID) throw new Error(`${name}.16.svg: optical 16px drawings use the 16×16 grid`);
    const solid = read('.solid');
    for (const problem of checkKeylines(main.nodes, m.waive)) offGrid.push(`${name}.svg ${problem}`);
    return { name, category: m.category, tags: m.tags ?? [], source: m.source ?? 'vhyxara', main, small, solid };
  });
  if (files.size) throw new Error(`icons/ has files not listed in icons.json: ${[...files].join(', ')}`);
  if (offGrid.length) throw new Error(`Icons break the keyline rules (scripts/geometry.mjs):\n  ${offGrid.join('\n  ')}`);
  return icons;
}

/** One `<symbol>` per icon drawing, for `<use href="sprite.svg#vhyx-icon-name">`. */
export function toSprite(icons) {
  const symbol = (id, { viewBox, nodes }, solid = false) => {
    const paint = solid ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
    const shapes = nodes.map(([tag, a]) => `<${tag} ${Object.entries(a).map(([k, v]) => `${k}="${v}"`).join(' ')}/>`).join('');
    return `<symbol id="vhyx-icon-${id}" viewBox="${viewBox}" ${paint}>${shapes}</symbol>`;
  };
  const symbols = icons.flatMap((i) => [symbol(i.name, i.main), ...(i.solid ? [symbol(`${i.name}-solid`, i.solid, true)] : [])]);
  return `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${symbols.join('')}</svg>\n`;
}

export const exists = existsSync;
