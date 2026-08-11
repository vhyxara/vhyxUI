import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Select } from './Select';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicSelect({
  value,
  defaultValue,
  onValueChange,
  disabled,
  placeholder = 'Choose option',
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  return (
    <Select
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      placeholder={placeholder}
    >
      <Select.Trigger aria-label="Select option" />
      <Select.Content>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="cherry">Cherry</Select.Item>
      </Select.Content>
    </Select>
  );
}

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Select — render', () => {
  it('renders trigger without crashing', () => {
    render(<BasicSelect />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('trigger shows placeholder when no value selected', () => {
    render(<BasicSelect placeholder="Pick one" />);
    expect(screen.getByText('Pick one')).toBeInTheDocument();
  });

  it('content has data-state="closed" when not open', () => {
    render(<BasicSelect />);
    // Content is always in portal (for label registration) but hidden when closed
    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(listbox).toHaveAttribute('data-state', 'closed');
  });
});

// ─── 2. Opens on click and keyboard ───────────────────────────────────────────

describe('Select — opening', () => {
  it('opens on trigger click — listbox data-state becomes open', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute('data-state', 'open');
  });

  it('trigger has aria-expanded=true when open', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('content has role="listbox"', () => {
    render(<BasicSelect />);
    // Listbox is always in portal (just hidden when closed)
    expect(screen.getByRole('listbox', { hidden: true })).toBeInTheDocument();
  });

  it('items are always registered (visible in portal, hidden via CSS)', () => {
    render(<BasicSelect />);
    expect(screen.getAllByRole('option', { hidden: true })).toHaveLength(3);
  });
});

// ─── 3. Closes ────────────────────────────────────────────────────────────────

describe('Select — closing', () => {
  it('closes on Escape key', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute('data-state', 'open');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute('data-state', 'closed');
  });

  it('returns focus to trigger on Escape', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{Escape}');
    expect(screen.getByRole('combobox')).toHaveFocus();
  });
});

// ─── 4. Value selection ───────────────────────────────────────────────────────

describe('Select — value selection', () => {
  it('selecting an item closes the dropdown', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Banana'));
    expect(screen.getByRole('listbox', { hidden: true })).toHaveAttribute('data-state', 'closed');
  });

  it('selected value is displayed in trigger', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Banana'));
    // Trigger label is effect-driven (the selectedLabel-sync effect keyed on
    // currentValue), which can take more than one act-flush cycle under CI's
    // slower scheduling.
    await waitFor(() => {
      expect(screen.getByRole('combobox').textContent).toContain('Banana');
    });
  });

  it('calls onValueChange with selected value', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicSelect onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Apple'));
    expect(onValueChange).toHaveBeenCalledWith('apple');
  });

  it('selected item has aria-selected=true', () => {
    render(<BasicSelect defaultValue="banana" />);
    const options = screen.getAllByRole('option', { hidden: true });
    const bananaOption = options.find((o) => o.textContent?.includes('Banana'));
    expect(bananaOption).toHaveAttribute('aria-selected', 'true');
  });
});

// ─── 5. Keyboard navigation (arrow keys) ─────────────────────────────────────

describe('Select — keyboard navigation', () => {
  it('ArrowDown navigates to next item', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));

    const options = screen.getAllByRole('option', { hidden: true });
    // First item should be focused on open
    await waitFor(() => {
      expect(options[0]).toHaveAttribute('tabindex', '0');
    });

    await user.keyboard('{ArrowDown}');
    await waitFor(() => {
      expect(options[1]).toHaveAttribute('tabindex', '0');
    });
  });

  it('Enter selects the focused item', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicSelect onValueChange={onValueChange} />);
    await user.click(screen.getByRole('combobox'));

    const options = screen.getAllByRole('option');
    await waitFor(() => expect(options[0]).toHaveAttribute('tabindex', '0'));

    options[0]?.focus();
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('apple');
  });
});

