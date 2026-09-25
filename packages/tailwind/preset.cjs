/**
 * @vhyxui/tailwind — Tailwind CSS v3 preset.
 *
 *   // tailwind.config.js
 *   module.exports = { presets: [require('@vhyxui/tailwind')], content: [...] }
 *
 * Every value points at a VhyxUI CSS variable, so utilities follow the active
 * theme (light/dark/custom) with zero rebuilds: `bg-accent`, `text-foreground-subtle`,
 * `border-border`, `rounded-md`, `shadow-lg`, `ease-standard`, `duration-fast`.
 */
const { colors, radius, shadow, font, ease, duration } = require('./colors.js');

const mapVars = (map, prefix) =>
  Object.fromEntries(Object.entries(map).map(([k, v]) => [k, `var(--vhyx-${prefix}-${v})`]));

module.exports = {
  // Tailwind v3 preflight is unlayered and would override VhyxUI's layered
  // component styles (e.g. reset every button background). @vhyxui/tokens
  // ships its own reset inside `@layer base`, so preflight is not needed.
  corePlugins: { preflight: false },
  darkMode: ['variant', ['&:where([data-theme="dark"], [data-theme="dark"] *)', '&:where(.dark, .dark *)']],
  theme: {
    extend: {
      colors: Object.fromEntries(Object.entries(colors).map(([k, v]) => [k, `var(${v})`])),
      borderRadius: mapVars(radius, 'radius'),
      boxShadow: mapVars(shadow, 'shadow'),
      fontFamily: mapVars(font, 'font'),
      transitionTimingFunction: mapVars(ease, 'easing'),
      transitionDuration: mapVars(duration, 'duration'),
    },
  },
};
