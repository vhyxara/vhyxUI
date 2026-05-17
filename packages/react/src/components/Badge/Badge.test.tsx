import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { Badge } from './Badge';

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Badge — render', () => {
  it('renders without crashing', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('renders as a span element', () => {
    render(<Badge>Label</Badge>);
    expect(screen.getByText('Label').tagName).toBe('SPAN');
  });
});

// ─── 2. All variants ──────────────────────────────────────────────────────────

describe('Badge — variants', () => {
  const variants = [
    'default',
    'success',
    'warning',
    'danger',
    'info',
    'outline',
  ] as const;

  for (const variant of variants) {
    it(`renders ${variant} variant with correct data-variant`, () => {
      render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toHaveAttribute('data-variant', variant);
    });
  }

  it('defaults to default variant', () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText('Badge')).toHaveAttribute('data-variant', 'default');
  });
});

// ─── 3. All sizes ─────────────────────────────────────────────────────────────

describe('Badge — sizes', () => {
  const sizes = ['sm', 'md', 'lg'] as const;

  for (const size of sizes) {
    it(`renders ${size} size with correct data-size`, () => {
      render(<Badge size={size}>Badge</Badge>);
      expect(screen.getByText('Badge')).toHaveAttribute('data-size', size);
    });
  }

  it('defaults to md size', () => {
    render(<Badge>Badge</Badge>);
    expect(screen.getByText('Badge')).toHaveAttribute('data-size', 'md');
  });
});

// ─── 4. dot mode ──────────────────────────────────────────────────────────────

describe('Badge — dot mode', () => {
  it('renders no text content when dot=true', () => {
    const { container } = render(<Badge dot variant="danger" />);
    const badge = container.querySelector('[data-dot="true"]');
    expect(badge).toBeInTheDocument();
    expect(badge?.textContent).toBe('');
  });

  it('sets data-dot="true" when dot=true', () => {
    const { container } = render(<Badge dot />);
    expect(container.firstChild).toHaveAttribute('data-dot', 'true');
  });
});

// ─── 5. count + max ───────────────────────────────────────────────────────────

describe('Badge — count', () => {
  it('renders the count number when under max', () => {
    render(<Badge count={42} />);
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('renders count exactly equal to max without truncation', () => {
    render(<Badge count={99} max={99} />);
    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('renders {max}+ when count exceeds max', () => {
    render(<Badge count={100} max={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('truncates at default max of 99 when count=100 and no max prop', () => {
    render(<Badge count={100} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('renders count=0 correctly', () => {
    render(<Badge count={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

// ─── 8. forwardRef ────────────────────────────────────────────────────────────

describe('Badge — forwardRef', () => {
  it('forwards ref to the HTMLSpanElement', () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Ref badge</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});

// ─── 9. className ─────────────────────────────────────────────────────────────

describe('Badge — className', () => {
  it('appends custom className', () => {
    render(<Badge className="custom">Badge</Badge>);
    expect(screen.getByText('Badge').className).toContain('custom');
  });
});

// ─── 12. Accessibility (axe) ─────────────────────────────────────────────────

describe('Badge — accessibility (axe)', () => {
  const variants = [
    'default',
    'success',
    'warning',
    'danger',
    'info',
    'outline',
  ] as const;

  for (const variant of variants) {
    it(`${variant} variant has no axe violations`, async () => {
      const { container } = render(
        <Badge variant={variant}>Label</Badge>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  }

  it('dot mode has no axe violations (decorative, aria-hidden)', async () => {
    // Dot badges are decorative — aria-label on a plain <span> without role is invalid ARIA.
    // Consumers who need semantics should wrap the dot in a visually-hidden description.
    const { container } = render(<Badge dot aria-hidden="true" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('count badge has no axe violations', async () => {
    const { container } = render(<Badge count={5} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
