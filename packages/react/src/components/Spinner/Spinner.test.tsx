import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { Spinner } from './Spinner';

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Spinner — render', () => {
  it('renders without crashing', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders as an SVG element', () => {
    render(<Spinner />);
    const el = screen.getByRole('status');
    expect(el.tagName.toLowerCase()).toBe('svg');
  });
});

// ─── 2. role="status" always present ──────────────────────────────────────────

describe('Spinner — role', () => {
  it('has role="status"', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});

// ─── 3. sr-only label always present ──────────────────────────────────────────

describe('Spinner — label', () => {
  it('defaults to "Loading" label', () => {
    render(<Spinner />);
    // aria-label on the SVG
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('uses custom label when provided', () => {
    render(<Spinner label="Uploading file" />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Uploading file');
  });

  it('renders a <title> element for screen readers that read SVG titles', () => {
    const { container } = render(<Spinner label="Saving" />);
    const title = container.querySelector('title');
    expect(title?.textContent).toBe('Saving');
  });
});

// ─── 4. Sizes ─────────────────────────────────────────────────────────────────

describe('Spinner — sizes', () => {
  const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

  for (const size of sizes) {
    it(`renders ${size} size with correct data-size`, () => {
      render(<Spinner size={size} />);
      expect(screen.getByRole('status')).toHaveAttribute('data-size', size);
    });
  }

  it('defaults to md size', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('data-size', 'md');
  });
});

// ─── 5. Variants ──────────────────────────────────────────────────────────────

describe('Spinner — variants', () => {
  const variants = ['default', 'accent', 'white'] as const;

  for (const variant of variants) {
    it(`renders ${variant} variant with correct data-variant`, () => {
      render(<Spinner variant={variant} />);
      expect(screen.getByRole('status')).toHaveAttribute('data-variant', variant);
    });
  }

  it('defaults to default variant', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('data-variant', 'default');
  });
});

// ─── 6. forwardRef ────────────────────────────────────────────────────────────

describe('Spinner — forwardRef', () => {
  it('forwards ref to the SVGSVGElement', () => {
    const ref = React.createRef<SVGSVGElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });
});

// ─── 7. className ─────────────────────────────────────────────────────────────

describe('Spinner — className', () => {
  it('appends custom className', () => {
    render(<Spinner className="custom" />);
    // SVG className is an SVGAnimatedString — use getAttribute('class')
    expect(screen.getByRole('status').getAttribute('class')).toContain('custom');
  });
});

// ─── 12. Accessibility (axe) ─────────────────────────────────────────────────

describe('Spinner — accessibility (axe)', () => {
  it('default spinner has no axe violations', async () => {
    const { container } = render(<Spinner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('spinner with custom label has no axe violations', async () => {
    const { container } = render(<Spinner label="Uploading" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('accent variant has no axe violations', async () => {
    const { container } = render(<Spinner variant="accent" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('all sizes have no axe violations', async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
    for (const size of sizes) {
      const { container, unmount } = render(<Spinner size={size} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      unmount();
    }
  });
});
