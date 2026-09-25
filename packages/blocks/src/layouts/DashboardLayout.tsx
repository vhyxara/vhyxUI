import React from 'react';
import { Stack } from '@vhyxui/react';
import { AppShell, type AppShellProps } from './AppShell';
import { PageHeader, type PageHeaderProps } from '../blocks/PageHeader';

/** Props for DashboardLayout. */
export interface DashboardLayoutProps extends Omit<AppShellProps, 'children'> {
  /** Page title (renders a PageHeader). */
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: PageHeaderProps['actions'];
  children: React.ReactNode;
}

/**
 * DashboardLayout — AppShell + PageHeader + consistent section spacing.
 * The fastest way to a production-looking admin page.
 *
 * @example
 * <DashboardLayout brand="Acme" nav={nav} title="Overview" actions={[{ label: 'New report' }]}>
 *   <Grid minChildWidth="14rem">{stats}</Grid>
 * </DashboardLayout>
 */
export function DashboardLayout({ title, description, actions, children, ...shell }: DashboardLayoutProps): React.ReactElement {
  return (
    <AppShell {...shell}>
      <Stack gap={8} style={{ maxWidth: '80rem', marginInline: 'auto' }}>
        <PageHeader
          title={title}
          {...(description !== undefined ? { description } : {})}
          {...(actions ? { actions } : {})}
          {...(shell.linkAs ? { linkAs: shell.linkAs } : {})}
        />
        {children}
      </Stack>
    </AppShell>
  );
}
