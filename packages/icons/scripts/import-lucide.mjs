// Transition importer: writes icons/*.svg and icons/icons.json for icons whose artwork still comes
// from Lucide (ISC, see NOTICE). Once every icon is redrawn by Vhyxara this script and the
// lucide-static devDependency are deleted. Never overwrites icons whose source is "vhyxara".
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { toSvgFile } from './lib.mjs';

const require = createRequire(import.meta.url);
const nodes = JSON.parse(readFileSync(require.resolve('lucide-static/icon-nodes.json'), 'utf8'));
const tagsFile = require.resolve('lucide-static/tags.json');
const lucideTags = existsSync(tagsFile) ? JSON.parse(readFileSync(tagsFile, 'utf8')) : {};

// Our icon name → [Lucide source name, category].
const IMPORT = {
  check: ['check', 'status'], x: ['x', 'status'], info: ['info', 'status'], 'triangle-alert': ['triangle-alert', 'status'],
  'circle-check': ['circle-check', 'status'], 'circle-x': ['circle-x', 'status'], 'circle-alert': ['circle-alert', 'status'],
  'loader-circle': ['loader-circle', 'status'],
  menu: ['menu', 'navigation'], search: ['search', 'actions'], copy: ['copy', 'actions'], plus: ['plus', 'actions'], minus: ['minus', 'actions'],
  trash: ['trash', 'actions'], 'arrow-right': ['arrow-right', 'navigation'], 'arrow-up': ['arrow-up', 'navigation'],
  'arrow-down': ['arrow-down', 'navigation'], 'arrow-up-down': ['arrow-up-down', 'navigation'],
  'trending-up': ['trending-up', 'data'], 'trending-down': ['trending-down', 'data'],
  'external-link': ['external-link', 'navigation'], 'chevron-down': ['chevron-down', 'navigation'], 'chevron-right': ['chevron-right', 'navigation'],
  'chevron-left': ['chevron-left', 'navigation'], 'chevron-up': ['chevron-up', 'navigation'],
  settings: ['settings', 'actions'], mail: ['mail', 'communication'], inbox: ['inbox', 'communication'], star: ['star', 'actions'],
  smile: ['face-slightly-smiling', 'people'], sun: ['sun', 'theme'], moon: ['moon', 'theme'],
  play: ['play', 'media'], pause: ['pause', 'media'], 'skip-back': ['skip-back', 'media'], 'circle-play': ['circle-play', 'media'],
  'image-play': ['image-play', 'media'],
  accessibility: ['accessibility', 'people'], activity: ['activity', 'data'], blocks: ['blocks', 'development'], bot: ['bot', 'development'],
  brush: ['brush', 'design'], bug: ['bug', 'development'], code: ['code', 'development'], coins: ['coins', 'commerce'],
  'eye-off': ['eye-off', 'security'], feather: ['feather', 'design'], 'git-branch': ['git-branch', 'development'], laptop: ['laptop', 'devices'],
  layers: ['layers', 'design'], 'life-buoy': ['life-buoy', 'communication'], lock: ['lock', 'security'], package: ['package', 'development'],
  palette: ['palette', 'design'], 'pen-line': ['pen-line', 'design'], puzzle: ['puzzle', 'development'], rocket: ['rocket', 'development'],
  'shield-check': ['shield-check', 'security'], sparkles: ['sparkles', 'design'], stethoscope: ['stethoscope', 'status'],
  ticket: ['ticket', 'commerce'], waves: ['waves-horizontal', 'data'], workflow: ['workflow', 'development'], zap: ['zap', 'actions'],
};

const dir = new URL('../icons/', import.meta.url);
const metaFile = new URL('icons.json', dir);
const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, 'utf8')) : { $schema: 'Icon metadata: category, search tags and artwork source (lucide = transition artwork, vhyxara = our own drawing).', icons: {} };
let written = 0;
for (const [name, [src, category]] of Object.entries(IMPORT)) {
  if (meta.icons[name]?.source === 'vhyxara') continue;
  if (!nodes[src]) throw new Error(`Unknown Lucide icon: ${src}`);
  const shapes = nodes[src].map(([tag, attrs]) => [tag, Object.fromEntries(Object.entries(attrs).filter(([k]) => k !== 'key'))]);
  writeFileSync(new URL(`${name}.svg`, dir), toSvgFile(shapes));
  const tags = [...new Set([...(lucideTags[src] ?? []), ...name.split('-')])].filter((t) => t !== name).slice(0, 12);
  meta.icons[name] = { category, tags, source: 'lucide' };
  written++;
}
meta.icons = Object.fromEntries(Object.entries(meta.icons).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(metaFile, JSON.stringify(meta, null, 2) + '\n');
console.log(`Imported ${written} icons from Lucide`);
