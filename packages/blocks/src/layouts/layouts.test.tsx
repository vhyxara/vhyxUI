import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { VhyxUIProvider } from '@vhyxui/react';
import { AppShell, DashboardLayout, AuthLayout, MarketingLayout, DocsLayout, SidebarNav } from './index';

const nav = [{ label: 'Main', items: [{ label: 'Home', href: '/', active: true }, { label: 'Reports', href: '/reports', badge: 3 }] }];
const wrap = (ui: React.ReactElement): ReturnType<typeof render> => render(<VhyxUIProvider>{ui}</VhyxUIProvider>);

describe('SidebarNav', () => {
  it('renders groups, active state and numeric badges', () => {
    wrap(<SidebarNav groups={nav} />);
    expect(screen.getByText('Main')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: /Reports/ })).toHaveTextContent('3');
  });
});

describe('AppShell', () => {
  it('renders sidebar, header and a main landmark with the skip-link target', () => {
    wrap(<AppShell brand="Acme" nav={nav} header={<span>Search</span>}>content</AppShell>);
    expect(screen.getByRole('main')).toHaveAttribute('id', 'vhyx-main');
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getAllByRole('navigation', { name: 'Sidebar' }).length).toBeGreaterThan(0);
  });

  it('opens the mobile drawer with the same navigation', async () => {
    wrap(<AppShell nav={nav}>content</AppShell>);
    fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
    expect(await screen.findByRole('dialog')).toBeInTheDocument();
  });

  it('supports collapsed mode and custom width', () => {
    const { container } = wrap(<AppShell nav={nav} collapsed sidebarWidth="20rem">x</AppShell>);
    const shell = container.querySelector('[data-collapsed="true"]') as HTMLElement;
    expect(shell.style.getPropertyValue('--vhyx-shell-sidebar')).toBe('20rem');
  });
});

describe('DashboardLayout', () => {
  it('adds a page header', () => {
    wrap(<DashboardLayout nav={nav} title="Overview" actions={[{ label: 'New' }]}>body</DashboardLayout>);
    expect(screen.getByRole('heading', { level: 1, name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'New' })).toBeInTheDocument();
  });
});

describe('AuthLayout, MarketingLayout, DocsLayout', () => {
  it('AuthLayout split renders an aside', () => {
    const { container } = wrap(<AuthLayout variant="split" brand="Acme" aside="Quote">form</AuthLayout>);
    expect(container.querySelector('aside')).toHaveTextContent('Quote');
    expect(screen.getByRole('main')).toHaveTextContent('form');
  });

  it('MarketingLayout composes navbar, main and footer', () => {
    wrap(<MarketingLayout navbar={{ brand: 'Acme' }} footer={{ legal: '© Acme' }}>page</MarketingLayout>);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toHaveTextContent('page');
    expect(screen.getByRole('contentinfo')).toHaveTextContent('© Acme');
  });

  it('DocsLayout renders the table of contents', () => {
    wrap(<DocsLayout navbar={{ brand: 'Docs' }} nav={nav} toc={[{ id: 'install', label: 'Install' }]}>article</DocsLayout>);
    expect(screen.getByRole('navigation', { name: 'On this page' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Install' })).toHaveAttribute('href', '#install');
  });
});
