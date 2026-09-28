# VhyxUI

**Accessible React components that AI agents can understand.**

VhyxUI is a React component library in four layers, shipped together:

1. **Visual** — components styled with CSS Modules on top of design tokens; works with plain CSS and Tailwind v3/v4
2. **Accessibility** — keyboard, focus, ARIA and reduced motion, tested with axe
3. **Motion** — duration and easing tokens for state changes
4. **Agent contracts** — every interactive component describes what it does through [VhyxSeal](https://github.com/vhyxara/vhyxseal), so AI agents know whether an action is safe and when a human must confirm

[![npm](https://img.shields.io/npm/v/@vhyxui/react?label=%40vhyxui%2Freact)](https://www.npmjs.com/package/@vhyxui/react)
[![license](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

> **0.x** — APIs may change between minor versions.

## Quick start

```bash
npm install @vhyxui/react @vhyxui/tokens
```

```css
/* app.css */
@import "@vhyxui/tokens/index.css";
@import "@vhyxui/react/style.css";
```

```tsx
import { VhyxUIProvider, Stack, Heading, Text, Button } from "@vhyxui/react";

export function App() {
  return (
    <VhyxUIProvider theme="system">
      <Stack gap={4}>
        <Heading>Welcome</Heading>
        <Text tone="muted">Your workspace is ready.</Text>
        <Button onClick={start}>Get started</Button>
      </Stack>
    </VhyxUIProvider>
  );
}
```

Works with React 18 and 19, and with Next.js Server Components. Component styles
live in `@layer components`, so your own CSS and Tailwind utilities always win.

## Packages

| Package | What it does |
|---|---|
| [`@vhyxui/react`](packages/react) | Components and layout/typography primitives |
| [`@vhyxui/blocks`](packages/blocks) | Ready-made blocks (`PageHeader`, `DataTable`, `PricingTable` …) and page layouts (`DashboardLayout`, `AuthLayout` …) |
| [`@vhyxui/tokens`](packages/tokens) | Design tokens as CSS custom properties, with a layered reset and dark theme |
| [`@vhyxui/tailwind`](packages/tailwind) | Tailwind v3 preset and v4 theme mapped to the tokens |
| [`@vhyxui/core`](packages/core) | Agent contract templates, `Slot` and typed errors shared by the packages |

## Develop

Requires Node.js 20.19+ and pnpm 9+.

```bash
pnpm install
pnpm build
pnpm test
pnpm typecheck
pnpm --filter @vhyxui/docs dev         # documentation site
pnpm --filter @vhyxui/playground dev   # playground, http://localhost:3001
```

## Releasing

Packages are published manually from a green `main` (CI runs build, token drift
check, tests and typecheck on Node 20 and 22):

```bash
pnpm build
pnpm -r --filter './packages/*' publish --access public
```

Versions are plain `0.x` (no `-alpha` suffix), so peer ranges like `^0.4.1`
resolve correctly.

## Family

- [**VhyxSeal**](https://github.com/vhyxara/vhyxseal) — the semantic contract layer behind VhyxUI's agent contracts
- [**VhyxChart**](https://github.com/vhyxara/vhyxchart) — animated, text-defined diagrams

## License

[MIT](LICENSE) © [Vhyxara](https://vhyxara.com) · [vhyxui.com](https://vhyxui.com)
