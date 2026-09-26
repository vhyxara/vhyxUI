# @vhyxui/tokens

VhyxUI design tokens as CSS custom properties: colour, typography, spacing,
radius, shadow and motion, with a light and dark theme.

> **Alpha** — token names may change before 1.0.

## Install

```bash
npm install @vhyxui/tokens
```

## Usage

```css
@import "@vhyxui/tokens/index.css"; /* tokens + reset */
```

| Entry | Contents |
|---|---|
| `@vhyxui/tokens` / `index.css` | Tokens and a minimal reset |
| `@vhyxui/tokens/tokens.css` | Tokens only, no reset (use with Tailwind's preflight or your own reset) |
| `@vhyxui/tokens/reset.css` | Reset only |
| `@vhyxui/tokens/dark.css` | Dark theme overrides |

All tokens use the `--vhyx-` prefix, e.g. `var(--vhyx-color-accent)`.

## Dark mode

Dark tokens apply under any of:

```html
<html data-theme="dark">    <!-- explicit -->
<html class="dark">         <!-- Tailwind convention -->
<html data-theme="system">  <!-- follows the OS setting -->
```

## Cascade layers

The reset is declared inside `@layer base`, so it never overrides your own
styles or Tailwind utilities.

## Links

- Documentation — https://vhyxui.com
- Source — https://github.com/vhyxara/vhyxUI/tree/main/packages/tokens
- License — MIT
