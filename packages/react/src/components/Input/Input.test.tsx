import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Input } from './Input';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInput(): HTMLInputElement {
  return screen.getByRole('textbox') as HTMLInputElement;
}

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Input — render', () => {
  it('renders without crashing', () => {
    render(<Input aria-label="Name" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders a wrapper div containing the input', () => {
    render(<Input aria-label="Name" />);
    const input = getInput();
    expect(input.closest('div')).toBeInTheDocument();
  });
});

// ─── 2 & 3. All sizes ─────────────────────────────────────────────────────────

describe('Input — sizes', () => {
  const sizes = ['sm', 'md', 'lg'] as const;

  for (const size of sizes) {
    it(`renders ${size} size with correct data-size on wrapper`, () => {
      render(<Input size={size} aria-label={`Input ${size}`} />);
      const wrapper = getInput().closest('[data-size]');
      expect(wrapper).toHaveAttribute('data-size', size);
    });
  }

  it('defaults to md size', () => {
    render(<Input aria-label="Default" />);
    const wrapper = getInput().closest('[data-size]');
    expect(wrapper).toHaveAttribute('data-size', 'md');
  });
});

// ─── 4. Error state ───────────────────────────────────────────────────────────

describe('Input — error state', () => {
  it('sets aria-invalid on the input when error is true', () => {
    render(<Input error aria-label="Email" />);
    expect(getInput()).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets data-error on the wrapper when error is true', () => {
    render(<Input error aria-label="Email" />);
    const wrapper = getInput().closest('[data-error]');
    expect(wrapper).toHaveAttribute('data-error', 'true');
  });

  it('does not set aria-invalid when error is false', () => {
    render(<Input aria-label="Email" />);
    expect(getInput()).not.toHaveAttribute('aria-invalid');
  });
});

// ─── 5. Password type ─────────────────────────────────────────────────────────

describe('Input — password type', () => {
  it('renders a show/hide toggle button for type=password', () => {
    render(<Input type="password" aria-label="Password" />);
    expect(
      screen.getByRole('button', { name: 'Show password' }),
    ).toBeInTheDocument();
  });

  it('toggles to show password on button click', async () => {
    const user = userEvent.setup();
    render(<Input type="password" aria-label="Password" />);
    const toggle = screen.getByRole('button', { name: 'Show password' });
    await user.click(toggle);
    // Input type changes to "text" — getByRole('textbox') will now work
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Hide password' })).toBeInTheDocument();
  });

  it('toggles back to hide password on second click', async () => {
    const user = userEvent.setup();
    render(<Input type="password" aria-label="Password" />);
    const toggle = screen.getByRole('button', { name: 'Show password' });
    await user.click(toggle);
    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(screen.getByRole('button', { name: 'Show password' })).toBeInTheDocument();
  });
});

// ─── 6. Search type with clear button ─────────────────────────────────────────

describe('Input — search type', () => {
  it('renders a clear button for type=search when value is present', () => {
    render(<Input type="search" value="hello" onChange={vi.fn()} aria-label="Search" />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('does not render a clear button for type=search when value is empty', () => {
    render(<Input type="search" value="" onChange={vi.fn()} aria-label="Search" />);
    expect(screen.queryByRole('button', { name: 'Clear' })).toBeNull();
  });
});

// ─── 7. clearable prop ────────────────────────────────────────────────────────

describe('Input — clearable', () => {
  it('renders a clear button when clearable=true', () => {
    render(<Input clearable aria-label="Name" />);
    expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument();
  });

  it('calls onClear when the clear button is clicked', async () => {
    const user = userEvent.setup();
    const onClear = vi.fn();
    render(<Input clearable onClear={onClear} aria-label="Name" />);
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    expect(onClear).toHaveBeenCalledOnce();
  });
});

// ─── 8. forwardRef ────────────────────────────────────────────────────────────

describe('Input — forwardRef', () => {
  it('forwards ref to the HTMLInputElement', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} aria-label="Ref input" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});

// ─── 9. className ────────────────────────────────────────────────────────────

describe('Input — className', () => {
  it('appends custom className to the wrapper without replacing internal class', () => {
    render(<Input className="custom-wrapper" aria-label="Name" />);
    const wrapper = getInput().closest('div');
    expect(wrapper?.className).toContain('custom-wrapper');
    expect(wrapper?.className).toMatch(/wrapper/);
  });
});

// ─── 10. Controlled mode ──────────────────────────────────────────────────────

describe('Input — controlled mode', () => {
  it('renders controlled value', () => {
    const onChange = vi.fn();
    render(<Input value="controlled" onChange={onChange} aria-label="Name" />);
    expect(getInput()).toHaveValue('controlled');
  });

  it('calls onChange when user types in controlled mode', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input value="" onChange={onChange} aria-label="Name" />);
    await user.type(getInput(), 'a');
    expect(onChange).toHaveBeenCalled();
  });
});

// ─── 11. Uncontrolled mode ────────────────────────────────────────────────────

describe('Input — uncontrolled mode', () => {
  it('accepts user input in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Name" />);
    await user.type(getInput(), 'hello');
    expect(getInput()).toHaveValue('hello');
  });
});

// ─── 12. Accessibility (axe) ─────────────────────────────────────────────────

describe('Input — accessibility (axe)', () => {
  it('default input has no axe violations', async () => {
    const { container } = render(<Input aria-label="Name" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('error state has no axe violations', async () => {
    const { container } = render(
      <Input error aria-label="Email" aria-describedby="email-error" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('password type has no axe violations', async () => {
    const { container } = render(<Input type="password" aria-label="Password" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('clearable input has no axe violations', async () => {
    const { container } = render(<Input clearable aria-label="Search" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('all sizes have no axe violations', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { container, unmount } = render(
        <Input size={size} aria-label={`${size} input`} />,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      unmount();
    }
  });
});
