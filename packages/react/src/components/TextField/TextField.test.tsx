import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { TextField } from './TextField';

// ─── 1. Renders label and input ───────────────────────────────────────────────

describe('TextField — render', () => {
  it('renders label and input', () => {
    render(
      <TextField label="Email" name="email" value="" onChange={() => {}} />,
    );
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('label htmlFor connects to the input id', () => {
    render(
      <TextField label="Username" name="username" value="" onChange={() => {}} />,
    );
    const input = screen.getByLabelText('Username');
    expect(input.tagName.toLowerCase()).toBe('input');
  });
});

// ─── 2. Error message ─────────────────────────────────────────────────────────

describe('TextField — error', () => {
  it('shows error message when error prop is set', () => {
    render(
      <TextField
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        error="Invalid email"
      />,
    );
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('applies error state to the input when error is set', () => {
    render(
      <TextField
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        error="Required"
      />,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not show error message when error prop is absent', () => {
    render(
      <TextField label="Email" name="email" value="" onChange={() => {}} />,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ─── 3. Hint text ─────────────────────────────────────────────────────────────

describe('TextField — hint', () => {
  it('shows hint text', () => {
    render(
      <TextField
        label="Phone"
        name="phone"
        value=""
        onChange={() => {}}
        hint="10-digit number"
      />,
    );
    expect(screen.getByText('10-digit number')).toBeInTheDocument();
  });

  it('connects hint via aria-describedby', () => {
    render(
      <TextField
        label="Phone"
        name="phone"
        value=""
        onChange={() => {}}
        hint="10-digit number"
      />,
    );
    const input = screen.getByLabelText('Phone');
    const describedBy = input.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const hintEl = document.getElementById(describedBy!);
    expect(hintEl?.textContent).toContain('10-digit number');
  });
});

// ─── 4. Required indicator ────────────────────────────────────────────────────

describe('TextField — required', () => {
  it('shows required indicator when required=true', () => {
    render(
      <TextField
        label="Name"
        name="name"
        value=""
        onChange={() => {}}
        required
      />,
    );
    const label = screen.getByText('Name', { exact: false }).closest('label');
    expect(label?.textContent).toContain('*');
  });

  it('does not show required indicator by default', () => {
    render(
      <TextField label="Name" name="name" value="" onChange={() => {}} />,
    );
    const label = screen.getByText('Name').closest('label');
    expect(label?.textContent).not.toContain('*');
  });
});

// ─── 5. Input prop passthrough ────────────────────────────────────────────────

describe('TextField — passthrough', () => {
  it('passes size to the underlying Input wrapper', () => {
    render(
      <TextField
        label="Email"
        name="email"
        size="sm"
        value=""
        onChange={() => {}}
      />,
    );
    const input = screen.getByLabelText('Email');
    const wrapper = input.closest('[data-size]');
    expect(wrapper).toHaveAttribute('data-size', 'sm');
  });

  it('passes type to the underlying input element', () => {
    render(
      <TextField
        label="Email"
        name="email"
        type="email"
        value=""
        onChange={() => {}}
      />,
    );
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
  });
});

// ─── 6. Accessibility ─────────────────────────────────────────────────────────

describe('TextField — accessibility', () => {
  it('has no axe violations in default state', async () => {
    const { container } = render(
      <TextField label="Email" name="email" value="" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations in error state', async () => {
    const { container } = render(
      <TextField
        label="Email"
        name="email"
        value=""
        onChange={() => {}}
        error="Invalid email"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations with hint and required', async () => {
    const { container } = render(
      <TextField
        label="Phone"
        name="phone"
        value=""
        onChange={() => {}}
        hint="10-digit number"
        required
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
