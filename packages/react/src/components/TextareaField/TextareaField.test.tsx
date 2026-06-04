import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { TextareaField } from './TextareaField';

// ─── 1. Renders label and textarea ────────────────────────────────────────────

describe('TextareaField — render', () => {
  it('renders label and textarea', () => {
    render(
      <TextareaField label="Bio" name="bio" value="" onChange={() => {}} />,
    );
    expect(screen.getByLabelText('Bio')).toBeInTheDocument();
    expect(screen.getByRole('textbox').tagName.toLowerCase()).toBe('textarea');
  });

  it('label htmlFor connects to the textarea id', () => {
    render(
      <TextareaField label="Notes" name="notes" value="" onChange={() => {}} />,
    );
    const textarea = screen.getByLabelText('Notes');
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
  });
});

// ─── 2. Error message ─────────────────────────────────────────────────────────

describe('TextareaField — error', () => {
  it('shows error message when error prop is set', () => {
    render(
      <TextareaField
        label="Bio"
        name="bio"
        value=""
        onChange={() => {}}
        error="Too short"
      />,
    );
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  it('applies error state to the textarea when error is set', () => {
    render(
      <TextareaField
        label="Bio"
        name="bio"
        value=""
        onChange={() => {}}
        error="Required"
      />,
    );
    const textarea = screen.getByLabelText('Bio');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  it('does not show error when error prop is absent', () => {
    render(
      <TextareaField label="Bio" name="bio" value="" onChange={() => {}} />,
    );
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ─── 3. Hint text ─────────────────────────────────────────────────────────────

describe('TextareaField — hint', () => {
  it('shows hint text', () => {
    render(
      <TextareaField
        label="Bio"
        name="bio"
        value=""
        onChange={() => {}}
        hint="Max 500 characters"
      />,
    );
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument();
  });

  it('connects hint via aria-describedby', () => {
    render(
      <TextareaField
        label="Bio"
        name="bio"
        value=""
        onChange={() => {}}
        hint="Max 500 characters"
      />,
    );
    const textarea = screen.getByLabelText('Bio');
    const describedBy = textarea.getAttribute('aria-describedby');
    expect(describedBy).toBeTruthy();
    const hintEl = document.getElementById(describedBy!);
    expect(hintEl?.textContent).toContain('Max 500 characters');
  });
});

// ─── 4. Required indicator ────────────────────────────────────────────────────

describe('TextareaField — required', () => {
  it('shows required indicator when required=true', () => {
    render(
      <TextareaField
        label="Bio"
        name="bio"
        value=""
        onChange={() => {}}
        required
      />,
    );
    const label = screen.getByText('Bio', { exact: false }).closest('label');
    expect(label?.textContent).toContain('*');
  });

  it('does not show required indicator by default', () => {
    render(
      <TextareaField label="Bio" name="bio" value="" onChange={() => {}} />,
    );
    const label = screen.getByText('Bio').closest('label');
    expect(label?.textContent).not.toContain('*');
  });
});

// ─── 5. Textarea prop passthrough ─────────────────────────────────────────────

describe('TextareaField — passthrough', () => {
  it('passes minRows to the underlying textarea', () => {
    render(
      <TextareaField
        label="Bio"
        name="bio"
        minRows={5}
        value=""
        onChange={() => {}}
      />,
    );
    const textarea = screen.getByLabelText('Bio');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('passes placeholder to the underlying textarea', () => {
    render(
      <TextareaField
        label="Bio"
        name="bio"
        placeholder="Tell us about yourself"
        value=""
        onChange={() => {}}
      />,
    );
    expect(screen.getByPlaceholderText('Tell us about yourself')).toBeInTheDocument();
  });
});

// ─── 6. Accessibility ─────────────────────────────────────────────────────────

describe('TextareaField — accessibility', () => {
  it('has no axe violations in default state', async () => {
    const { container } = render(
      <TextareaField label="Bio" name="bio" value="" onChange={() => {}} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations in error state', async () => {
    const { container } = render(
      <TextareaField
        label="Bio"
        name="bio"
        value=""
        onChange={() => {}}
        error="Too short"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('has no axe violations with hint and required', async () => {
    const { container } = render(
      <TextareaField
        label="Bio"
        name="bio"
        value=""
        onChange={() => {}}
        hint="Max 500 characters"
        required
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
