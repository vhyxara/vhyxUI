import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Tooltip } from './Tooltip';
import { tooltipContract } from '@vhyxui/core/contracts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicTooltip({ delay = 400 }: { delay?: number }) {
  return (
    <Tooltip content="Helpful tip" delayDuration={delay}>
      <button type="button">Hover me</button>
    </Tooltip>
  );
}

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Tooltip — render', () => {
  it('renders the trigger without crashing', () => {
    render(<BasicTooltip />);
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('tooltip is not visible initially', () => {
    render(<BasicTooltip />);
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});

// ─── 2. Shows on hover (fake timers via fireEvent) ────────────────────────────

describe('Tooltip — hover (fake timers)', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('shows tooltip after delay on mouseenter', () => {
    render(<BasicTooltip delay={200} />);
    const trigger = screen.getByRole('button', { name: 'Hover me' });

    fireEvent.mouseEnter(trigger);
    // Before delay — tooltip not visible
    expect(screen.queryByRole('tooltip')).toBeNull();

    act(() => void vi.advanceTimersByTime(200));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    expect(screen.getByRole('tooltip').textContent).toBe('Helpful tip');
  });

  it('hides tooltip on mouse leave after skipDelayDuration', () => {
    render(<BasicTooltip delay={0} />);
    const trigger = screen.getByRole('button', { name: 'Hover me' });

    fireEvent.mouseEnter(trigger);
    act(() => void vi.advanceTimersByTime(0));
    expect(screen.getByRole('tooltip')).toBeInTheDocument();

    fireEvent.mouseLeave(trigger);
    act(() => void vi.advanceTimersByTime(300)); // skipDelayDuration
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});

// ─── 3. Shows on focus ────────────────────────────────────────────────────────

describe('Tooltip — focus', () => {
  it('shows tooltip immediately on focus (no delay)', async () => {
    const user = userEvent.setup();
    render(<BasicTooltip />);
    await user.tab(); // focus the button
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('hides tooltip on blur', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <BasicTooltip />
        <button>Next</button>
      </div>,
    );
    await user.tab(); // focus trigger
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.tab(); // blur trigger → focus Next
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});

// ─── 4. Hides on Escape ───────────────────────────────────────────────────────

describe('Tooltip — Escape', () => {
  it('hides tooltip on Escape key', async () => {
    const user = userEvent.setup();
    render(<BasicTooltip />);
    await user.tab();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
  });
});

// ─── 5. ARIA ──────────────────────────────────────────────────────────────────

describe('Tooltip — ARIA', () => {
  it('tooltip has role="tooltip"', async () => {
    const user = userEvent.setup();
    render(<BasicTooltip />);
    await user.tab();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  });

  it('trigger gets aria-describedby pointing to tooltip id when visible', async () => {
    const user = userEvent.setup();
    render(<BasicTooltip />);
    const trigger = screen.getByRole('button', { name: 'Hover me' });
    await user.tab();
    const tooltip = screen.getByRole('tooltip');
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
    expect(tooltip.id).toBeTruthy();
  });

  it('trigger has no aria-describedby when tooltip is hidden', () => {
    render(<BasicTooltip />);
    expect(screen.getByRole('button', { name: 'Hover me' })).not.toHaveAttribute(
      'aria-describedby',
    );
  });
});

// ─── 6. Side prop ─────────────────────────────────────────────────────────────

describe('Tooltip — side prop', () => {
  const sides = ['top', 'right', 'bottom', 'left'] as const;

  for (const side of sides) {
    it(`renders ${side} side with correct data-side`, async () => {
      const user = userEvent.setup();
      render(
        <Tooltip content="Tip" side={side} delayDuration={0}>
          <button>Trigger</button>
        </Tooltip>,
      );
      await user.tab();
      expect(screen.getByRole('tooltip')).toHaveAttribute('data-side', side);
    });
  }
});

// ─── 7. Accessibility (axe) ──────────────────────────────────────────────────

describe('Tooltip — accessibility (axe)', () => {
  it('trigger without tooltip has no axe violations', async () => {
    const { container } = render(<BasicTooltip />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('visible tooltip has no axe violations', async () => {
    const user = userEvent.setup();
    render(<BasicTooltip />);
    await user.tab();
    // Test the trigger element with its aria-describedby
    const { container } = render(<BasicTooltip />);
    await user.tab();
    const results = await axe(document.body, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('Tooltip — VhyxSeal contract', () => {
  it('has a valid contract', () => {
    expect(tooltipContract).toBeDefined();
    expect(typeof tooltipContract.fingerprint).toBe('string');
    expect(tooltipContract.fingerprint.length).toBeGreaterThan(0);
    expect(tooltipContract.intent).toBeDefined();
    expect(tooltipContract.safetyLevel).toBeDefined();
  });

  it('contract is frozen', () => {
    expect(Object.isFrozen(tooltipContract)).toBe(true);
  });

  it('contract has valid type', () => {
    expect(['action', 'input', 'navigation', 'display', 'confirmation']).toContain(
      tooltipContract.type,
    );
  });
});
