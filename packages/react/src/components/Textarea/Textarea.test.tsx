import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Textarea } from './Textarea';

// ─── 1. Renders without crashing ──────────────────────────────────────────────

describe('Textarea — render', () => {
  it('renders without crashing', () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});

// ─── 2 & 3. Sizes ─────────────────────────────────────────────────────────────

describe('Textarea — sizes', () => {
  const sizes = ['sm', 'md', 'lg'] as const;

  for (const size of sizes) {
    it(`renders ${size} size with correct data-size attribute`, () => {
      render(<Textarea size={size} aria-label="Message" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('data-size', size);
    });
  }

  it('defaults to md size', () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-size', 'md');
  });
});

// ─── 4. States ────────────────────────────────────────────────────────────────

describe('Textarea — error state', () => {
  it('sets aria-invalid when error is true', () => {
    render(<Textarea error aria-label="Message" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('sets data-error attribute when error is true', () => {
    render(<Textarea error aria-label="Message" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-error', 'true');
  });

  it('does not set aria-invalid when error is false', () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });
});

describe('Textarea — resize modes', () => {
  const modes = ['none', 'vertical', 'horizontal', 'both', 'auto'] as const;

  for (const mode of modes) {
    it(`renders ${mode} resize mode with correct data-resize`, () => {
      render(<Textarea resize={mode} aria-label="Message" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('data-resize', mode);
    });
  }
});

// ─── 5. Event handlers ────────────────────────────────────────────────────────

describe('Textarea — events', () => {
  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} aria-label="Message" />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });
});

// ─── 6 & 7. Controlled / uncontrolled ────────────────────────────────────────

describe('Textarea — controlled mode', () => {
  it('renders controlled value', () => {
    render(<Textarea value="controlled" onChange={vi.fn()} aria-label="Message" />);
    expect(screen.getByRole('textbox')).toHaveValue('controlled');
  });
});

describe('Textarea — uncontrolled mode', () => {
  it('accepts user input in uncontrolled mode', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Message" />);
    await user.type(screen.getByRole('textbox'), 'hello');
    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });
});

// ─── 8. forwardRef ────────────────────────────────────────────────────────────

describe('Textarea — forwardRef', () => {
  it('forwards ref to the HTMLTextAreaElement', () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} aria-label="Message" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });
});

// ─── 9. className ─────────────────────────────────────────────────────────────

describe('Textarea — className', () => {
  it('appends custom className to the textarea element', () => {
    render(<Textarea className="custom" aria-label="Message" />);
    expect(screen.getByRole('textbox').className).toContain('custom');
  });
});

// ─── showCount feature ────────────────────────────────────────────────────────

describe('Textarea — showCount', () => {
  it('renders character count when showCount and maxLength are set', () => {
    render(
      <Textarea
        showCount
        maxLength={100}
        value="hello"
        onChange={vi.fn()}
        aria-label="Message"
      />,
    );
    expect(screen.getByText('5/100')).toBeInTheDocument();
  });

  it('does not render count when showCount is false', () => {
    render(
      <Textarea maxLength={100} value="" onChange={vi.fn()} aria-label="Message" />,
    );
    expect(screen.queryByText('0/100')).toBeNull();
  });
});

// ─── 12. Accessibility (axe) ─────────────────────────────────────────────────

describe('Textarea — accessibility (axe)', () => {
  it('default textarea has no axe violations', async () => {
    const { container } = render(<Textarea aria-label="Message" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('error state has no axe violations', async () => {
    const { container } = render(
      <Textarea error aria-label="Message" aria-describedby="msg-error" />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('with showCount has no axe violations', async () => {
    const { container } = render(
      <Textarea
        showCount
        maxLength={200}
        value="test"
        onChange={vi.fn()}
        aria-label="Message"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
