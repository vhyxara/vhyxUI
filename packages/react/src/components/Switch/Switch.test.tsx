import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Switch } from './Switch';

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Switch — render', () => {
  it('renders without crashing', () => {
    render(<Switch aria-label="Enable feature" />);
    expect(screen.getByRole('switch')).toBeInTheDocument();
  });

  it('renders as a button element with role="switch"', () => {
    render(<Switch aria-label="Enable feature" />);
    const sw = screen.getByRole('switch');
    expect(sw.tagName).toBe('BUTTON');
  });
});

// ─── 2. States ────────────────────────────────────────────────────────────────

describe('Switch — states', () => {
  it('aria-checked is false by default', () => {
    render(<Switch aria-label="Enable" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
  });

  it('aria-checked is true when checked', () => {
    render(<Switch checked aria-label="Enable" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });

  it('data-state="unchecked" when off', () => {
    render(<Switch aria-label="Enable" />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'unchecked');
  });

  it('data-state="checked" when on', () => {
    render(<Switch checked aria-label="Enable" />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-state', 'checked');
  });
});

// ─── 3. Sizes ─────────────────────────────────────────────────────────────────

describe('Switch — sizes', () => {
  const sizes = ['sm', 'md', 'lg'] as const;

  for (const size of sizes) {
    it(`renders ${size} size with correct data-size`, () => {
      render(<Switch size={size} aria-label="Enable" />);
      expect(screen.getByRole('switch')).toHaveAttribute('data-size', size);
    });
  }

  it('defaults to md size', () => {
    render(<Switch aria-label="Enable" />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'md');
  });
});

// ─── 4. Disabled state ────────────────────────────────────────────────────────

describe('Switch — disabled', () => {
  it('is disabled when disabled prop is set', () => {
    render(<Switch disabled aria-label="Enable" />);
    expect(screen.getByRole('switch')).toBeDisabled();
  });

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch disabled onCheckedChange={onCheckedChange} aria-label="Enable" />);
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});

// ─── 5. Events — click ────────────────────────────────────────────────────────

describe('Switch — click toggle', () => {
  it('calls onCheckedChange with true when toggled on', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch defaultChecked={false} onCheckedChange={onCheckedChange} aria-label="Enable" />);
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('calls onCheckedChange with false when toggled off', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch defaultChecked={true} onCheckedChange={onCheckedChange} aria-label="Enable" />);
    await user.click(screen.getByRole('switch'));
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });
});

// ─── 5b. Events — keyboard ────────────────────────────────────────────────────

describe('Switch — keyboard toggle', () => {
  it('Space toggles the switch', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch defaultChecked={false} onCheckedChange={onCheckedChange} aria-label="Enable" />);
    screen.getByRole('switch').focus();
    await user.keyboard(' ');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('Enter toggles the switch', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch defaultChecked={false} onCheckedChange={onCheckedChange} aria-label="Enable" />);
    screen.getByRole('switch').focus();
    await user.keyboard('{Enter}');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });
});

// ─── 6. Controlled mode ───────────────────────────────────────────────────────

describe('Switch — controlled mode', () => {
  it('reflects controlled checked state', () => {
    const { rerender } = render(
      <Switch checked={false} onCheckedChange={vi.fn()} aria-label="Enable" />,
    );
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    rerender(<Switch checked={true} onCheckedChange={vi.fn()} aria-label="Enable" />);
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
  });
});

// ─── 7. Uncontrolled mode ─────────────────────────────────────────────────────

describe('Switch — uncontrolled mode', () => {
  it('toggles internal state on click', async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="Enable" />);
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAttribute('aria-checked', 'false');
    await user.click(sw);
    expect(sw).toHaveAttribute('aria-checked', 'true');
  });
});

// ─── 8. forwardRef ────────────────────────────────────────────────────────────

describe('Switch — forwardRef', () => {
  it('forwards ref to the HTMLButtonElement', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Switch ref={ref} aria-label="Enable" />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

// ─── 9. className ─────────────────────────────────────────────────────────────

describe('Switch — className', () => {
  it('appends custom className', () => {
    render(<Switch className="custom-switch" aria-label="Enable" />);
    expect(screen.getByRole('switch').className).toContain('custom-switch');
  });
});

// ─── 10. VhyxSeal contract ────────────────────────────────────────────────────

describe('Switch — VhyxSeal contract', () => {
  it('attaches a VhyxSeal contract via data-vhyx-contract', () => {
    render(<Switch aria-label="Enable" />);
    const raw = screen.getByRole('switch').getAttribute('data-vhyx-contract');
    expect(raw).not.toBeNull();
    const contract = JSON.parse(raw ?? '{}') as Record<string, unknown>;
    expect(contract['type']).toBe('input');
    expect(contract['intent']).toBe('toggle-state');
  });
});

// ─── 12. asChild ─────────────────────────────────────────────────────────────

describe('Switch — asChild', () => {
  it('renders as child element when asChild is true', () => {
    render(
      <Switch asChild aria-label="Toggle">
        <div>custom switch</div>
      </Switch>,
    );
    expect(screen.queryByRole('switch')).not.toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('merges aria-checked onto child when asChild is true', () => {
    render(
      <Switch asChild checked={true} aria-label="Toggle">
        <div>custom</div>
      </Switch>,
    );
    const el = screen.getByRole('switch');
    expect(el).toHaveAttribute('aria-checked', 'true');
  });

  it('merges className onto child when asChild is true', () => {
    render(
      <Switch asChild className="extra" aria-label="Toggle">
        <div>custom</div>
      </Switch>,
    );
    expect(screen.getByRole('switch')).toHaveClass('extra');
  });
});

// ─── 13. Accessibility (axe) ─────────────────────────────────────────────────

describe('Switch — accessibility (axe)', () => {
  it('off state has no axe violations', async () => {
    const { container } = render(<Switch aria-label="Enable notifications" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('on state has no axe violations', async () => {
    const { container } = render(
      <Switch checked aria-label="Enable notifications" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('disabled state has no axe violations', async () => {
    const { container } = render(
      <Switch disabled aria-label="Enable notifications" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('all sizes have no axe violations', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { container, unmount } = render(
        <Switch size={size} aria-label="Enable" />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      unmount();
    }
  });
});
