import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Button } from './Button';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getContract(element: HTMLElement): Record<string, unknown> {
  const raw = element.getAttribute('data-vhyx-contract');
  if (!raw) throw new Error('No data-vhyx-contract attribute found');
  return JSON.parse(raw) as Record<string, unknown>;
}

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Button — render', () => {
  it('renders without crashing', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('renders children correctly', () => {
    render(<Button>Submit</Button>);
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});

// ─── 2. All variants ──────────────────────────────────────────────────────────

describe('Button — variants', () => {
  const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;

  for (const variant of variants) {
    it(`renders ${variant} variant with correct data-variant attribute`, () => {
      render(<Button variant={variant}>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-variant', variant);
    });
  }

  it('defaults to primary variant', () => {
    render(<Button>Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'primary');
  });
});

// ─── 3. All sizes ─────────────────────────────────────────────────────────────

describe('Button — sizes', () => {
  const sizes = ['xs', 'sm', 'md', 'lg'] as const;

  for (const size of sizes) {
    it(`renders ${size} size with correct data-size attribute`, () => {
      render(<Button size={size}>Button</Button>);
      expect(screen.getByRole('button')).toHaveAttribute('data-size', size);
    });
  }

  it('defaults to md size', () => {
    render(<Button>Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'md');
  });
});

// ─── 4. States ────────────────────────────────────────────────────────────────

describe('Button — loading state', () => {
  it('sets aria-busy="true" when loading', () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('is disabled when loading', () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('renders a spinner when loading', () => {
    render(<Button loading>Saving</Button>);
    // Spinner is an SVG with aria-hidden — query by hidden role
    const button = screen.getByRole('button');
    const spinner = button.querySelector('svg[aria-hidden="true"]');
    expect(spinner).not.toBeNull();
  });

  it('sets data-loading attribute when loading', () => {
    render(<Button loading>Saving</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-loading', 'true');
  });
});

describe('Button — disabled state', () => {
  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

// ─── 5. Event handlers ────────────────────────────────────────────────────────

describe('Button — events', () => {
  it('fires onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fire onClick when loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Loading
      </Button>,
    );
    await user.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});

// ─── 6 & 7. Controlled / uncontrolled — Button is stateless, mark N/A ────────
// Button has no controlled/uncontrolled state (it's a simple action element).
// These requirements apply to stateful components (Input, Select, Checkbox, etc.)

// ─── 8. forwardRef ────────────────────────────────────────────────────────────

describe('Button — forwardRef', () => {
  it('forwards ref to the HTMLButtonElement', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

// ─── 9. className appends ─────────────────────────────────────────────────────

describe('Button — className', () => {
  it('appends custom className without replacing internal class', () => {
    render(<Button className="custom-class">Button</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
    // Internal module class is also present
    expect(button.className).toMatch(/button/);
  });
});

// ─── 10. iconOnly accessibility warning ───────────────────────────────────────

describe('Button — iconOnly', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('warns in dev when iconOnly has no aria-label', () => {
    render(
      <Button iconOnly>
        <span>icon</span>
      </Button>,
    );
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('aria-label'),
    );
  });

  it('does not warn when iconOnly has aria-label', () => {
    render(
      <Button iconOnly aria-label="Close dialog">
        <span>icon</span>
      </Button>,
    );
    expect(console.warn).not.toHaveBeenCalledWith(
      expect.stringContaining('aria-label'),
    );
  });
});

// ─── 11. VhyxSeal contract ────────────────────────────────────────────────────

describe('Button — VhyxSeal contract', () => {
  it('attaches a VhyxSeal contract via data-vhyx-contract', () => {
    render(<Button>Button</Button>);
    const contract = getContract(screen.getByRole('button'));
    expect(contract).toBeDefined();
  });

  it('default contract has type action and safetyLevel low', () => {
    render(<Button>Button</Button>);
    const contract = getContract(screen.getByRole('button'));
    expect(contract['type']).toBe('action');
    expect(contract['safetyLevel']).toBe('low');
    expect(contract['destructive']).toBe(false);
  });

  it('destructive variant auto-upgrades contract to safetyLevel high', () => {
    render(<Button variant="destructive">Delete</Button>);
    const contract = getContract(screen.getByRole('button'));
    expect(contract['safetyLevel']).toBe('high');
    expect(contract['destructive']).toBe(true);
  });

  it('contract prop overrides default contract fields', () => {
    render(
      <Button contract={{ requiresConfirmation: true }}>Button</Button>,
    );
    const contract = getContract(screen.getByRole('button'));
    expect(contract['requiresConfirmation']).toBe(true);
  });

  it('DOM attribute has real instance id — not template id', () => {
    render(<Button>Button</Button>);
    const contract = getContract(screen.getByRole('button'));
    expect(contract['id']).toBeTruthy();
    expect(contract['id']).not.toBe('__vhyxui_button_template__');
    expect(contract['id']).not.toBe('vhyxui-button');
  });

  it('DOM attribute carries fingerprint from defineContractTemplate()', () => {
    render(<Button>Button</Button>);
    const contract = getContract(screen.getByRole('button'));
    expect(typeof contract['fingerprint']).toBe('string');
    expect((contract['fingerprint'] as string).length).toBeGreaterThan(0);
  });
});

// ─── 12. asChild ─────────────────────────────────────────────────────────────

describe('Button — asChild', () => {
  it('renders as child element when asChild is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link</a>
      </Button>,
    );
    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('merges className when asChild is true', () => {
    render(
      <Button asChild className="extra">
        <a href="/">Link</a>
      </Button>,
    );
    expect(screen.getByRole('link')).toHaveClass('extra');
  });

  it('merges data-variant onto child element when asChild is true', () => {
    render(
      <Button asChild variant="secondary">
        <a href="/">Link</a>
      </Button>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('data-variant', 'secondary');
  });

  it('merges onClick onto child element when asChild is true', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button asChild onClick={onClick}>
        <a href="/">Link</a>
      </Button>,
    );
    await user.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

// ─── 13. Accessibility ────────────────────────────────────────────────────────

describe('Button — accessibility (axe)', () => {
  const variants = ['primary', 'secondary', 'outline', 'ghost', 'destructive'] as const;

  for (const variant of variants) {
    it(`${variant} variant has no axe violations`, async () => {
      const { container } = render(
        <Button variant={variant}>Click me</Button>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  }

  it('link variant has no axe violations', async () => {
    const { container } = render(<Button variant="link">Learn more</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('loading state has no axe violations', async () => {
    const { container } = render(<Button loading>Saving</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('iconOnly with aria-label has no axe violations', async () => {
    const { container } = render(
      <Button iconOnly aria-label="Close">
        ×
      </Button>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