describe('Select — Item hover state', () => {
  it('hovering an item highlights it (data-focused) and moves real focus to it', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));

    const options = screen.getAllByRole('option');
    await waitFor(() => expect(options[0]).toHaveAttribute('tabindex', '0'));

    await user.hover(options[2]!);
    await waitFor(() => {
      expect(options[2]).toHaveAttribute('data-focused', 'true');
      expect(options[2]).toHaveFocus();
    });
  });

  it('hovering a different item moves the highlight instead of stacking it', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));

    const options = screen.getAllByRole('option');
    await waitFor(() => expect(options[0]).toHaveAttribute('tabindex', '0'));

    await user.hover(options[1]!);
    await waitFor(() => expect(options[1]).toHaveAttribute('data-focused', 'true'));
    expect(options[0]).not.toHaveAttribute('data-focused');
    expect(options[2]).not.toHaveAttribute('data-focused');
  });

  it('resuming keyboard navigation after a hover continues from the hovered item', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));

    const options = screen.getAllByRole('option');
    await waitFor(() => expect(options[0]).toHaveAttribute('tabindex', '0'));

    await user.hover(options[1]!); // Banana
    await waitFor(() => expect(options[1]).toHaveAttribute('data-focused', 'true'));

    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(options[2]).toHaveAttribute('data-focused', 'true')); // Cherry, not Banana+1-from-open
  });

  it('hovering a disabled item does not focus or highlight it', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <Select.Trigger aria-label="Select option" />
        <Select.Content>
          <Select.Item value="apple">Apple</Select.Item>
          <Select.Item value="banana" disabled>
            Banana
          </Select.Item>
        </Select.Content>
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    const options = screen.getAllByRole('option');
    await waitFor(() => expect(options[0]).toHaveAttribute('tabindex', '0'));

    // pointer-events: none on disabled items means real hover can't reach it;
    // fire the event directly to assert the handler itself also guards.
    fireEvent.mouseEnter(options[1]!);

    expect(options[1]).not.toHaveAttribute('data-focused');
    expect(options[1]).not.toHaveFocus();
  });

  it('still calls a consumer-supplied onMouseEnter', async () => {
    const user = userEvent.setup();
    const onMouseEnter = vi.fn();
    render(
      <Select>
        <Select.Trigger aria-label="Select option" />
        <Select.Content>
          <Select.Item value="apple" onMouseEnter={onMouseEnter}>
            Apple
          </Select.Item>
        </Select.Content>
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    await user.hover(screen.getByRole('option'));
    expect(onMouseEnter).toHaveBeenCalled();
  });
});

// ─── 6. Controlled mode ───────────────────────────────────────────────────────

describe('Select — controlled mode', () => {
  it('reflects controlled value in trigger', () => {
    render(<BasicSelect value="cherry" onValueChange={vi.fn()} />);
    expect(screen.getByRole('combobox').textContent).toContain('Cherry');
  });
});

// ─── 7. Uncontrolled mode ─────────────────────────────────────────────────────

describe('Select — uncontrolled mode', () => {
  it('selects item internally in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<BasicSelect defaultValue="apple" />);
    expect(screen.getByRole('combobox').textContent).toContain('Apple');

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Cherry'));
    // Switching away from an already-registered defaultValue takes one more
    // effect cycle (the selectedLabel-sync effect) than selecting from an
    // initially-unselected trigger — flaky under CI's slower scheduling
    // without waitFor, though the eventual state is always correct (100%
    // reproducible locally, only ever seen to need more than one tick in CI).
    await waitFor(() => {
      expect(screen.getByRole('combobox').textContent).toContain('Cherry');
    });
  });
});

// ─── 8. Disabled state ────────────────────────────────────────────────────────

describe('Select — disabled', () => {
  it('trigger is disabled when disabled prop is set', () => {
    render(<BasicSelect disabled />);
    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('does not open when disabled (listbox stays closed)', async () => {
    const user = userEvent.setup();
    render(<BasicSelect disabled />);
    await user.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(listbox).toHaveAttribute('data-state', 'closed');
  });
});

// ─── 9. forwardRef ────────────────────────────────────────────────────────────

describe('Select — forwardRef on Trigger', () => {
  it('forwards ref to the trigger HTMLButtonElement', () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <Select>
        <Select.Trigger ref={ref} aria-label="Select" />
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select>,
    );
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});

// ─── 9b. Trigger children / asChild ───────────────────────────────────────────

describe('Select — Trigger children only via asChild', () => {
  it('asChild renders the custom child element instead of the default value+icon markup', () => {
    render(
      <Select>
        <Select.Trigger asChild>
          <button type="button" aria-label="Custom trigger">
            <span>Custom trigger content</span>
          </button>
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select>,
    );
    expect(screen.getByText('Custom trigger content')).toBeInTheDocument();
  });

  it('asChild still merges open/close behavior onto the custom element', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <Select.Trigger asChild>
          <button type="button" aria-label="Custom trigger" />
        </Select.Trigger>
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select>,
    );
    const trigger = screen.getByRole('combobox');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
  });

  it('default (non-asChild) render never receives a children prop — passing one is a type error, not a silent no-op', () => {
    // TypeScript rejects `<Select.Trigger>...</Select.Trigger>` without `asChild`
    // at compile time (verified via tsc, not exercisable here without bypassing
    // the type system) — this runtime check documents the fallback behavior for
    // untyped/JS consumers who pass `children` anyway: it's still ignored, but
    // no longer a case TypeScript claims is valid.
    render(
      <Select>
        {// eslint-disable-next-line @typescript-eslint/no-explicit-any
        React.createElement(Select.Trigger as any, { 'aria-label': 'Select option' }, 'ignored text')}
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select>,
    );
    expect(screen.queryByText('ignored text')).toBeNull();
    expect(screen.getByRole('combobox')).toHaveTextContent('Select…');
  });
});

// ─── 9c. Content style prop merges instead of replacing positioning ──────────

