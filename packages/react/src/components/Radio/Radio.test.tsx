import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { RadioGroup } from './RadioGroup';
import { RadioItem } from './RadioItem';
import { radioContract } from '@vhyxui/core/contracts';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function BasicGroup({
  value,
  defaultValue,
  onValueChange,
  disabled,
}: {
  value?: string;
  defaultValue?: string;
  onValueChange?: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <RadioGroup
      value={value}
      defaultValue={defaultValue}
      onValueChange={onValueChange}
      disabled={disabled}
      aria-label="Options"
    >
      <RadioItem value="a">Option A</RadioItem>
      <RadioItem value="b">Option B</RadioItem>
      <RadioItem value="c">Option C</RadioItem>
    </RadioGroup>
  );
}

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('RadioGroup — render', () => {
  it('renders without crashing', () => {
    render(<BasicGroup />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('renders all RadioItems', () => {
    render(<BasicGroup />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
  });

  it('RadioGroup has role="radiogroup"', () => {
    render(<BasicGroup />);
    expect(screen.getByRole('radiogroup')).toBeInTheDocument();
  });

  it('RadioItems have role="radio"', () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole('radio');
    for (const radio of radios) {
      expect(radio.tagName).toBe('BUTTON');
    }
  });
});

// ─── 2. Orientation ───────────────────────────────────────────────────────────

describe('RadioGroup — orientation', () => {
  it('renders with data-orientation="vertical" by default', () => {
    render(<BasicGroup />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-orientation', 'vertical');
  });

  it('renders with data-orientation="horizontal"', () => {
    render(
      <RadioGroup orientation="horizontal" aria-label="Options">
        <RadioItem value="a">A</RadioItem>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup')).toHaveAttribute('data-orientation', 'horizontal');
  });
});

// ─── 3. Sizes ─────────────────────────────────────────────────────────────────

describe('RadioGroup — sizes', () => {
  const sizes = ['sm', 'md', 'lg'] as const;

  for (const size of sizes) {
    it(`renders ${size} size on group and items`, () => {
      render(
        <RadioGroup size={size} aria-label="Options">
          <RadioItem value="a">A</RadioItem>
        </RadioGroup>,
      );
      expect(screen.getByRole('radiogroup')).toHaveAttribute('data-size', size);
      expect(screen.getByRole('radio')).toHaveAttribute('data-size', size);
    });
  }
});

// ─── 4. Selection states ──────────────────────────────────────────────────────

describe('RadioGroup — selection', () => {
  it('selected item has aria-checked="true"', () => {
    render(<BasicGroup defaultValue="b" />);
    const radios = screen.getAllByRole('radio');
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  });

  it('unselected items have aria-checked="false"', () => {
    render(<BasicGroup defaultValue="b" />);
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('aria-checked', 'false');
    expect(radios[2]).toHaveAttribute('aria-checked', 'false');
  });
});

// ─── 5. Tab order — only active item is tabbable ─────────────────────────────

describe('RadioGroup — tab order', () => {
  it('selected item has tabIndex=0', () => {
    render(<BasicGroup defaultValue="b" />);
    const radios = screen.getAllByRole('radio');
    expect(radios[1]).toHaveAttribute('tabindex', '0');
  });

  it('non-selected items have tabIndex=-1', () => {
    render(<BasicGroup defaultValue="b" />);
    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('tabindex', '-1');
    expect(radios[2]).toHaveAttribute('tabindex', '-1');
  });

  it('when nothing selected, non-first items have tabIndex=-1', () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole('radio');
    // First item gets tabIndex=0 (group reachability); others stay -1
    expect(radios[1]).toHaveAttribute('tabindex', '-1');
    expect(radios[2]).toHaveAttribute('tabindex', '-1');
  });

  it('first item has tabIndex=0 when no value is set (group is reachable via Tab)', () => {
    render(<BasicGroup />);
    const radios = screen.getAllByRole('radio');
    // After mount, the first registered item should get tabIndex=0 so the
    // group is reachable via keyboard Tab navigation even with no selection.
    // This test runs after a tick to allow useEffect registration to settle.
    expect(radios[0]).toHaveAttribute('tabindex', '0');
    expect(radios[1]).toHaveAttribute('tabindex', '-1');
    expect(radios[2]).toHaveAttribute('tabindex', '-1');
  });
});

// ─── 6. Click selection ───────────────────────────────────────────────────────

describe('RadioGroup — click events', () => {
  it('calls onValueChange when an item is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<BasicGroup onValueChange={onValueChange} />);
    await user.click(screen.getByText('Option A'));
    expect(onValueChange).toHaveBeenCalledWith('a');
  });

  it('selects item on click in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<BasicGroup />);
    await user.click(screen.getByText('Option B'));
    const radios = screen.getAllByRole('radio');
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  });
});

// ─── 7. Keyboard navigation — Arrow keys ─────────────────────────────────────

describe('RadioGroup — keyboard navigation', () => {
  it('ArrowDown moves focus to the next item and selects it', async () => {
    const user = userEvent.setup();
    render(<BasicGroup defaultValue="a" />);

    const radios = screen.getAllByRole('radio');
    radios[0]?.focus();
    expect(radios[0]).toHaveFocus();

    await user.keyboard('{ArrowDown}');
    expect(radios[1]).toHaveFocus();
    expect(radios[1]).toHaveAttribute('aria-checked', 'true');
  });

  it('ArrowUp moves focus to the previous item and selects it', async () => {
    const user = userEvent.setup();
    render(<BasicGroup defaultValue="b" />);

    const radios = screen.getAllByRole('radio');
    radios[1]?.focus();

    await user.keyboard('{ArrowUp}');
    expect(radios[0]).toHaveFocus();
    expect(radios[0]).toHaveAttribute('aria-checked', 'true');
  });

  it('ArrowDown wraps from last to first', async () => {
    const user = userEvent.setup();
    render(<BasicGroup defaultValue="c" />);

    const radios = screen.getAllByRole('radio');
    radios[2]?.focus();

    await user.keyboard('{ArrowDown}');
    expect(radios[0]).toHaveFocus();
  });

  it('ArrowUp wraps from first to last', async () => {
    const user = userEvent.setup();
    render(<BasicGroup defaultValue="a" />);

    const radios = screen.getAllByRole('radio');
    radios[0]?.focus();

    await user.keyboard('{ArrowUp}');
    expect(radios[2]).toHaveFocus();
  });

  it('ArrowRight and ArrowLeft also navigate', async () => {
    const user = userEvent.setup();
    render(<BasicGroup defaultValue="a" />);

    const radios = screen.getAllByRole('radio');
    radios[0]?.focus();

    await user.keyboard('{ArrowRight}');
    expect(radios[1]).toHaveFocus();
  });
});

// ─── 8. Disabled state ────────────────────────────────────────────────────────

describe('RadioGroup — disabled', () => {
  it('disables all items when group is disabled', () => {
    render(<BasicGroup disabled />);
    const radios = screen.getAllByRole('radio');
    for (const radio of radios) {
      expect(radio).toBeDisabled();
    }
  });
});

// ─── 9. Controlled mode ───────────────────────────────────────────────────────

describe('RadioGroup — controlled mode', () => {
  it('reflects controlled value', () => {
    render(<BasicGroup value="c" onValueChange={vi.fn()} />);
    const radios = screen.getAllByRole('radio');
    expect(radios[2]).toHaveAttribute('aria-checked', 'true');
  });
});

// ─── 10. forwardRef ───────────────────────────────────────────────────────────

describe('RadioGroup — forwardRef', () => {
  it('forwards ref to the div element', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <RadioGroup ref={ref} aria-label="Options">
        <RadioItem value="a">A</RadioItem>
      </RadioGroup>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ─── 11. className ────────────────────────────────────────────────────────────

describe('RadioGroup — className', () => {
  it('appends custom className to the group', () => {
    render(
      <RadioGroup className="custom-group" aria-label="Options">
        <RadioItem value="a">A</RadioItem>
      </RadioGroup>,
    );
    expect(screen.getByRole('radiogroup').className).toContain('custom-group');
  });
});

// ─── 12. Accessibility (axe) ─────────────────────────────────────────────────

describe('RadioGroup — accessibility (axe)', () => {
  it('has no axe violations with no selection', async () => {
    const { container } = render(
      <RadioGroup aria-label="Subscription plan">
        <RadioItem value="free">Free</RadioItem>
        <RadioItem value="pro">Pro</RadioItem>
      </RadioGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations with a selected item', async () => {
    const { container } = render(
      <RadioGroup defaultValue="pro" aria-label="Subscription plan">
        <RadioItem value="free">Free</RadioItem>
        <RadioItem value="pro">Pro</RadioItem>
      </RadioGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('disabled group has no axe violations', async () => {
    const { container } = render(
      <RadioGroup disabled aria-label="Options">
        <RadioItem value="a">A</RadioItem>
        <RadioItem value="b">B</RadioItem>
      </RadioGroup>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('RadioGroup — VhyxSeal contract', () => {
  it('has a valid contract', () => {
    expect(radioContract).toBeDefined();
    expect(typeof radioContract.fingerprint).toBe('string');
    expect(radioContract.fingerprint.length).toBeGreaterThan(0);
    expect(radioContract.intent).toBeDefined();
    expect(radioContract.safetyLevel).toBeDefined();
  });

  it('contract is frozen', () => {
    expect(Object.isFrozen(radioContract)).toBe(true);
  });

  it('contract has valid type', () => {
    expect(['action', 'input', 'navigation', 'display', 'confirmation']).toContain(
      radioContract.type,
    );
  });
});
