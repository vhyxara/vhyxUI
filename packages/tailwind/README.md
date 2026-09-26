# @vhyxui/tailwind

Use VhyxUI design tokens as Tailwind utilities — `bg-accent`, `text-foreground-subtle`,
`border-border`, `bg-success-subtle`, `rounded-md`, `duration-fast` and more.
Utilities read CSS variables, so they follow theme switches without a rebuild.

> **Alpha** — utility names may change before 1.0.

## Install

```bash
npm install -D @vhyxui/tailwind
npm install @vhyxui/tokens
```

## Tailwind v4

```css
@import "tailwindcss";
@import "@vhyxui/tailwind/theme.css";
@import "@vhyxui/tokens/tokens.css";
@import "@vhyxui/react/style.css"; /* if you use @vhyxui/react */
```

## Tailwind v3

```js
// tailwind.config.js
module.exports = {
  presets: [require("@vhyxui/tailwind")],
  content: ["./src/**/*.{ts,tsx}"],
};
```

The v3 preset turns off Tailwind's preflight, because `@vhyxui/tokens` ships its
own reset in `@layer base`.

## Dark mode

The `dark:` variant matches both `[data-theme="dark"]` and `.dark`.

## Links

- Documentation — https://vhyxui.com
- Source — https://github.com/vhyxara/vhyxUI/tree/main/packages/tailwind
- License — MIT
