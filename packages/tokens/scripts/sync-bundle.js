const fs = require('fs')
const path = require('path')

// Source files in dependency order
const SRC_FILES = [
  'src/primitives/colors.css',
  'src/primitives/typography.css',
  'src/primitives/index.css',
  'src/semantic/colors.css',
  'src/semantic/typography.css',
  'src/semantic/spacing.css',
  'src/semantic/borders.css',
  'src/semantic/shadows.css',
  'src/semantic/motion.css',
  'src/semantic/zindex.css',
  'src/semantic/index.css',
  'src/themes/dark.css',
  'src/themes/index.css',
  'src/reset.css',
  'src/index.css',
]

const root = path.join(__dirname, '..')
const header = '/* AUTO-GENERATED — do not edit directly.\n' +
  '   Run pnpm --filter @vhyxui/tokens sync to regenerate.\n' +
  '   Source files are in packages/tokens/src/\n */\n\n'

let output = header
for (const file of SRC_FILES) {
  const content = fs.readFileSync(path.join(root, file), 'utf8')
  // Remove @import statements — we are inlining everything
  const stripped = content.replace(/@import[^;]+;/g, '').trim()
  if (stripped) {
    output += `/* === ${file} === */\n${stripped}\n\n`
  }
}

fs.writeFileSync(path.join(root, 'index.css'), output)
console.log('Token bundle synced.')
