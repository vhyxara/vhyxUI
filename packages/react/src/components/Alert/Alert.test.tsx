import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Alert } from './Alert';

// ─── 1. Rendering ─────────────────────────────────────────────────────────────

describe('Alert — rendering', () => {
  it('renders without crashing', () => {
    render(<Alert>Something happened.</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders children as message', () => {
    render(<Alert>Message text</Alert>);
    expect(screen.getByText('Message text')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Alert title="Error occurred">Details here.</Alert>);
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('renders default icon when no icon prop is given', () => {
    const { container } = render(<Alert variant="success">Done</Alert>);
    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).not.toBeNull();
  });

  it('renders custom icon when icon prop is given', () => {
    render(<Alert icon={<span data-testid="custom-icon">★</span>}>Message</Alert>);
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});

// ─── 2. Variants ─────────────────────────────────────────────────────────────

describe('Alert — variants', () => {
  const variants = ['default', 'success', 'warning', 'danger', 'info'] as const;

  for (const variant of variants) {
    it(`renders ${variant} variant with data-variant attribute`, () => {
      render(<Alert variant={variant}>Text</Alert>);
      const el = screen.getByRole(variant === 'danger' ? 'alert' : 'status');
      expect(el).toHaveAttribute('data-variant', variant);
    });
  }
});

// ─── 3. ARIA roles ────────────────────────────────────────────────────────────

describe('Alert — ARIA roles', () => {
  it('default variant has role="status"', () => {
    render(<Alert>Note</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('success variant has role="status"', () => {
    render(<Alert variant="success">Done</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('warning variant has role="status"', () => {
    render(<Alert variant="warning">Watch out</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('info variant has role="status"', () => {
    render(<Alert variant="info">FYI</Alert>);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('danger variant has role="alert" (assertive)', () => {
    render(<Alert variant="danger">Error!</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('danger variant has aria-live="assertive"', () => {
    render(<Alert variant="danger">Error!</Alert>);
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });

  it('non-danger variant has aria-live="polite"', () => {
    render(<Alert variant="success">Done</Alert>);
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });
});

// ─── 4. Dismiss button ───────────────────────────────────────────────────────

describe('Alert — dismiss button', () => {
  it('does not render dismiss button by default', () => {
    render(<Alert>Message</Alert>);
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull();
  });

  it('renders dismiss button when dismissible=true', () => {
    render(<Alert dismissible>Message</Alert>);
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('dismiss button removes alert from DOM', async () => {
    const user = userEvent.setup();
    render(<Alert dismissible>Gone soon</Alert>);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Gone soon')).toBeNull();
  });

  it('dismiss button calls onDismiss callback', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(<Alert dismissible onDismiss={onDismiss}>Message</Alert>);
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
  });
});

// ─── 5. forwardRef ────────────────────────────────────────────────────────────

describe('Alert — forwardRef', () => {
  it('forwards ref to the root div', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Message</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ─── 6. className ─────────────────────────────────────────────────────────────

describe('Alert — className', () => {
  it('appends custom className', () => {
    render(<Alert className="custom-class">Message</Alert>);
    const el = screen.getByRole('status');
    expect(el.getAttribute('class')).toContain('custom-class');
  });
});

// ─── 7. VhyxSeal contract ─────────────────────────────────────────────────────

describe('Alert — VhyxSeal contract', () => {
  it('has data-vhyx-contract attribute', () => {
    render(<Alert>Message</Alert>);
    const el = screen.getByRole('status');
    const raw = el.getAttribute('data-vhyx-contract');
    expect(raw).not.toBeNull();
    const contract = JSON.parse(raw!) as Record<string, unknown>;
    expect(contract['type']).toBe('display');
  });

  it('contract prop merges onto default contract', () => {
    render(<Alert contract={{ safetyLevel: 'high' }}>Danger message</Alert>);
    const el = screen.getByRole('status');
    const contract = JSON.parse(el.getAttribute('data-vhyx-contract')!) as Record<string, unknown>;
    expect(contract['safetyLevel']).toBe('high');
  });
});

// ─── 8. Persistent — no auto-dismiss ─────────────────────────────────────────

describe('Alert — persistent', () => {
  it('remains visible after a long time (no auto-dismiss)', async () => {
    vi.useFakeTimers();
    render(<Alert>I persist</Alert>);
    vi.advanceTimersByTime(60_000);
    expect(screen.getByText('I persist')).toBeInTheDocument();
    vi.useRealTimers();
  });
});

// ─── 9. Accessibility (axe) ──────────────────────────────────────────────────

describe('Alert — accessibility (axe)', () => {
  it('default alert has no axe violations', async () => {
    const { container } = render(<Alert>Default message</Alert>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('success alert has no axe violations', async () => {
    const { container } = render(
      <Alert variant="success" title="Saved">Your file was saved.</Alert>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('danger alert has no axe violations', async () => {
    const { container } = render(<Alert variant="danger">An error occurred.</Alert>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('dismissible alert has no axe violations', async () => {
    const { container } = render(
      <Alert dismissible onDismiss={vi.fn()}>Dismissible message</Alert>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
