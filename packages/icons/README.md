# @vhyxui/icons

SVG icons for VhyxUI — one set, every format: React components, framework-free SVG strings,
a `<vhyx-icon>` web component and a sprite sheet. Sizes and stroke come from design tokens,
motion is built in, and there are no runtime dependencies.

> **0.x** — icon names are stable; drawings are being refined.

## Install

```bash
npm install @vhyxui/icons
```

## React

```tsx
import { CheckIcon, TriangleAlertIcon, LoaderCircleIcon } from "@vhyxui/icons";

<CheckIcon />                                  {/* 1em, follows the text colour */}
<TriangleAlertIcon size="sm" title="Warning" />  {/* token size, announced to screen readers */}
<CheckIcon size={20} strokeWidth={1.5} />
<CheckIcon animate="draw" />                   {/* strokes draw in */}
<LoaderCircleIcon animate="spin" />
```

- **Size:** `xs | sm | md | lg | xl` map to `--vhyx-icon-size-*` tokens (12/16/20/24/32 px by default); numbers are pixels; any CSS length works. Default `1em`.
- **Stroke:** defaults to the `--vhyx-icon-stroke` token (2); override per icon with `strokeWidth`.
- **Accessibility:** icons are decorative (`aria-hidden`) unless you pass `title` or `aria-label`.
- **Motion:** `animate="draw" | "spin"` — import the styles once. Animations stop under `prefers-reduced-motion`.

```css
@import "@vhyxui/icons/style.css";
```

Every icon is its own export, so bundlers keep only the icons you use. Works in Server Components.

## Without React

```ts
import { toSvg, checkNode } from "@vhyxui/icons/svg";

element.innerHTML = toSvg(checkNode, { size: "sm", title: "Done" });
```

### Web component

```ts
import { defineIconElement } from "@vhyxui/icons/element";
defineIconElement();
```

```html
<vhyx-icon name="check" size="sm" label="Saved"></vhyx-icon>
<vhyx-icon name="loader-circle" animate="spin"></vhyx-icon>
```

`defineIconElement()` registers every icon. To ship fewer, pass your own map:
`defineIconElement("vhyx-icon", { check: checkNode })`.

### Sprite sheet and raw files

```html
<svg width="16" height="16"><use href="/sprite.svg#vhyx-icon-check" /></svg>
```

- `@vhyxui/icons/sprite.svg` — every icon as a `<symbol>`
- `@vhyxui/icons/icons/<name>.svg` — the source drawing of each icon
- `@vhyxui/icons/icons.json` — names, components, categories and search tags

## How the set is built

Each icon is a hand-checked SVG on a 24×24 grid in `icons/`, described in `icons/icons.json`.
The build validates every file (allowed shapes only, no hard-coded colours, a size budget) and
generates all formats from them. Icons may add an optical 16px drawing (`name.16.svg`) that is
used automatically at small sizes, and a filled variant (`name.solid.svg` → `NameSolidIcon`).

Every icon is an original Vhyxara drawing.

## Links

- Documentation — https://vhyxui.com
- Source — https://github.com/vhyxara/vhyxUI/tree/main/packages/icons
- License — MIT
