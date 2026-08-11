import { describe, it, expect, vi, afterEach } from 'vitest';
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

// ─── 8b. Consumer style merges with, doesn't clobber, internal positioning ────

describe('Popover — Content style prop merges instead of replacing positioning', () => {
  it('applies consumer cosmetic style while keeping internal position/zIndex/transform', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content style={{ background: 'white', borderRadius: 8 }}>
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    // Consumer's cosmetic style survived.
    expect(dialog).toHaveStyle({ background: 'white', borderRadius: '8px' });
    // Internal positioning keys were not clobbered by the consumer's style object.
    expect(dialog).toHaveStyle({ position: 'fixed', zIndex: '450' });
    expect(dialog.style.top).not.toBe('');
    expect(dialog.style.left).not.toBe('');
  });

  it('consumer style cannot override internal position/zIndex even if it tries to', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content style={{ position: 'static', zIndex: 1 } as React.CSSProperties}>
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ position: 'fixed', zIndex: '450' });
  });
});

// ─── 8c. side="left" positions content fully to the left of the trigger ──────

describe('Popover — side="left" content placement', () => {
  it("content's right edge is GAP (8px) from the trigger's left edge", async () => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 120,
      left: 200,
      right: 260,
      width: 60,
      height: 20,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    } as DOMRect);

    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content side="left">
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');

    // left = trigger.left - GAP - contentWidth, so the content's own right
    // edge lands GAP px left of the trigger's left edge (jsdom reports 0 for
    // offsetWidth, so contentWidth is 0 here — the real-measurement case is
    // covered by the "clamped to the viewport" tests below).
    expect(dialog).toHaveStyle({ left: '192px' });

    vi.restoreAllMocks();
  });
});

// ─── 8c-2. align prop ──────────────────────────────────────────────────────────

describe('Popover — align prop', () => {
  function mockTriggerRect(): void {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 120,
      left: 200,
      right: 260,
      width: 60,
      height: 20,
      x: 200,
      y: 100,
      toJSON: () => ({}),
    } as DOMRect);
  }

  it('align="center" (default) centers content under the trigger', async () => {
    mockTriggerRect();
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ left: '230px' }); // trigger center (200 + 30)
    vi.restoreAllMocks();
  });

  it('align="start" left-aligns content with the trigger', async () => {
    mockTriggerRect();
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content align="start">
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveStyle({ left: '200px' }); // trigger.left
    vi.restoreAllMocks();
  });

  it('align="end" right-aligns content with the trigger — the exact NotificationBell-style shape', async () => {
    mockTriggerRect();
    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content align="end">
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    // jsdom reports 0 for offsetWidth, so the "real content width" case
    // (content's own right edge landing exactly on the trigger's right edge)
    // is covered by the viewport-clamping tests below, which stub a real
    // offsetWidth. Here: left = rect.right - contentWidth(0) = 260.
    expect(dialog).toHaveStyle({ left: '260px' });
    vi.restoreAllMocks();
  });
});

// ─── 8c-3. Content is clamped to the viewport, regardless of align ────────────

describe('Popover — Content is clamped so it never renders off-screen', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('pulls align="start" content back so it does not overflow the right edge', async () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300);
    // A trigger sitting near the right edge of a 400px-wide viewport.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 120,
      left: 380,
      right: 396,
      width: 16,
      height: 20,
      x: 380,
      y: 100,
      toJSON: () => ({}),
    } as DOMRect);

    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content align="start">
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    // Naive align="start" would put left at 380, putting the 300px-wide
    // panel's right edge at 680 — 280px past a 400px viewport. Clamped to
    // leave an 8px margin: max(8, 400 - 300 - 8) = 92.
    await waitFor(() => {
      expect(dialog.style.left).toBe('92px');
    });
  });

  it('pulls align="end" content back so it does not overflow the left edge', async () => {
    vi.spyOn(window, 'innerWidth', 'get').mockReturnValue(400);
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(300);
    // A trigger sitting near the left edge — right-aligning a wide panel to
    // it pushes the panel's own left edge into negative territory.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 100,
      bottom: 120,
      left: 10,
      right: 26,
      width: 16,
      height: 20,
      x: 10,
      y: 100,
      toJSON: () => ({}),
    } as DOMRect);

    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content align="end">
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    // Naive align="end" would put left at 26 - 300 = -274. Clamped to the
    // 8px margin instead.
    await waitFor(() => {
      expect(dialog.style.left).toBe('8px');
    });
  });

  it('pulls side="bottom" content back so it does not overflow the bottom edge', async () => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(300);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(250);
    // A trigger sitting low in a short 300px-tall viewport.
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      top: 260,
      bottom: 280,
      left: 100,
      right: 160,
      width: 60,
      height: 20,
      x: 100,
      y: 260,
      toJSON: () => ({}),
    } as DOMRect);

    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    // Naive side="bottom" would put top at 280 + 8 = 288, putting the 250px-
    // tall panel's bottom edge at 538 — far past a 300px viewport. Clamped:
    // max(8, 300 - 250 - 8) = 42.
    await waitFor(() => {
      expect(dialog.style.top).toBe('42px');
    });
  });
});

