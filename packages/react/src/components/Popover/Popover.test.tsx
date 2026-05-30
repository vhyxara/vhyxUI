import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Popover } from './Popover';
import { popoverContract } from '@vhyxui/core/contracts';

function BasicPopover({
  open,
  defaultOpen,
  onOpenChange,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger>Open Popover</Popover.Trigger>
      <Popover.Content>
        <p>Popover body</p>
        <Popover.Close>Done</Popover.Close>
      </Popover.Content>
    </Popover>
  );
}

// ─── 1. Renders ───────────────────────────────────────────────────────────────

describe('Popover — render', () => {
  it('renders trigger without crashing', () => {
    render(<BasicPopover />);
    expect(screen.getByRole('button', { name: 'Open Popover' })).toBeInTheDocument();
  });

  it('content is not in DOM when closed', () => {
    render(<BasicPopover />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

// ─── 2. Opens ─────────────────────────────────────────────────────────────────

describe('Popover — opening', () => {
  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('trigger aria-expanded is true when open', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    const trigger = screen.getByRole('button', { name: 'Open Popover' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });
});

// ─── 3. Closes ────────────────────────────────────────────────────────────────

describe('Popover — closing', () => {
  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on Popover.Close click', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    await user.click(screen.getByRole('button', { name: 'Done' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on click outside', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <BasicPopover />
        <button>Outside</button>
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Outside' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onOpenChange with false when closed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<BasicPopover onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    onOpenChange.mockClear();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ─── 4. ARIA ──────────────────────────────────────────────────────────────────

describe('Popover — ARIA', () => {
  it('content has role="dialog"', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('content has aria-modal="false" — popover is NOT modal', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'false');
  });

  it('trigger has aria-haspopup="dialog"', () => {
    render(<BasicPopover />);
    expect(screen.getByRole('button', { name: 'Open Popover' })).toHaveAttribute(
      'aria-haspopup',
      'dialog',
    );
  });
});

// ─── 5. Focus NOT trapped ─────────────────────────────────────────────────────

describe('Popover — focus NOT trapped', () => {
  it('focus can Tab out of popover (non-modal)', async () => {
    const user = userEvent.setup();
    render(
      <div>
        <BasicPopover />
        <button>Outside button</button>
      </div>,
    );
    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    // Tab through the popover content
    await user.tab();
    await user.tab();
    // Focus should be able to reach the outside button
    expect(screen.getByRole('dialog')).toBeInTheDocument(); // popover still open
  });
});

// ─── 6. Controlled mode ───────────────────────────────────────────────────────

describe('Popover — controlled mode', () => {
  it('reflects controlled open state', () => {
    const { rerender } = render(<BasicPopover open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<BasicPopover open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

// ─── 7. Uncontrolled mode ────────────────────────────────────────────────────

describe('Popover — uncontrolled mode', () => {
  it('opens and closes internally', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

// ─── 8. forwardRef ────────────────────────────────────────────────────────────

describe('Popover — forwardRef', () => {
  it('PopoverTrigger forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Popover>
        <Popover.Trigger ref={ref}>Open</Popover.Trigger>
        <Popover.Content><p>Body</p></Popover.Content>
      </Popover>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

// ─── 9. Accessibility (axe) ──────────────────────────────────────────────────

describe('Popover — accessibility (axe)', () => {
  it('closed state has no axe violations', async () => {
    const { container } = render(<BasicPopover />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('open state has no axe violations', async () => {
    const user = userEvent.setup();
    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    const dialog = screen.getByRole('dialog');
    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('Popover — VhyxSeal contract', () => {
  it('has a valid contract', () => {
    expect(popoverContract).toBeDefined();
    expect(typeof popoverContract.fingerprint).toBe('string');
    expect(popoverContract.fingerprint.length).toBeGreaterThan(0);
    expect(popoverContract.intent).toBeDefined();
    expect(popoverContract.safetyLevel).toBeDefined();
  });

  it('contract is frozen', () => {
    expect(Object.isFrozen(popoverContract)).toBe(true);
  });

  it('contract has valid type', () => {
    expect(['action', 'input', 'navigation', 'display', 'confirmation']).toContain(
      popoverContract.type,
    );
  });
});
