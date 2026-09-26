# @vhyxui/core

Shared foundations for VhyxUI packages: agent contract templates for every
interactive component, the `Slot` primitive and typed errors.

> **Alpha** — most apps use `@vhyxui/react` and never import this package directly.

## Install

```bash
npm install @vhyxui/core
```

## What's included

- **Contract templates** — `buttonContract`, `dialogContract`, `tableContract` … one per
  interactive component, describing its intent and safety level for AI agents
  (built on `@vhyxseal/core`)
- **`Slot`** — merges props and refs onto a child element (`asChild` pattern),
  plus `mergeProps` and `mergeRefs`
- **Errors** — `VhyxUIError` and `VhyxUIErrorCode`

```ts
import { Slot, mergeRefs } from "@vhyxui/core";
```

## Links

- Documentation — https://vhyxui.com
- Source — https://github.com/vhyxara/vhyxUI/tree/main/packages/core
- License — MIT
