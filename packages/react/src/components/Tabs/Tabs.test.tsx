import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Tabs } from './Tabs';
import { tabsContract } from '@vhyxui/core/contracts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicTabs({
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
  variant = 'default',
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'pills' | 'underline' | 'enclosed';
}) {
  return (
    <Tabs
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      orientation={orientation}
      variant={variant}
    >
      <Tabs.List>
        <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
        <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
        <Tabs.Trigger value="tab3">Tab 3</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="tab1">Content 1</Tabs.Content>
      <Tabs.Content value="tab2">Content 2</Tabs.Content>
      <Tabs.Content value="tab3">Content 3</Tabs.Content>
    </Tabs>
  );
}

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Tabs — render', () => {
  it('renders without crashing', () => {
    render(<BasicTabs defaultValue="tab1" />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('renders all tab triggers', () => {
    render(<BasicTabs defaultValue="tab1" />);
    expect(screen.getAllByRole('tab')).toHaveLength(3);
  });

  it('renders active panel content', () => {
    render(<BasicTabs defaultValue="tab2" />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('does not render inactive panel content', () => {
    render(<BasicTabs defaultValue="tab1" />);
    expect(screen.queryByText('Content 2')).toBeNull();
    expect(screen.queryByText('Content 3')).toBeNull();
  });
});

// ─── 2. ARIA attributes ───────────────────────────────────────────────────────

describe('Tabs — ARIA', () => {
  it('tablist has role="tablist"', () => {
    render(<BasicTabs defaultValue="tab1" />);
    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  it('active trigger has aria-selected="true"', () => {
    render(<BasicTabs defaultValue="tab1" />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('inactive triggers have aria-selected="false"', () => {
    render(<BasicTabs defaultValue="tab1" />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
    expect(tabs[2]).toHaveAttribute('aria-selected', 'false');
  });

  it('trigger aria-controls references its panel id', () => {
    render(<BasicTabs defaultValue="tab1" />);
    const tabs = screen.getAllByRole('tab');
    const panel = screen.getByRole('tabpanel');
    expect(tabs[0]!.getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.id).toBeTruthy();
  });

  it('panel aria-labelledby references its trigger id', () => {
    render(<BasicTabs defaultValue="tab1" />);
    const tabs = screen.getAllByRole('tab');
    const panel = screen.getByRole('tabpanel');
    expect(panel.getAttribute('aria-labelledby')).toBe(tabs[0]!.id);
    expect(tabs[0]!.id).toBeTruthy();
  });

  it('active trigger has tabIndex=0, inactive have tabIndex=-1', () => {
    render(<BasicTabs defaultValue="tab2" />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs[0]).toHaveAttribute('tabindex', '-1');
    expect(tabs[1]).toHaveAttribute('tabindex', '0');
    expect(tabs[2]).toHaveAttribute('tabindex', '-1');
  });
});

// ─── 3. Keyboard navigation (horizontal) ─────────────────────────────────────

describe('Tabs — keyboard navigation (horizontal)', () => {
  it('ArrowRight moves to next tab and activates it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs defaultValue="tab1" onValueChange={onValueChange} />);

    const tabs = screen.getAllByRole('tab');
    tabs[0]?.focus();
    await user.keyboard('{ArrowRight}');

    expect(onValueChange).toHaveBeenCalledWith('tab2');
    expect(tabs[1]).toHaveFocus();
  });

  it('ArrowLeft moves to previous tab and activates it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs defaultValue="tab2" onValueChange={onValueChange} />);

    const tabs = screen.getAllByRole('tab');
    tabs[1]?.focus();
    await user.keyboard('{ArrowLeft}');

    expect(onValueChange).toHaveBeenCalledWith('tab1');
    expect(tabs[0]).toHaveFocus();
  });

  it('ArrowRight wraps from last to first', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs defaultValue="tab3" onValueChange={onValueChange} />);

    const tabs = screen.getAllByRole('tab');
    tabs[2]?.focus();
    await user.keyboard('{ArrowRight}');

    expect(onValueChange).toHaveBeenCalledWith('tab1');
  });

  it('ArrowLeft wraps from first to last', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs defaultValue="tab1" onValueChange={onValueChange} />);

    const tabs = screen.getAllByRole('tab');
    tabs[0]?.focus();
    await user.keyboard('{ArrowLeft}');

    expect(onValueChange).toHaveBeenCalledWith('tab3');
  });

  it('Home jumps to first tab', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs defaultValue="tab3" onValueChange={onValueChange} />);

    const tabs = screen.getAllByRole('tab');
    tabs[2]?.focus();
    await user.keyboard('{Home}');

    expect(onValueChange).toHaveBeenCalledWith('tab1');
    expect(tabs[0]).toHaveFocus();
  });

  it('End jumps to last tab', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs defaultValue="tab1" onValueChange={onValueChange} />);

    const tabs = screen.getAllByRole('tab');
    tabs[0]?.focus();
    await user.keyboard('{End}');

    expect(onValueChange).toHaveBeenCalledWith('tab3');
    expect(tabs[2]).toHaveFocus();
  });
});

