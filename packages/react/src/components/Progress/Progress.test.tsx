import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { Progress } from './Progress';
import { progressContract } from '@vhyxui/core/contracts';

// ─── Helper ───────────────────────────────────────────────────────────────────

function getBar(): HTMLElement {
  return screen.getByRole('progressbar');
}

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Progress — render', () => {
  it('renders without crashing', () => {
    render(<Progress aria-label="Loading" />);
    expect(getBar()).toBeInTheDocument();
  });

  it('renders with role="progressbar"', () => {
    render(<Progress aria-label="Loading" />);
    expect(getBar()).toBeInTheDocument();
  });
});

// ─── 2. ARIA attributes ───────────────────────────────────────────────────────

describe('Progress — ARIA', () => {
  it('sets aria-valuemin="0" always', () => {
    render(<Progress value={50} aria-label="Loading" />);
    expect(getBar()).toHaveAttribute('aria-valuemin', '0');
  });

  it('sets aria-valuemax to max prop', () => {
    render(<Progress value={50} max={200} aria-label="Loading" />);
    expect(getBar()).toHaveAttribute('aria-valuemax', '200');
  });

  it('sets aria-valuenow to value prop', () => {
    render(<Progress value={75} aria-label="Loading" />);
    expect(getBar()).toHaveAttribute('aria-valuenow', '75');
  });

  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress indeterminate aria-label="Loading" />);
    expect(getBar()).not.toHaveAttribute('aria-valuenow');
  });

  it('defaults aria-valuemax to 100', () => {
    render(<Progress value={50} aria-label="Loading" />);
    expect(getBar()).toHaveAttribute('aria-valuemax', '100');
  });
});

// ─── 3. Sizes ─────────────────────────────────────────────────────────────────

describe('Progress — sizes', () => {
  const sizes = ['xs', 'sm', 'md', 'lg'] as const;

  for (const size of sizes) {
    it(`renders ${size} size with correct data-size`, () => {
      const { container } = render(
        <Progress size={size} value={50} aria-label="Loading" />,
      );
      expect(container.firstChild).toHaveAttribute('data-size', size);
    });
  }

  it('defaults to md size', () => {
    const { container } = render(<Progress value={50} aria-label="Loading" />);
    expect(container.firstChild).toHaveAttribute('data-size', 'md');
  });
});

// ─── 4. Variants ──────────────────────────────────────────────────────────────

describe('Progress — variants', () => {
  const variants = ['default', 'success', 'warning', 'danger'] as const;

  for (const variant of variants) {
    it(`renders ${variant} variant with correct data-variant`, () => {
      const { container } = render(
        <Progress variant={variant} value={50} aria-label="Loading" />,
      );
      expect(container.firstChild).toHaveAttribute('data-variant', variant);
    });
  }
});

// ─── 5. Indeterminate state ───────────────────────────────────────────────────

describe('Progress — indeterminate', () => {
  it('fill has data-indeterminate attribute when indeterminate', () => {
    const { container } = render(<Progress indeterminate aria-label="Loading" />);
    const fill = container.querySelector('[data-indeterminate="true"]');
    expect(fill).toBeInTheDocument();
  });

  it('does not have data-indeterminate when determinate', () => {
    const { container } = render(<Progress value={50} aria-label="Loading" />);
    const fill = container.querySelector('[data-indeterminate]');
    expect(fill).toBeNull();
  });
});

// ─── 6. showLabel ─────────────────────────────────────────────────────────────

describe('Progress — showLabel', () => {
  it('renders computed percentage label when showLabel=true', () => {
    render(<Progress value={60} max={100} showLabel aria-label="Loading" />);
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('renders custom label when label prop is provided', () => {
    render(
      <Progress value={2} max={5} showLabel label="Step 2 of 5" aria-label="Loading" />,
    );
    expect(screen.getByText('Step 2 of 5')).toBeInTheDocument();
  });

  it('does not render label when showLabel is false', () => {
    render(<Progress value={60} aria-label="Loading" />);
    expect(screen.queryByText('60%')).toBeNull();
  });
});

// ─── 7. forwardRef ────────────────────────────────────────────────────────────

describe('Progress — forwardRef', () => {
  it('forwards ref to the wrapper HTMLDivElement', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={50} aria-label="Loading" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ─── 8. className ─────────────────────────────────────────────────────────────

describe('Progress — className', () => {
  it('appends custom className to the wrapper', () => {
    const { container } = render(
      <Progress className="custom" value={50} aria-label="Loading" />,
    );
    expect(container.firstChild).toHaveClass('custom');
  });
});

// ─── 12. Accessibility (axe) ─────────────────────────────────────────────────

describe('Progress — accessibility (axe)', () => {
  it('determinate progress has no axe violations', async () => {
    const { container } = render(<Progress value={60} max={100} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('indeterminate progress has no axe violations', async () => {
    const { container } = render(<Progress indeterminate />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('with showLabel has no axe violations', async () => {
    const { container } = render(<Progress value={40} showLabel />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('success variant has no axe violations', async () => {
    const { container } = render(<Progress value={100} variant="success" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('Progress — VhyxSeal contract', () => {
  it('has a valid contract', () => {
    expect(progressContract).toBeDefined();
    expect(typeof progressContract.fingerprint).toBe('string');
    expect(progressContract.fingerprint.length).toBeGreaterThan(0);
    expect(progressContract.intent).toBeDefined();
    expect(progressContract.safetyLevel).toBeDefined();
  });

  it('contract is frozen', () => {
    expect(Object.isFrozen(progressContract)).toBe(true);
  });

  it('contract has valid type', () => {
    expect(['action', 'input', 'navigation', 'display', 'confirmation']).toContain(
      progressContract.type,
    );
  });
});
