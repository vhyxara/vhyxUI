# @vhyxui/blocks

Ready-made blocks and page layouts built only from `@vhyxui/react` components.

> **Alpha** — APIs may change between minor versions.

## Install

```bash
npm install @vhyxui/blocks @vhyxui/react @vhyxui/tokens
```

## Usage

```css
/* app.css */
@import "@vhyxui/tokens/index.css";
@import "@vhyxui/react/style.css";
@import "@vhyxui/blocks/style.css";
```

```tsx
import { DashboardLayout, StatCard } from "@vhyxui/blocks";
import { Grid } from "@vhyxui/react";

export function Overview() {
  return (
    <DashboardLayout title="Overview" description="Last 30 days">
      <Grid columns={3} gap={4}>
        <StatCard label="Revenue" value="$48,200" change="+12%" trend="up" />
        <StatCard label="Orders" value="1,204" change="+3%" trend="up" />
        <StatCard label="Refunds" value="18" change="-2%" trend="down" invertTrend />
      </Grid>
    </DashboardLayout>
  );
}
```

## What's included

**Blocks** (`@vhyxui/blocks/blocks`) — `PageHeader`, `StatCard`, `EmptyState`, `Hero`,
`FeatureGrid`, `PricingTable`, `AuthForm`, `ConfirmDialog`, `TabbedPanel`, `DataTable`,
`SettingsSection`, `SimpleForm`, `FAQ`, `CTASection`, `Navbar`, `Footer`, `ActionButton`

**Layouts** (`@vhyxui/blocks/layouts`) — `AppShell`, `SidebarNav`, `DashboardLayout`,
`AuthLayout`, `MarketingLayout`, `DocsLayout`

## Links

- Documentation — https://vhyxui.com
- Source — https://github.com/vhyxara/vhyxUI/tree/main/packages/blocks
- License — MIT
