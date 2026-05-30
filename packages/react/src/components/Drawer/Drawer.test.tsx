import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Drawer } from './Drawer';
import { drawerContract } from '@vhyxui/core/contracts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicDrawer({
  open,
  onOpenChange,
  side = 'right',
  size = 'md',
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: 'left' | 'right' | 'top' | 'bottom';
  size?: 'sm' | 'md' | 'lg' | 'full';
}) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} side={side} size={size}>
      <Drawer.Trigger>Open Drawer</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Test Drawer</Drawer.Title>
          <Drawer.Description>Drawer content.</Drawer.Description>
          <button>Action</button>
          <Drawer.Close>Close</Drawer.Close>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer>
  );
}

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Drawer — render', () => {
  it('renders trigger without crashing', () => {
    render(<BasicDrawer />);
    expect(screen.getByRole('button', { name: 'Open Drawer' })).toBeInTheDocument();
  });

  it('content is not in DOM when closed', () => {
    render(<BasicDrawer />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

// ─── 2. Opens on trigger click ────────────────────────────────────────────────

describe('Drawer — opening', () => {
  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders Drawer.Title when open', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    expect(screen.getByText('Test Drawer')).toBeInTheDocument();
  });
});

// ─── 3. Closes ────────────────────────────────────────────────────────────────

describe('Drawer — closing', () => {
  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on Drawer.Close click', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onOpenChange with false when closed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<BasicDrawer onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    onOpenChange.mockClear();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ─── 4. Focus management ──────────────────────────────────────────────────────

describe('Drawer — focus management', () => {
  it('moves focus inside drawer on open', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
    });
  });

  it('returns focus to trigger when drawer closes', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    const trigger = screen.getByRole('button', { name: 'Open Drawer' });
    await user.click(trigger);
    await user.keyboard('{Escape}');
    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('Tab does not escape Drawer.Content', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    await waitFor(() => {
      expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
    });

    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>('button');
    // Tab through all elements — should wrap around
    for (let i = 1; i < focusable.length; i++) {
      await user.tab();
    }
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});

// ─── 5. side and size props ───────────────────────────────────────────────────

describe('Drawer — side prop', () => {
  const sides = ['left', 'right', 'top', 'bottom'] as const;

  for (const side of sides) {
    it(`${side} drawer sets data-side="${side}" on content`, async () => {
      const user = userEvent.setup();
      render(<BasicDrawer side={side} />);
      await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
      expect(screen.getByRole('dialog')).toHaveAttribute('data-side', side);
    });
  }
});

describe('Drawer — size prop', () => {
  const sizes = ['sm', 'md', 'lg', 'full'] as const;

  for (const size of sizes) {
    it(`${size} drawer sets data-size="${size}" on content`, async () => {
      const user = userEvent.setup();
      render(<BasicDrawer size={size} />);
      await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
      expect(screen.getByRole('dialog')).toHaveAttribute('data-size', size);
    });
  }
});

// ─── 6. ARIA ──────────────────────────────────────────────────────────────────

describe('Drawer — ARIA', () => {
  it('content has role="dialog"', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('content has aria-modal="true"', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('aria-labelledby points to Drawer.Title id', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Test Drawer');
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(title.id).toBeTruthy();
  });
});

// ─── 7. Scroll lock ───────────────────────────────────────────────────────────

describe('Drawer — scroll lock', () => {
  it('locks scroll when open', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores scroll when closed', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});

// ─── 8. Dev warning for missing title ─────────────────────────────────────────

describe('Drawer — dev warning', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });
  afterEach(() => vi.restoreAllMocks());

  it('warns when Drawer.Title is absent', async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <Drawer.Trigger>Open</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Content>
            <p>No title</p>
            <Drawer.Close>Close</Drawer.Close>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('Drawer.Title'));
  });

  it('does not warn when Drawer.Title is present', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    expect(console.warn).not.toHaveBeenCalledWith(
      expect.stringContaining('Drawer.Title'),
    );
  });
});

// ─── 9. Controlled mode ───────────────────────────────────────────────────────

describe('Drawer — controlled mode', () => {
  it('reflects controlled open state', () => {
    const { rerender } = render(<BasicDrawer open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<BasicDrawer open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});

// ─── 10. forwardRef ───────────────────────────────────────────────────────────

describe('Drawer — forwardRef', () => {
  it('DrawerTrigger forwards ref to HTMLButtonElement', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Drawer>
        <Drawer.Trigger ref={ref}>Open</Drawer.Trigger>
        <Drawer.Portal>
          <Drawer.Content>
            <Drawer.Title>Test</Drawer.Title>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

// ─── 11. Accessibility (axe) ─────────────────────────────────────────────────

describe('Drawer — accessibility (axe)', () => {
  it('closed state has no axe violations', async () => {
    const { container } = render(<BasicDrawer />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('open state has no axe violations', async () => {
    const user = userEvent.setup();
    render(<BasicDrawer />);
    await user.click(screen.getByRole('button', { name: 'Open Drawer' }));
    const dialog = screen.getByRole('dialog');
    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('Drawer — VhyxSeal contract', () => {
  it('has a valid contract', () => {
    expect(drawerContract).toBeDefined();
    expect(typeof drawerContract.fingerprint).toBe('string');
    expect(drawerContract.fingerprint.length).toBeGreaterThan(0);
    expect(drawerContract.intent).toBeDefined();
    expect(drawerContract.safetyLevel).toBeDefined();
  });

  it('contract is frozen', () => {
    expect(Object.isFrozen(drawerContract)).toBe(true);
  });

  it('contract has valid type', () => {
    expect(['action', 'input', 'navigation', 'display', 'confirmation']).toContain(
      drawerContract.type,
    );
  });
});
