import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { Button, VhyxUIProvider } from '@vhyxui/react';
import {
  PageHeader,
  StatCard,
  EmptyState,
  Hero,
  FeatureGrid,
  PricingTable,
  AuthForm,
  ConfirmDialog,
  TabbedPanel,
  DataTable,
  SettingsSection,
  SimpleForm,
  FAQ,
  CTASection,
  Navbar,
  Footer,
} from './index';

const wrap = (ui: React.ReactElement): ReturnType<typeof render> => render(<VhyxUIProvider>{ui}</VhyxUIProvider>);

describe('PageHeader', () => {
  it('renders title, description and action buttons/links', () => {
    const onClick = vi.fn();
    wrap(<PageHeader title="Customers" description="All of them" actions={[{ label: 'Export', href: '/export' }, { label: 'Add', onClick }]} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Customers' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Export' })).toHaveAttribute('href', '/export');
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    expect(onClick).toHaveBeenCalled();
  });
});

describe('StatCard', () => {
  it('shows value and colours the trend', () => {
    wrap(<StatCard label="Revenue" value="$1,000" change="+5%" trend="up" hint="vs last month" />);
    expect(screen.getByText('$1,000')).toBeInTheDocument();
    expect(screen.getByText('+5%').closest('[data-tone]')).toHaveAttribute('data-tone', 'success');
  });

  it('inverts trend colour when down is good', () => {
    wrap(<StatCard label="Churn" value="2%" change="-1%" trend="down" invertTrend />);
    expect(screen.getByText('-1%').closest('[data-tone]')).toHaveAttribute('data-tone', 'success');
  });

  it('shows a skeleton while loading', () => {
    const { container } = wrap(<StatCard label="Revenue" value="$1" loading />);
    expect(screen.queryByText('$1')).toBeNull();
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
  });
});

