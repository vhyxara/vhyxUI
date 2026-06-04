import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { SelectField } from './SelectField';

// ─── Shared fixtures ──────────────────────────────────────────────────────────

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
];

// ─── 1. Renders label ─────────────────────────────────────────────────────────

describe('SelectField — render', () => {
  it('renders label connected to the trigger', () => {
    render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
      />,
    );
    // The label's htmlFor connects to the trigger via Field
    expect(screen.getByText('Country')).toBeInTheDocument();
  });

  it('renders the combobox trigger', () => {
    render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
      />,
    );
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

// ─── 2. Renders all options ───────────────────────────────────────────────────

describe('SelectField — options', () => {
  it('renders all options in the portal', () => {
    render(
      <SelectField
        label="Choice"
        name="choice"
        value=""
        onValueChange={() => {}}
        options={options}
      />,
    );
    // Options are always in the portal (hidden when closed)
    const renderedOptions = screen.getAllByRole('option', { hidden: true });
    expect(renderedOptions).toHaveLength(3);
    expect(renderedOptions[0]!.textContent).toBe('Option A');
    expect(renderedOptions[1]!.textContent).toBe('Option B');
    expect(renderedOptions[2]!.textContent).toBe('Option C');
  });
});

// ─── 3. Placeholder ───────────────────────────────────────────────────────────

describe('SelectField — placeholder', () => {
  it('shows placeholder text in trigger when no value is selected', () => {
    render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
        placeholder="Pick a country"
      />,
    );
    expect(screen.getByRole('combobox').textContent).toContain('Pick a country');
  });
});

// ─── 4. Error message ─────────────────────────────────────────────────────────

describe('SelectField — error', () => {
  it('shows error message when error prop is set', () => {
    render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
        error="Please select a country"
      />,
    );
    expect(screen.getByText('Please select a country')).toBeInTheDocument();
  });

  it('does not show error when error prop is absent', () => {
    render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
      />,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ─── 5. Hint text ─────────────────────────────────────────────────────────────

describe('SelectField — hint', () => {
  it('shows hint text', () => {
    render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
        hint="Select your country of residence"
      />,
    );
    expect(screen.getByText('Select your country of residence')).toBeInTheDocument();
  });
});

// ─── 6. Required indicator ────────────────────────────────────────────────────

describe('SelectField — required', () => {
  it('shows required indicator when required=true', () => {
    render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
        required
      />,
    );
    const label = screen.getByText('Country', { exact: false }).closest('label');
    expect(label?.textContent).toContain('*');
  });

  it('does not show required indicator by default', () => {
    render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
      />,
    );
    const label = screen.getByText('Country').closest('label');
    expect(label?.textContent).not.toContain('*');
  });
});

// ─── 7. Disabled state ────────────────────────────────────────────────────────

describe('SelectField — disabled', () => {
  it('trigger is disabled when disabled=true', () => {
    render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
        disabled
      />,
    );
    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});

// ─── 8. onValueChange ────────────────────────────────────────────────────────

describe('SelectField — onValueChange', () => {
  it('calls onValueChange with the selected value when an item is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <SelectField
        label="Choice"
        name="choice"
        value=""
        onValueChange={onValueChange}
        options={options}
        placeholder="Pick one"
      />,
    );
    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Option B'));
    expect(onValueChange).toHaveBeenCalledWith('b');
  });
});

// ─── 9. Accessibility ─────────────────────────────────────────────────────────

describe('SelectField — accessibility', () => {
  it('has no axe violations in default state', async () => {
    const { container } = render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
        placeholder="Pick a country"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations in error state', async () => {
    const { container } = render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
        error="Please select a country"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations with hint and required', async () => {
    const { container } = render(
      <SelectField
        label="Country"
        name="country"
        value=""
        onValueChange={() => {}}
        options={options}
        hint="Select your country of residence"
        required
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
