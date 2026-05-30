import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { Separator } from './Separator';
import { separatorContract } from '@vhyxui/core/contracts';

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Separator — render', () => {
  it('renders without crashing (decorative)', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders as an <hr> element by default', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('hr')).toBeInTheDocument();
  });
});

// ─── 2. decorative=true — aria-hidden ─────────────────────────────────────────

describe('Separator — decorative', () => {
  it('decorative=true sets aria-hidden="true"', () => {
    const { container } = render(<Separator decorative />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('decorative=true (default) sets aria-hidden', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('decorative=false sets role="separator"', () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('decorative=false does not set aria-hidden', () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).not.toHaveAttribute('aria-hidden');
  });

  it('decorative=false sets aria-orientation="horizontal" by default', () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal');
  });

  it('decorative=false with vertical sets aria-orientation="vertical"', () => {
    render(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });
});

// ─── 3. Orientation ───────────────────────────────────────────────────────────

describe('Separator — orientation', () => {
  it('defaults to horizontal', () => {
    const { container } = render(<Separator />);
    expect(container.firstChild).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('renders vertical orientation', () => {
    const { container } = render(<Separator orientation="vertical" />);
    expect(container.firstChild).toHaveAttribute('data-orientation', 'vertical');
  });
});

// ─── 4. Label ─────────────────────────────────────────────────────────────────

describe('Separator — label', () => {
  it('renders label text when label prop is provided', () => {
    render(<Separator label="OR" />);
    expect(screen.getByText('OR')).toBeInTheDocument();
  });

  it('labeled separator renders two line divs and the text', () => {
    const { container } = render(<Separator label="or" />);
    // The label text and two line spans
    expect(container.querySelector('[class*="label-text"]')).toBeInTheDocument();
    expect(container.querySelectorAll('[class*="line"]')).toHaveLength(2);
  });
});

// ─── 5. forwardRef ────────────────────────────────────────────────────────────

describe('Separator — forwardRef', () => {
  it('forwards ref to the element', () => {
    const ref = React.createRef<HTMLElement>();
    render(<Separator ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});

// ─── 6. className ─────────────────────────────────────────────────────────────

describe('Separator — className', () => {
  it('appends custom className', () => {
    const { container } = render(<Separator className="custom" />);
    expect(container.firstChild).toHaveClass('custom');
  });
});

// ─── 12. Accessibility (axe) ─────────────────────────────────────────────────

describe('Separator — accessibility (axe)', () => {
  it('decorative horizontal separator has no axe violations', async () => {
    const { container } = render(<Separator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('semantic horizontal separator has no axe violations', async () => {
    const { container } = render(<Separator decorative={false} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('decorative vertical separator has no axe violations', async () => {
    const { container } = render(<Separator orientation="vertical" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('labeled separator has no axe violations', async () => {
    const { container } = render(<Separator label="OR" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('Separator — VhyxSeal contract', () => {
  it('has a valid contract', () => {
    expect(separatorContract).toBeDefined();
    expect(typeof separatorContract.fingerprint).toBe('string');
    expect(separatorContract.fingerprint.length).toBeGreaterThan(0);
    expect(separatorContract.intent).toBeDefined();
    expect(separatorContract.safetyLevel).toBeDefined();
  });

  it('contract is frozen', () => {
    expect(Object.isFrozen(separatorContract)).toBe(true);
  });

  it('contract has valid type', () => {
    expect(['action', 'input', 'navigation', 'display', 'confirmation']).toContain(
      separatorContract.type,
    );
  });
});