describe('EmptyState, Hero, FeatureGrid, CTASection, FAQ', () => {
  it('EmptyState renders actions', () => {
    wrap(<EmptyState title="Nothing here" description="Add one" actions={[{ label: 'Create' }]} />);
    expect(screen.getByRole('heading', { name: 'Nothing here' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument();
  });

  it('Hero renders an h1 and CTA links in split mode', () => {
    wrap(<Hero align="split" eyebrow="New" title="Ship faster" actions={[{ label: 'Start', href: '/start' }]} media={<div>shot</div>} />);
    expect(screen.getByRole('heading', { level: 1, name: 'Ship faster' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Start' })).toHaveAttribute('href', '/start');
    expect(screen.getByText('shot')).toBeInTheDocument();
  });

  it('FeatureGrid renders a list of features', () => {
    wrap(<FeatureGrid title="Why" features={[{ title: 'Fast', description: 'Very' }, { title: 'Safe', description: 'Yes' }]} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });

  it('CTASection and FAQ render', () => {
    wrap(<><CTASection title="Ready?" actions={[{ label: 'Go' }]} /><FAQ items={[{ question: 'Free?', answer: 'Yes' }]} /></>);
    expect(screen.getByRole('button', { name: 'Go' })).toBeInTheDocument();
    expect(screen.getByText('Free?')).toBeInTheDocument();
  });
});

describe('PricingTable', () => {
  it('highlights a plan and renders features and CTA', () => {
    wrap(
      <PricingTable
        plans={[
          { name: 'Free', price: '$0', features: ['1 seat'], action: { label: 'Start free' } },
          { name: 'Pro', price: '$29', period: '/mo', features: ['Unlimited', 'SSO'], action: { label: 'Buy Pro', href: '/buy' }, highlighted: true },
        ]}
      />,
    );
    expect(screen.getByText('Most popular')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Buy Pro' })).toHaveAttribute('href', '/buy');
    expect(screen.getByText('SSO')).toBeInTheDocument();
  });
});

describe('AuthForm', () => {
  it('validates before submitting', async () => {
    const onSubmit = vi.fn();
    wrap(<AuthForm onSubmit={onSubmit} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByText('Use at least 8 characters')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits valid sign-up values including name', async () => {
    const onSubmit = vi.fn();
    wrap(<AuthForm mode="sign-up" onSubmit={onSubmit} />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Ada' } });
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'correct horse' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada', email: 'ada@example.com', password: 'correct horse' }));
  });

  it('shows the error thrown by onSubmit', async () => {
    wrap(<AuthForm onSubmit={() => Promise.reject(new Error('Wrong password'))} />);
    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: 'ada@example.com' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: '12345678' } });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(await screen.findByText('Wrong password')).toBeInTheDocument();
  });

  it('renders providers', () => {
    const gh = vi.fn();
    wrap(<AuthForm onSubmit={vi.fn()} providers={[{ id: 'gh', label: 'Continue with GitHub', onClick: gh }]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Continue with GitHub' }));
    expect(gh).toHaveBeenCalled();
  });
});

describe('ConfirmDialog', () => {
  it('opens from the trigger, awaits onConfirm, then closes', async () => {
    let resolve: () => void = () => undefined;
    const onConfirm = vi.fn(() => new Promise<void>((r) => { resolve = r; }));
    wrap(<ConfirmDialog destructive title="Delete?" description="Gone forever" confirmLabel="Delete" trigger={<Button>Open</Button>} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Delete' }));
    expect(onConfirm).toHaveBeenCalled();
    resolve();
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });

  it('cancel closes without confirming', async () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();
    wrap(<ConfirmDialog title="Sure?" trigger={<Button>Open</Button>} onConfirm={onConfirm} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe('TabbedPanel', () => {
  it('shows the first tab by default', () => {
    wrap(<TabbedPanel items={[{ value: 'a', label: 'A', content: 'Alpha' }, { value: 'b', label: 'B', content: 'Beta' }]} />);
    expect(screen.getByRole('tab', { name: 'A' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Alpha')).toBeVisible();
  });
});

describe('DataTable', () => {
  const data = Array.from({ length: 25 }, (_, i) => ({ id: i + 1, name: `Customer ${i + 1}`, mrr: (i * 37) % 100 }));
  const columns = [{ key: 'name', header: 'Name' }, { key: 'mrr', header: 'MRR', align: 'end' as const }];

  it('paginates', () => {
    wrap(<DataTable columns={columns} data={data} pageSize={10} />);
    expect(screen.getAllByRole('row')).toHaveLength(11);
    expect(screen.getByText('1–10 of 25')).toBeInTheDocument();
  });

  it('searches across keys and resets to page 1', () => {
    wrap(<DataTable columns={columns} data={data} searchKeys={['name']} />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search table' }), { target: { value: 'Customer 2' } });
    const names = screen.getAllByRole('row').slice(1).map((r) => r.textContent);
    expect(names.every((n) => n?.includes('Customer 2'))).toBe(true);
  });

  it('sorts when a sortable header is clicked', () => {
    wrap(<DataTable columns={columns} data={data} sortableKeys={['mrr']} pageSize={30} />);
    fireEvent.click(screen.getByRole('button', { name: 'Sort by MRR' }));
    const values = screen.getAllByRole('row').slice(1).map((r) => Number(r.lastChild?.textContent));
    expect(values).toEqual([...values].sort((a, b) => a - b));
    fireEvent.click(screen.getByRole('button', { name: 'Sort by MRR' }));
    const desc = screen.getAllByRole('row').slice(1).map((r) => Number(r.lastChild?.textContent));
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it('shows an empty-search message', () => {
    wrap(<DataTable columns={columns} data={data} searchKeys={['name']} />);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz' } });
    expect(screen.getByText('No results for “zzz”')).toBeInTheDocument();
  });
});

describe('SettingsSection and SimpleForm', () => {
  it('SettingsSection renders title and footer', () => {
    wrap(<SettingsSection title="Profile" description="Public info" footer={<Button>Save</Button>}>fields</SettingsSection>);
    expect(screen.getByRole('heading', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('SimpleForm validates required, email and custom rules, then submits', async () => {
    const onSubmit = vi.fn();
    wrap(
      <SimpleForm
        fields={[
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'age', label: 'Age', type: 'number', validate: (v) => (Number(v) < 18 ? 'Must be 18+' : undefined) },
          { name: 'bio', label: 'Bio', type: 'textarea' },
          { name: 'terms', label: 'I agree', type: 'checkbox', required: true },
        ]}
        onSubmit={onSubmit}
        successMessage="Saved!"
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Must be 18+')).toBeInTheDocument();
    expect(screen.getByText('Required')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/^Email/), { target: { value: 'a@b.co' } });
    fireEvent.change(screen.getByLabelText(/^Age/), { target: { value: '30' } });
    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ email: 'a@b.co', age: '30', bio: '', terms: true }));
    expect(await screen.findByText('Saved!')).toBeInTheDocument();
  });
});

describe('Navbar and Footer', () => {
  it('Navbar marks the active link and uses the custom link component', () => {
    const MyLink = ({ href, children, ...rest }: { href: string; children?: React.ReactNode }): React.ReactElement => (
      <a href={href} data-custom="yes" {...rest}>{children}</a>
    );
    wrap(<Navbar brand="Acme" linkAs={MyLink} links={[{ label: 'Docs', href: '/docs', active: true }, { label: 'Blog', href: '/blog' }]} />);
    const docs = screen.getAllByRole('link', { name: 'Docs' })[0];
    expect(docs).toHaveAttribute('aria-current', 'page');
    expect(docs).toHaveAttribute('data-custom', 'yes');
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('Footer renders columns and legal line', async () => {
    const { container } = wrap(<Footer brand="Acme" columns={[{ title: 'Product', links: [{ label: 'Pricing', href: '/pricing' }] }]} legal="© 2026 Acme" />);
    expect(screen.getByRole('link', { name: 'Pricing' })).toHaveAttribute('href', '/pricing');
    expect(screen.getByText('© 2026 Acme')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