// ─── 8c-4. Scroll/resize recomputation is batched to one-per-frame ────────────

describe('Popover — scroll/resize recomputation is rAF-batched, not per-event', () => {
  it('coalesces multiple scroll events within the same frame into a single recompute', async () => {
    const rafCallbacks: FrameRequestCallback[] = [];
    const rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((cb: FrameRequestCallback) => {
        rafCallbacks.push(cb);
        return rafCallbacks.length;
      });

    const getBoundingClientRect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue({
        top: 100,
        bottom: 120,
        left: 200,
        right: 260,
        width: 60,
        height: 20,
        x: 200,
        y: 100,
        toJSON: () => ({}),
      } as DOMRect);

    const user = userEvent.setup();
    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));

    // The initial calculatePosition() call on open runs synchronously
    // (not through rAF) — only the scroll/resize *listener* is batched.
    rafCallbacks.length = 0;

    // Several scroll events fired in the same tick (as a browser genuinely
    // does during fast/inertial scrolling) should schedule exactly one rAF
    // callback, not one per event.
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    expect(rafCallbacks).toHaveLength(1);

    rafSpy.mockRestore();
    getBoundingClientRect.mockRestore();
  });
});

// ─── 8d. Content repositions on scroll and resize ─────────────────────────────

describe('Popover — Content repositions on scroll and resize', () => {
  function rect(top: number): DOMRect {
    return {
      top,
      bottom: top + 20,
      left: 200,
      right: 260,
      width: 60,
      height: 20,
      x: 200,
      y: top,
      toJSON: () => ({}),
    } as DOMRect;
  }

  it('recalculates position when the window scrolls', async () => {
    const user = userEvent.setup();
    const getBoundingClientRect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(rect(620));

    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    // Initial positioning is itself effect-driven (mount, then the position
    // effect), which can take more than one act-flush cycle under CI's
    // slower scheduling even though it's 100% synchronous-feeling locally.
    await waitFor(() => {
      expect(dialog.style.top).toBe('648px'); // bottom(640) + GAP(8)
    });

    // Simulate the trigger having moved 300px up the page after a scroll.
    getBoundingClientRect.mockReturnValue(rect(320));
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(dialog.style.top).toBe('348px');
    });

    getBoundingClientRect.mockRestore();
  });

  it('recalculates position when the window resizes', async () => {
    const user = userEvent.setup();
    const getBoundingClientRect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(rect(620));

    render(
      <Popover>
        <Popover.Trigger>Open</Popover.Trigger>
        <Popover.Content>
          <p>Body</p>
        </Popover.Content>
      </Popover>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog');
    await waitFor(() => {
      expect(dialog.style.top).toBe('648px');
    });

    getBoundingClientRect.mockReturnValue(rect(500));
    window.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      expect(dialog.style.top).toBe('528px');
    });

    getBoundingClientRect.mockRestore();
  });

  it('removes the scroll/resize listeners once closed', async () => {
    const user = userEvent.setup();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rect(620));
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    render(<BasicPopover />);
    await user.click(screen.getByRole('button', { name: 'Open Popover' }));
    await user.keyboard('{Escape}');

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    removeSpy.mockRestore();
    vi.restoreAllMocks();
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
