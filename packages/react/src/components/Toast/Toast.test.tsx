import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { toast } from '../../toast/toast';
import { dismissAllToasts } from '../../toast/toast-store';
import { ToastProvider } from './Toast';
import { toastContract } from '@vhyxui/core/contracts';

// ─── Setup/Teardown ───────────────────────────────────────────────────────────

beforeEach(() => {
  dismissAllToasts();
});

afterEach(() => {
  dismissAllToasts();
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ProviderWrapper({
  position = 'bottom-right',
  maxToasts = 5,
  defaultDuration = Infinity, // disable auto-dismiss in tests by default
}: {
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  maxToasts?: number;
  defaultDuration?: number;
}) {
  return <ToastProvider position={position} maxToasts={maxToasts} defaultDuration={defaultDuration} />;
}

// ─── 1. Toast store ───────────────────────────────────────────────────────────

describe('toast store — imperative API', () => {
  it('toast() pushes a default toast', () => {
    render(<ProviderWrapper />);
    act(() => { toast('Hello'); });
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('toast.success() renders a success variant', () => {
    render(<ProviderWrapper />);
    act(() => { toast.success('Upload complete'); });
    const item = screen.getByText('Upload complete').closest('[data-variant]');
    expect(item).toHaveAttribute('data-variant', 'success');
  });

  it('toast.danger() renders a danger variant', () => {
    render(<ProviderWrapper />);
    act(() => { toast.danger('Failed'); });
    const item = screen.getByText('Failed').closest('[data-variant]');
    expect(item).toHaveAttribute('data-variant', 'danger');
  });

  it('toast.warning() renders a warning variant', () => {
    render(<ProviderWrapper />);
    act(() => { toast.warning('Low storage'); });
    const item = screen.getByText('Low storage').closest('[data-variant]');
    expect(item).toHaveAttribute('data-variant', 'warning');
  });

  it('toast.info() renders an info variant', () => {
    render(<ProviderWrapper />);
    act(() => { toast.info('Update ready'); });
    const item = screen.getByText('Update ready').closest('[data-variant]');
    expect(item).toHaveAttribute('data-variant', 'info');
  });

  it('toast.dismiss(id) removes a specific toast', () => {
    render(<ProviderWrapper />);
    let id: string;
    act(() => { id = toast('Keep me'); toast('Remove me'); });
    expect(screen.getByText('Keep me')).toBeInTheDocument();
    expect(screen.getByText('Remove me')).toBeInTheDocument();
    act(() => { toast.dismiss(id!); });
    expect(screen.queryByText('Keep me')).toBeNull();
    expect(screen.getByText('Remove me')).toBeInTheDocument();
  });

  it('toast.dismiss() with no arg removes all toasts', () => {
    render(<ProviderWrapper />);
    act(() => { toast('A'); toast('B'); });
    expect(screen.getByText('A')).toBeInTheDocument();
    act(() => { toast.dismiss(); });
    expect(screen.queryByText('A')).toBeNull();
    expect(screen.queryByText('B')).toBeNull();
  });
});

// ─── 2. Toast region ARIA ────────────────────────────────────────────────────

describe('ToastProvider — ARIA', () => {
  it('toast region has role="status"', () => {
    render(<ProviderWrapper />);
    expect(screen.getByRole('status', { name: 'Notifications' })).toBeInTheDocument();
  });

  it('toast region has aria-live="polite"', () => {
    render(<ProviderWrapper />);
    const region = screen.getByRole('status', { name: 'Notifications' });
    expect(region).toHaveAttribute('aria-live', 'polite');
  });

  it('toast region has data-position attribute', () => {
    render(<ProviderWrapper position="top-right" />);
    const region = screen.getByRole('status', { name: 'Notifications' });
    expect(region).toHaveAttribute('data-position', 'top-right');
  });
});

// ─── 3. Dismiss button ───────────────────────────────────────────────────────

describe('Toast — dismiss button', () => {
  it('renders dismiss button with aria-label="Dismiss"', () => {
    render(<ProviderWrapper />);
    act(() => { toast('Click to dismiss'); });
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('dismiss button removes the toast', async () => {
    const user = userEvent.setup();
    render(<ProviderWrapper />);
    act(() => { toast('Hello'); });
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByText('Hello')).toBeNull();
  });
});

// ─── 4. Auto-dismiss (fake timers) ───────────────────────────────────────────

describe('Toast — auto-dismiss', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('auto-dismisses after duration ms', () => {
    render(<ProviderWrapper defaultDuration={1000} />);
    act(() => { toast('Auto-remove', { duration: 1000 }); });
    expect(screen.getByText('Auto-remove')).toBeInTheDocument();

    act(() => void vi.advanceTimersByTime(1000));
    expect(screen.queryByText('Auto-remove')).toBeNull();
  });

  it('does not auto-dismiss when duration=Infinity', () => {
    render(<ProviderWrapper defaultDuration={Infinity} />);
    act(() => { toast('Stay', { duration: Infinity }); });

    act(() => void vi.advanceTimersByTime(60000));
    expect(screen.getByText('Stay')).toBeInTheDocument();
  });
});

// ─── 5. maxToasts ────────────────────────────────────────────────────────────

describe('Toast — maxToasts', () => {
  it('oldest toast is removed when maxToasts is exceeded', () => {
    render(<ProviderWrapper maxToasts={2} />);
    act(() => {
      toast('First');
      toast('Second');
      toast('Third');
    });
    expect(screen.queryByText('First')).toBeNull(); // oldest removed
    expect(screen.getByText('Second')).toBeInTheDocument();
    expect(screen.getByText('Third')).toBeInTheDocument();
  });
});

// ─── 6. Action ───────────────────────────────────────────────────────────────

describe('Toast — action', () => {
  it('renders action button with label', () => {
    render(<ProviderWrapper />);
    const onClick = vi.fn();
    act(() => { toast('Update', { action: { label: 'Install', onClick } }); });
    expect(screen.getByRole('button', { name: 'Install' })).toBeInTheDocument();
  });

  it('action button calls onClick and dismisses toast', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<ProviderWrapper />);
    act(() => { toast('Update', { action: { label: 'Install', onClick } }); });
    await user.click(screen.getByRole('button', { name: 'Install' }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.queryByText('Update')).toBeNull();
  });
});

// ─── 7. Description ──────────────────────────────────────────────────────────

describe('Toast — description', () => {
  it('renders description text', () => {
    render(<ProviderWrapper />);
    act(() => { toast('Saved', { description: 'Your changes have been saved.' }); });
    expect(screen.getByText('Your changes have been saved.')).toBeInTheDocument();
  });
});

// ─── 8. Accessibility (axe) ──────────────────────────────────────────────────

describe('Toast — accessibility (axe)', () => {
  it('empty provider has no axe violations', async () => {
    const { container } = render(<ProviderWrapper />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('toast region with toasts has no axe violations', async () => {
    const { container } = render(<ProviderWrapper />);
    act(() => { toast('Hello world'); });
    const results = await axe(container, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });

  it('success toast has no axe violations', async () => {
    const { container } = render(<ProviderWrapper />);
    act(() => { toast.success('Done!'); });
    const results = await axe(container, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('Toast — VhyxSeal contract', () => {
  it('has a valid contract', () => {
    expect(toastContract).toBeDefined();
    expect(typeof toastContract.fingerprint).toBe('string');
    expect(toastContract.fingerprint.length).toBeGreaterThan(0);
    expect(toastContract.intent).toBeDefined();
    expect(toastContract.safetyLevel).toBeDefined();
  });

  it('contract is frozen', () => {
    expect(Object.isFrozen(toastContract)).toBe(true);
  });

  it('contract has valid type', () => {
    expect(['action', 'input', 'navigation', 'display', 'confirmation']).toContain(
      toastContract.type,
    );
  });
});