// ─── 4. Keyboard navigation (vertical) ───────────────────────────────────────

describe('Tabs — keyboard navigation (vertical)', () => {
  it('ArrowDown moves to next tab in vertical orientation', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs defaultValue="tab1" orientation="vertical" onValueChange={onValueChange} />);

    const tabs = screen.getAllByRole('tab');
    tabs[0]?.focus();
    await user.keyboard('{ArrowDown}');

    expect(onValueChange).toHaveBeenCalledWith('tab2');
  });

  it('ArrowUp moves to previous tab in vertical orientation', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs defaultValue="tab2" orientation="vertical" onValueChange={onValueChange} />);

    const tabs = screen.getAllByRole('tab');
    tabs[1]?.focus();
    await user.keyboard('{ArrowUp}');

    expect(onValueChange).toHaveBeenCalledWith('tab1');
  });
});

// ─── 5. Click activation ──────────────────────────────────────────────────────

describe('Tabs — click activation', () => {
  it('clicking a tab activates it', async () => {
    const user = userEvent.setup();
    render(<BasicTabs defaultValue="tab1" />);
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
    expect(screen.queryByText('Content 1')).toBeNull();
  });

  it('calls onValueChange when tab is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicTabs defaultValue="tab1" onValueChange={onValueChange} />);
    await user.click(screen.getByRole('tab', { name: 'Tab 2' }));
    expect(onValueChange).toHaveBeenCalledWith('tab2');
  });
});

// ─── 6. Controlled mode ───────────────────────────────────────────────────────

describe('Tabs — controlled mode', () => {
  it('reflects controlled value', () => {
    const { rerender } = render(
      <BasicTabs value="tab1" onValueChange={vi.fn()} />,
    );
    expect(screen.getByText('Content 1')).toBeInTheDocument();
    rerender(<BasicTabs value="tab2" onValueChange={vi.fn()} />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });
});

// ─── 7. Uncontrolled mode ────────────────────────────────────────────────────

describe('Tabs — uncontrolled mode', () => {
  it('changes active tab internally on click', async () => {
    const user = userEvent.setup();
    render(<BasicTabs defaultValue="tab1" />);
    await user.click(screen.getByRole('tab', { name: 'Tab 3' }));
    expect(screen.getByText('Content 3')).toBeInTheDocument();
  });
});

// ─── 8. All variants ─────────────────────────────────────────────────────────

describe('Tabs — variants', () => {
  const variants = ['default', 'pills', 'underline', 'enclosed'] as const;

  for (const variant of variants) {
    it(`renders ${variant} variant with correct data-variant`, () => {
      render(<BasicTabs defaultValue="tab1" variant={variant} />);
      expect(screen.getByRole('tablist')).toHaveAttribute('data-variant', variant);
    });
  }
});

// ─── 9. Sliding indicator ────────────────────────────────────────────────────

describe('Tabs — sliding indicator', () => {
  it('indicator element is present in tablist', () => {
    const { container } = render(<BasicTabs defaultValue="tab1" />);
    const list = container.querySelector('[role="tablist"]');
    const indicator = list?.querySelector('[aria-hidden="true"]');
    expect(indicator).toBeInTheDocument();
  });

  it('indicator is aria-hidden', () => {
    const { container } = render(<BasicTabs defaultValue="tab1" />);
    const indicator = container.querySelector('[role="tablist"] [aria-hidden="true"]');
    expect(indicator).toHaveAttribute('aria-hidden', 'true');
  });
});

// ─── 10. Orientation ─────────────────────────────────────────────────────────

describe('Tabs — orientation', () => {
  it('tablist has aria-orientation="horizontal" by default', () => {
    render(<BasicTabs defaultValue="tab1" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('tablist has aria-orientation="vertical"', () => {
    render(<BasicTabs defaultValue="tab1" orientation="vertical" />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  });
});

// ─── 11. Accessibility (axe) ─────────────────────────────────────────────────

describe('Tabs — accessibility (axe)', () => {
  it('default tabs have no axe violations', async () => {
    const { container } = render(<BasicTabs defaultValue="tab1" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('vertical tabs have no axe violations', async () => {
    const { container } = render(<BasicTabs defaultValue="tab1" orientation="vertical" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('pills variant has no axe violations', async () => {
    const { container } = render(<BasicTabs defaultValue="tab1" variant="pills" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('enclosed variant has no axe violations', async () => {
    const { container } = render(<BasicTabs defaultValue="tab1" variant="enclosed" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('Tabs — VhyxSeal contract', () => {
  it('has a valid contract', () => {
    expect(tabsContract).toBeDefined();
    expect(typeof tabsContract.fingerprint).toBe('string');
    expect(tabsContract.fingerprint.length).toBeGreaterThan(0);
    expect(tabsContract.intent).toBeDefined();
    expect(tabsContract.safetyLevel).toBeDefined();
  });

  it('contract is frozen', () => {
    expect(Object.isFrozen(tabsContract)).toBe(true);
  });

  it('contract has valid type', () => {
    expect(['action', 'input', 'navigation', 'display', 'confirmation']).toContain(
      tabsContract.type,
    );
  });
});
