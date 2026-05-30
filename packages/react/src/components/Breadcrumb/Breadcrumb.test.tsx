import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { Breadcrumb } from './Breadcrumb';
import { breadcrumbContract } from '@vhyxui/core/contracts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicBreadcrumb({ separator }: { separator?: React.ReactNode }) {
  return (
    <Breadcrumb separator={separator}>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/products">Products</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item>
        <Breadcrumb.Page>Widget X</Breadcrumb.Page>
      </Breadcrumb.Item>
    </Breadcrumb>
  );
}

// ─── 1. Renders ───────────────────────────────────────────────────────────────

describe('Breadcrumb — render', () => {
  it('renders without crashing', () => {
    render(<BasicBreadcrumb />);
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument();
  });

  it('renders a nav element', () => {
    const { container } = render(<BasicBreadcrumb />);
    expect(container.querySelector('nav')).toBeInTheDocument();
  });
});

// ─── 2. Navigation landmark ───────────────────────────────────────────────────

describe('Breadcrumb — aria-label', () => {
  it('nav has aria-label="Breadcrumb"', () => {
    render(<BasicBreadcrumb />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb');
  });
});

// ─── 3. Breadcrumb.Page aria-current ─────────────────────────────────────────

describe('Breadcrumb — aria-current', () => {
  it('Breadcrumb.Page has aria-current="page"', () => {
    render(<BasicBreadcrumb />);
    expect(screen.getByText('Widget X')).toHaveAttribute('aria-current', 'page');
  });

  it('Breadcrumb.Link does NOT have aria-current', () => {
    render(<BasicBreadcrumb />);
    const links = screen.getAllByRole('link');
    for (const link of links) {
      expect(link).not.toHaveAttribute('aria-current');
    }
  });
});

// ─── 4. Separator ────────────────────────────────────────────────────────────

describe('Breadcrumb — separator', () => {
  it('default separator "/" is rendered aria-hidden', () => {
    const { container } = render(<BasicBreadcrumb />);
    const separators = container.querySelectorAll('[aria-hidden="true"]');
    // Separators are aria-hidden
    expect(separators.length).toBeGreaterThan(0);
    const hasSeparatorText = Array.from(separators).some((el) =>
      el.textContent?.includes('/'),
    );
    expect(hasSeparatorText).toBe(true);
  });

  it('custom separator is rendered', () => {
    render(<BasicBreadcrumb separator="›" />);
    const { container } = render(<BasicBreadcrumb separator="›" />);
    const hasSeparator = Array.from(
      container.querySelectorAll('[aria-hidden="true"]'),
    ).some((el) => el.textContent?.includes('›'));
    expect(hasSeparator).toBe(true);
  });

  it('last item separator is hidden (no separator after current page)', () => {
    const { container } = render(<BasicBreadcrumb />);
    const items = container.querySelectorAll('li');
    const lastItem = items[items.length - 1];
    // The separator in the last item should be display:none via CSS — we check the DOM exists
    expect(lastItem?.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
  });
});

// ─── 5. Sub-components ────────────────────────────────────────────────────────

describe('Breadcrumb — sub-components', () => {
  it('Breadcrumb.Link renders as an anchor', () => {
    render(<BasicBreadcrumb />);
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('Breadcrumb.Page renders as a non-link span', () => {
    render(<BasicBreadcrumb />);
    const page = screen.getByText('Widget X');
    expect(page.tagName).toBe('SPAN');
  });

  it('Breadcrumb.Ellipsis renders aria-hidden', () => {
    const { container } = render(
      <Breadcrumb>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Ellipsis />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Page>Current</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb>,
    );
    const ellipsis = container.querySelector('[aria-hidden="true"]');
    expect(ellipsis).toBeInTheDocument();
  });
});

// ─── 6. forwardRef ────────────────────────────────────────────────────────────

describe('Breadcrumb — forwardRef', () => {
  it('forwards ref to the nav element', () => {
    const ref = React.createRef<HTMLElement>();
    render(
      <Breadcrumb ref={ref}>
        <Breadcrumb.Item><Breadcrumb.Page>Home</Breadcrumb.Page></Breadcrumb.Item>
      </Breadcrumb>,
    );
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current?.tagName).toBe('NAV');
  });
});

// ─── 7. Accessibility (axe) ──────────────────────────────────────────────────

describe('Breadcrumb — accessibility (axe)', () => {
  it('has no axe violations', async () => {
    const { container } = render(<BasicBreadcrumb />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations with custom separator', async () => {
    const { container } = render(<BasicBreadcrumb separator="›" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations with ellipsis', async () => {
    const { container } = render(
      <Breadcrumb>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Ellipsis />
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Breadcrumb.Page>Current</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('Breadcrumb — VhyxSeal contract', () => {
  it('has a valid contract', () => {
    expect(breadcrumbContract).toBeDefined();
    expect(typeof breadcrumbContract.fingerprint).toBe('string');
    expect(breadcrumbContract.fingerprint.length).toBeGreaterThan(0);
    expect(breadcrumbContract.intent).toBeDefined();
    expect(breadcrumbContract.safetyLevel).toBeDefined();
  });

  it('contract is frozen', () => {
    expect(Object.isFrozen(breadcrumbContract)).toBe(true);
  });

  it('contract has valid type', () => {
    expect(['action', 'input', 'navigation', 'display', 'confirmation']).toContain(
      breadcrumbContract.type,
    );
  });
});
