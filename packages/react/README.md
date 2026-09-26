# @vhyxui/react

Accessible React components with motion tokens and built-in AI agent contracts.
Every interactive component describes what it does, so AI agents can use your UI
safely — powered by [VhyxSeal](https://www.npmjs.com/package/@vhyxseal/react).

> **Alpha** — APIs may change between minor versions.

## Install

```bash
npm install @vhyxui/react @vhyxui/tokens
```

Requires React 18 or 19.

## Usage

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

Components are tree-shakeable, and each one has its own entry point
(`@vhyxui/react/button`, `@vhyxui/react/dialog` …). Styles live in
`@layer components`, so your own CSS and Tailwind utilities always win.

## What's included

- **Layout & type** — `Stack`, `HStack`, `VStack`, `Grid`, `Container`, `Center`, `Text`, `Heading`, `Kbd`, `VisuallyHidden`
- **Forms** — `Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Form`, `Field`, `TextField`, `TextareaField`, `SelectField`
- **Overlays** — `Dialog`, `Drawer`, `Popover`, `Tooltip`, `toast`
- **Display** — `Card`, `Badge`, `Alert`, `Avatar`, `Table`, `Accordion`, `Tabs`, `Breadcrumb`, `Pagination`, `Progress`, `Spinner`, `Skeleton`, `Separator`
- **Utilities** — `cx`, `VhyxUIProvider` (theme, toasts, skip link, agent contracts)

Works with Next.js Server Components: components ship with `'use client'`.

## Related packages

- `@vhyxui/tokens` — design tokens (required)
- `@vhyxui/blocks` — ready-made blocks and page layouts
- `@vhyxui/tailwind` — Tailwind v3 preset and v4 theme

## Links

- Documentation — https://vhyxui.com
- Source — https://github.com/vhyxara/vhyxUI/tree/main/packages/react
- License — MIT
