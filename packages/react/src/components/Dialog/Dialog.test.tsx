import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Dialog } from './Dialog';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicDialog({
  open,
  defaultOpen,
  onOpenChange,
  modal = true,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}) {
  return (
    <Dialog open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange} modal={modal}>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content>
          <Dialog.Title>Test Dialog</Dialog.Title>
          <Dialog.Description>This is a test dialog.</Dialog.Description>
          <button>Action</button>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Dialog — render', () => {
  it('renders trigger without crashing', () => {
    render(<BasicDialog />);
    expect(screen.getByRole('button', { name: 'Open Dialog' })).toBeInTheDocument();
  });

  it('content is not in DOM when closed', () => {
    render(<BasicDialog />);
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

// ─── 2. Opens on trigger click ────────────────────────────────────────────────

describe('Dialog — opening', () => {
  it('opens on trigger click', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('renders Dialog.Title when open', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Test Dialog')).toBeInTheDocument();
  });
});

// ─── 3. Closes on Escape ──────────────────────────────────────────────────────

describe('Dialog — closing', () => {
  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on Dialog.Close click', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('calls onOpenChange with false when closed', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<BasicDialog onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    onOpenChange.mockClear();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

// ─── 4. Focus management ──────────────────────────────────────────────────────

describe('Dialog — focus management', () => {
  it('moves focus inside dialog on open', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    await waitFor(() => {
      expect(document.activeElement).not.toBe(document.body);
      expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
    });
  });

  it('returns focus to trigger when dialog closes', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    const trigger = screen.getByRole('button', { name: 'Open Dialog' });
    await user.click(trigger);
    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(trigger).toHaveFocus();
    });
  });

  it('Tab cycles focus within dialog (focus trap)', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));

    // Focus should be inside the dialog
    await waitFor(() => {
      expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);
    });

    // Tab should cycle within the dialog — after tabbing through all focusable elements,
    // focus wraps back to the first (focus trap)
    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>('button');
    expect(focusable.length).toBeGreaterThan(1);

    // Tab to the last focusable element
    const tabCount = focusable.length;
    for (let i = 1; i < tabCount; i++) {
      await user.tab();
    }

    // Now Tab should wrap back to the first focusable element
    await user.tab();
    expect(dialog.contains(document.activeElement)).toBe(true);
  });
});

// ─── 5. ARIA ──────────────────────────────────────────────────────────────────

describe('Dialog — ARIA', () => {
  it('dialog has role="dialog"', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('dialog has aria-modal="true" when modal', async () => {
    const user = userEvent.setup();
    render(<BasicDialog modal />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
  });

  it('aria-labelledby points to Dialog.Title id', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Test Dialog');
    expect(dialog.getAttribute('aria-labelledby')).toBe(title.id);
    expect(title.id).toBeTruthy();
  });
});

// ─── 6. Scroll lock ───────────────────────────────────────────────────────────

describe('Dialog — scroll lock', () => {
  it('locks document.body scroll when open', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    expect(document.body.style.overflow).not.toBe('hidden');
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores document.body scroll when closed', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    await user.keyboard('{Escape}');
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});

// ─── 7. Dev warning for missing title ─────────────────────────────────────────

describe('Dialog — dev warning', () => {
  beforeEach(() => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('warns when Dialog.Title is absent', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <p>No title here</p>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('Dialog.Title'),
    );
  });

  it('does not warn when Dialog.Title is present', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(console.warn).not.toHaveBeenCalledWith(
      expect.stringContaining('Dialog.Title'),
    );
  });
});

// ─── 8. Controlled mode ───────────────────────────────────────────────────────

describe('Dialog — controlled mode', () => {
  it('reflects controlled open state', () => {
    const { rerender } = render(<BasicDialog open={false} onOpenChange={vi.fn()} />);
    expect(screen.queryByRole('dialog')).toBeNull();
    rerender(<BasicDialog open={true} onOpenChange={vi.fn()} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('calls onOpenChange when trigger is clicked', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<BasicDialog open={false} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });
});

// ─── 9. Uncontrolled mode ─────────────────────────────────────────────────────

describe('Dialog — uncontrolled mode', () => {
  it('opens and closes internally', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    expect(screen.queryByRole('dialog')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});

// ─── 10. forwardRef ───────────────────────────────────────────────────────────

describe('Dialog — forwardRef', () => {
  it('DialogTrigger forwards ref to HTMLButtonElement', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Dialog>
        <Dialog.Trigger ref={ref}>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Test</Dialog.Title>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('DialogContent forwards ref to HTMLDivElement', async () => {
    const ref = React.createRef<HTMLDivElement>();
    const user = userEvent.setup();
    render(
      <Dialog>
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content ref={ref}>
            <Dialog.Title>Test</Dialog.Title>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ─── 11. VhyxSeal contract ────────────────────────────────────────────────────

describe('Dialog — VhyxSeal contract', () => {
  it('root element carries data-vhyx-contract with real instance id', () => {
    render(<BasicDialog />);
    const root = document.querySelector('[data-vhyx-contract]');
    expect(root).toBeTruthy();
    const contract = JSON.parse(root!.getAttribute('data-vhyx-contract')!);
    expect(contract['id']).toBeTruthy();
    expect(contract['id']).not.toBe('vhyxui-dialog');
  });

  it('contract carries fingerprint from defineContractTemplate()', () => {
    render(<BasicDialog />);
    const root = document.querySelector('[data-vhyx-contract]');
    const contract = JSON.parse(root!.getAttribute('data-vhyx-contract')!);
    expect(typeof contract['fingerprint']).toBe('string');
    expect(contract['fingerprint'].length).toBeGreaterThan(0);
  });
});

// ─── 12. Size prop ────────────────────────────────────────────────────────────

describe('Dialog — size prop', () => {
  it('defaults to md size', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-size', 'md');
  });

  it('accepts sm size', async () => {
    const user = userEvent.setup();
    render(
      <Dialog size="sm">
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Test</Dialog.Title>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-size', 'sm');
  });

  it('accepts lg size', async () => {
    const user = userEvent.setup();
    render(
      <Dialog size="lg">
        <Dialog.Trigger>Open</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Content>
            <Dialog.Title>Test</Dialog.Title>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>,
    );
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveAttribute('data-size', 'lg');
  });
});

// ─── 13. Accessibility (axe) ─────────────────────────────────────────────────

describe('Dialog — accessibility (axe)', () => {
  it('closed state has no axe violations', async () => {
    const { container } = render(<BasicDialog />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('open state has no axe violations', async () => {
    const user = userEvent.setup();
    render(<BasicDialog />);
    await user.click(screen.getByRole('button', { name: 'Open Dialog' }));
    // Test the dialog content directly (portal renders in body)
    const dialog = screen.getByRole('dialog');
    const results = await axe(dialog);
    expect(results).toHaveNoViolations();
  });
});
