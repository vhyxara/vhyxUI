const fs = require('fs')
const path = require('path')

/*
 * Builds the published CSS bundles from src/.
 *
 *   index.css   tokens + dark theme + reset          (drop-in, zero config)
 *   tokens.css  tokens + dark theme, NO reset         (use with Tailwind preflight or your own reset)
 *   reset.css   reset only
 *
 * Cascade layers (DECISION-UI-004): the reset lives in `@layer base` so that
 * Tailwind v4 utilities (`@layer utilities`) and any unlayered app CSS always
 * win over it. Custom properties stay unlayered — they are namespaced
 * (`--vhyx-*`) and never collide with utilities.
 *
 * Dark mode is available three ways, all generated from src/themes/dark.css:
 *   <html data-theme="dark">                    explicit
 *   <html class="dark">                         Tailwind `darkMode: 'class'` convention
 *   <html data-theme="system">                  follow the OS via prefers-color-scheme
 */

const root = path.join(__dirname, '..')
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8').replace(/@import[^;]+;/g, '').trim()

const LAYER_ORDER = '@layer theme, base, components, utilities;'

const TOKEN_FILES = [
  'src/primitives/colors.css',
  'src/primitives/typography.css',
  'src/semantic/colors.css',
  'src/semantic/typography.css',
  'src/semantic/spacing.css',
  'src/semantic/borders.css',
  'src/semantic/shadows.css',
  'src/semantic/motion.css',
  'src/semantic/zindex.css',
]

const header =
  '/* AUTO-GENERATED — do not edit directly.\n' +
  '   Run pnpm --filter @vhyxui/tokens sync to regenerate.\n' +
  '   Source files are in packages/tokens/src/\n */\n\n'

function darkTheme() {
  const source = read('src/themes/dark.css')
  const match = source.match(/\[data-theme="dark"\]\s*\{([\s\S]*)\}\s*$/)
  if (!match) throw new Error('src/themes/dark.css must contain a single [data-theme="dark"] { ... } block')
  const body = match[1].replace(/\s+$/, '')
  return (
    `/* === src/themes/dark.css === */\n` +
    `[data-theme="dark"],\n.dark {\n  color-scheme: dark;${body}\n}\n\n` +
    `@media (prefers-color-scheme: dark) {\n  [data-theme="system"] {\n    color-scheme: dark;${body.replace(/\n/g, '\n  ')}\n  }\n}\n`
  )
}

function tokens() {
  return TOKEN_FILES.map((file) => `/* === ${file} === */\n${read(file)}\n`).join('\n') + '\n' + darkTheme()
}

function reset() {
  const body = read('src/reset.css').replace(/\n/g, '\n  ')
  return `/* === src/reset.css (layered: utilities and app CSS always win) === */\n${LAYER_ORDER}\n@layer base {\n  ${body}\n}\n`
}

fs.writeFileSync(path.join(root, 'tokens.css'), header + tokens())
fs.writeFileSync(path.join(root, 'reset.css'), header + reset())
fs.writeFileSync(path.join(root, 'index.css'), header + tokens() + '\n' + reset())
console.log('Token bundles synced: index.css, tokens.css, reset.css')