describe('Select — Content style prop merges instead of replacing positioning', () => {
  it('applies consumer cosmetic style while keeping internal position/zIndex', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <Select.Trigger aria-label="Select option" />
        <Select.Content style={{ background: 'white', borderRadius: 8 }}>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    // Consumer's cosmetic style survived.
    expect(listbox).toHaveStyle({ background: 'white', borderRadius: '8px' });
    // Internal positioning was not clobbered by the consumer's style object.
    expect(listbox).toHaveStyle({ position: 'fixed', zIndex: 'var(--vhyx-z-dropdown)' });
  });

  it('consumer style cannot override internal position/zIndex/minWidth even if it tries to', async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <Select.Trigger aria-label="Select option" />
        <Select.Content
          style={{ position: 'static', zIndex: 1, minWidth: '999px' } as React.CSSProperties}
        >
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveStyle({ position: 'fixed', zIndex: 'var(--vhyx-z-dropdown)' });
    expect(listbox.style.minWidth).not.toBe('999px');
  });

  it('content is not clobbered while closed either (initial positionStyle state)', () => {
    render(
      <Select>
        <Select.Trigger aria-label="Select option" />
        <Select.Content style={{ background: 'white' }}>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select>,
    );
    const listbox = screen.getByRole('listbox', { hidden: true });
    expect(listbox).toHaveStyle({ background: 'white', position: 'fixed' });
  });
});

describe('Select — Content repositions on scroll and resize', () => {
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
      <Select>
        <Select.Trigger aria-label="Select option" />
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    // Initial positioning is itself effect-driven (mount, then the position
    // effect), which can take more than one act-flush cycle under CI's
    // slower scheduling even though it's 100% synchronous-feeling locally.
    await waitFor(() => {
      expect(listbox.style.top).toBe('644px'); // bottom(640) + 4
    });

    // Simulate the trigger having moved 300px up the page after a scroll.
    getBoundingClientRect.mockReturnValue(rect(320));
    window.dispatchEvent(new Event('scroll'));

    await waitFor(() => {
      expect(listbox.style.top).toBe('344px');
    });

    getBoundingClientRect.mockRestore();
  });

  it('recalculates position when the window resizes', async () => {
    const user = userEvent.setup();
    const getBoundingClientRect = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(rect(620));

    render(
      <Select>
        <Select.Trigger aria-label="Select option" />
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox');
    await waitFor(() => {
      expect(listbox.style.top).toBe('644px');
    });

    getBoundingClientRect.mockReturnValue(rect(500));
    window.dispatchEvent(new Event('resize'));

    await waitFor(() => {
      expect(listbox.style.top).toBe('524px');
    });

    getBoundingClientRect.mockRestore();
  });

  it('removes the scroll/resize listeners once closed', async () => {
    const user = userEvent.setup();
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rect(620));
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    render(
      <Select>
        <Select.Trigger aria-label="Select option" />
        <Select.Content>
          <Select.Item value="a">A</Select.Item>
        </Select.Content>
      </Select>,
    );
    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{Escape}');

    expect(removeSpy).toHaveBeenCalledWith('scroll', expect.any(Function), true);
    expect(removeSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    removeSpy.mockRestore();
    vi.restoreAllMocks();
  });
});

// ─── 10. ARIA ─────────────────────────────────────────────────────────────────

describe('Select — ARIA', () => {
  it('trigger has aria-haspopup="listbox"', () => {
    render(<BasicSelect />);
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-haspopup', 'listbox');
  });

  it('trigger aria-controls references listbox when open', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));
    const trigger = screen.getByRole('combobox');
    const listbox = screen.getByRole('listbox');
    expect(trigger.getAttribute('aria-controls')).toBe(listbox.id);
  });
});

// ─── 11. Accessibility (axe) ──────────────────────────────────────────────────

describe('Select — accessibility (axe)', () => {
  it('closed state has no axe violations', async () => {
    const { container } = render(<BasicSelect />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('open state has no axe violations', async () => {
    const user = userEvent.setup();
    render(<BasicSelect />);
    await user.click(screen.getByRole('combobox'));
    // axe on document.body with region rule disabled:
    // portal content renders in <body> outside landmarks by design.
    // The 'region' rule checks page-level structure, not component ARIA correctness.
    const results = await axe(document.body, { rules: { region: { enabled: false } } });
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('Select — VhyxSeal contract', () => {
  it('root element carries data-vhyx-contract with real instance id', () => {
    render(<BasicSelect />);
    const root = document.querySelector('[data-vhyx-contract]');
    expect(root).toBeTruthy();
    const contract = JSON.parse(root!.getAttribute('data-vhyx-contract')!);
    expect(contract['id']).toBeTruthy();
    expect(contract['id']).not.toBe('vhyxui-select');
  });

  it('contract carries fingerprint from defineContractTemplate()', () => {
    render(<BasicSelect />);
    const root = document.querySelector('[data-vhyx-contract]');
    const contract = JSON.parse(root!.getAttribute('data-vhyx-contract')!);
    expect(typeof contract['fingerprint']).toBe('string');
    expect(contract['fingerprint'].length).toBeGreaterThan(0);
  });
});
