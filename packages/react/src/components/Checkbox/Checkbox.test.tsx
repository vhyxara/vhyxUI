import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Checkbox } from './Checkbox';

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Checkbox — render', () => {
  it('renders without crashing', () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('renders with role="checkbox"', () => {
    render(<Checkbox aria-label="Accept" />);
    const cb = screen.getByRole('checkbox');
    expect(cb.tagName).toBe('BUTTON');
  });
});

// ─── 2. Variants — Checkbox has no variants, but has 3 states ─────────────────

describe('Checkbox — checked states', () => {
  it('unchecked: aria-checked is false', () => {
    render(<Checkbox aria-label="Check" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
  });

  it('checked: aria-checked is true', () => {
    render(<Checkbox checked aria-label="Check" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });

  it('indeterminate: aria-checked is "mixed"', () => {
    render(<Checkbox indeterminate aria-label="Check" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'mixed');
  });

  it('data-state="checked" when checked', () => {
    render(<Checkbox checked aria-label="Check" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'checked');
  });

  it('data-state="unchecked" when not checked', () => {
    render(<Checkbox aria-label="Check" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'unchecked');
  });

  it('data-state="indeterminate" when indeterminate', () => {
    render(<Checkbox indeterminate aria-label="Check" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-state', 'indeterminate');
  });
});

// ─── 3. Sizes ─────────────────────────────────────────────────────────────────

describe('Checkbox — sizes', () => {
  const sizes = ['sm', 'md', 'lg'] as const;

  for (const size of sizes) {
    it(`renders ${size} size with correct data-size`, () => {
      render(<Checkbox size={size} aria-label="Check" />);
      expect(screen.getByRole('checkbox')).toHaveAttribute('data-size', size);
    });
  }

  it('defaults to md size', () => {
    render(<Checkbox aria-label="Check" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-size', 'md');
  });
});

// ─── 4 & 5. States — disabled ─────────────────────────────────────────────────

describe('Checkbox — disabled state', () => {
  it('is disabled when disabled prop is set', () => {
    render(<Checkbox disabled aria-label="Check" />);
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });
});

// ─── Animation — check icon present when checked ──────────────────────────────

describe('Checkbox — animation', () => {
  it('renders the check icon SVG when checked', () => {
    render(<Checkbox checked aria-label="Check" />);
    const svg = screen.getByRole('checkbox').querySelector('svg');
    expect(svg).not.toBeNull();
  });

  it('does not render a check icon when unchecked', () => {
    render(<Checkbox aria-label="Check" />);
    const svgs = screen.getByRole('checkbox').querySelectorAll('svg');
    expect(svgs.length).toBe(0);
  });

  it('renders the indeterminate dash icon when indeterminate', () => {
    render(<Checkbox indeterminate aria-label="Check" />);
    const svg = screen.getByRole('checkbox').querySelector('svg');
    expect(svg).not.toBeNull();
  });
});

// ─── 5 & 6. Events ────────────────────────────────────────────────────────────

describe('Checkbox — events', () => {
  it('calls onCheckedChange with true when clicked while unchecked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox defaultChecked={false} onCheckedChange={onCheckedChange} aria-label="Check" />,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('calls onCheckedChange with false when clicked while checked', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox defaultChecked={true} onCheckedChange={onCheckedChange} aria-label="Check" />,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('calls onCheckedChange with true when clicked while indeterminate', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox indeterminate onCheckedChange={onCheckedChange} aria-label="Check" />,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('does not call onCheckedChange when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox disabled onCheckedChange={onCheckedChange} aria-label="Check" />,
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

// ─── 6. Controlled mode ───────────────────────────────────────────────────────

describe('Checkbox — controlled mode', () => {
  it('reflects controlled checked state', () => {
    const { rerender } = render(
      <Checkbox checked={false} onCheckedChange={vi.fn()} aria-label="Check" />,
    );
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
    rerender(
      <Checkbox checked={true} onCheckedChange={vi.fn()} aria-label="Check" />,
    );
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true');
  });
});

// ─── 7. Uncontrolled mode ─────────────────────────────────────────────────────

describe('Checkbox — uncontrolled mode', () => {
  it('toggles state internally when not controlled', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="Check" />);
    const cb = screen.getByRole('checkbox');
    expect(cb).toHaveAttribute('aria-checked', 'false');
    await user.click(cb);
    expect(cb).toHaveAttribute('aria-checked', 'true');
  });
});

// ─── 8. forwardRef ────────────────────────────────────────────────────────────

describe('Checkbox — forwardRef', () => {
  it('forwards ref to the HTMLButtonElement', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} aria-label="Check" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

// ─── 9. className ─────────────────────────────────────────────────────────────

describe('Checkbox — className', () => {
  it('appends custom className', () => {
    render(<Checkbox className="custom" aria-label="Check" />);
    expect(screen.getByRole('checkbox').className).toContain('custom');
  });
});

// ─── 12. asChild ─────────────────────────────────────────────────────────────

describe('Checkbox — asChild', () => {
  it('renders as child element when asChild is true', () => {
    render(
      <Checkbox asChild aria-label="Check">
        <div>custom checkbox</div>
      </Checkbox>,
    );
    expect(screen.queryByRole('checkbox')).not.toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('merges aria-checked onto child when asChild is true', () => {
    render(
      <Checkbox asChild checked={true} aria-label="Check">
        <div>custom</div>
      </Checkbox>,
    );
    const el = screen.getByRole('checkbox');
    expect(el).toHaveAttribute('aria-checked', 'true');
  });

  it('merges className onto child when asChild is true', () => {
    render(
      <Checkbox asChild className="extra" aria-label="Check">
        <div>custom</div>
      </Checkbox>,
    );
    expect(screen.getByRole('checkbox')).toHaveClass('extra');
  });
});

// ─── 13. Accessibility (axe) ─────────────────────────────────────────────────

describe('Checkbox — accessibility (axe)', () => {
  it('unchecked state has no axe violations', async () => {
    const { container } = render(<Checkbox aria-label="Accept terms" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('checked state has no axe violations', async () => {
    const { container } = render(<Checkbox checked aria-label="Accept terms" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('indeterminate state has no axe violations', async () => {
    const { container } = render(
      <Checkbox indeterminate aria-label="Select all" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('disabled state has no axe violations', async () => {
    const { container } = render(
      <Checkbox disabled aria-label="Accept terms" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
