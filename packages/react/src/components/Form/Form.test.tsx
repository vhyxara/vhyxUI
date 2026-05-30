import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import React from 'react';
import { Form } from './Form';
import { Field } from './Field';
import { Input } from '../Input';
import { formContract } from '@vhyxui/core/contracts';

// ─────────────────────────────────────────────────────────────────────────────
// FIELD TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Field — render', () => {
  it('renders without crashing', () => {
    render(
      <Field name="email">
        <Input aria-label="Email" />
      </Field>,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});

// ─── Label association ────────────────────────────────────────────────────────

describe('Field — label', () => {
  it('renders label text', () => {
    render(
      <Field name="email" label="Email address">
        <Input />
      </Field>,
    );
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });

  it('label htmlFor matches input id (label→input association)', () => {
    render(
      <Field name="email" label="Email">
        <Input />
      </Field>,
    );
    const label = screen.getByText('Email').closest('label') as HTMLLabelElement;
    const input = screen.getByRole('textbox');
    expect(label.htmlFor).toBe(input.id);
    expect(input.id).toBeTruthy();
  });

  it('renders required indicator when required=true', () => {
    render(
      <Field name="email" label="Email" required>
        <Input aria-label="Email" />
      </Field>,
    );
    // The * indicator is aria-hidden — query directly
    const label = screen.getByText('Email').closest('label') as HTMLLabelElement;
    expect(label.textContent).toContain('*');
  });

  it('renders optional indicator when optional=true', () => {
    render(
      <Field name="email" label="Email" optional>
        <Input aria-label="Email" />
      </Field>,
    );
    const label = screen.getByText('Email').closest('label') as HTMLLabelElement;
    expect(label.textContent).toContain('optional');
  });
});

// ─── Hint ─────────────────────────────────────────────────────────────────────

describe('Field — hint', () => {
  it('renders hint text', () => {
    render(
      <Field name="email" label="Email" hint="Never shared with anyone">
        <Input />
      </Field>,
    );
    expect(screen.getByText('Never shared with anyone')).toBeInTheDocument();
  });

  it('hint element has a stable id', () => {
    render(
      <Field name="email" label="Email" hint="Hint text">
        <Input />
      </Field>,
    );
    const hint = screen.getByText('Hint text');
    expect(hint.id).toBeTruthy();
  });

  it('input aria-describedby references hint id when hint present', () => {
    render(
      <Field name="email" label="Email" hint="Hint text">
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    const hint = screen.getByText('Hint text');
    expect(input.getAttribute('aria-describedby')).toContain(hint.id);
  });
});

// ─── Error ────────────────────────────────────────────────────────────────────

describe('Field — error', () => {
  it('renders error message', () => {
    render(
      <Field name="email" label="Email" error="Invalid email address">
        <Input aria-label="Email" />
      </Field>,
    );
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });

  it('error element has role="alert"', () => {
    render(
      <Field name="email" label="Email" error="Required">
        <Input aria-label="Email" />
      </Field>,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByRole('alert').textContent).toBe('Required');
  });

  it('input receives aria-invalid when error is set', () => {
    render(
      <Field name="email" label="Email" error="Required">
        <Input />
      </Field>,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('input receives data-error="true" when error is set', () => {
    render(
      <Field name="email" label="Email" error="Required">
        <Input />
      </Field>,
    );
    expect(screen.getByRole('textbox')).toHaveAttribute('data-error', 'true');
  });

  it('input aria-describedby references error id when error present', () => {
    render(
      <Field name="email" label="Email" error="Required">
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    const error = screen.getByRole('alert');
    expect(input.getAttribute('aria-describedby')).toContain(error.id);
  });

  it('input aria-describedby references both hint and error when both present', () => {
    render(
      <Field name="email" label="Email" hint="Hint" error="Error">
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox');
    const hintEl = screen.getByText('Hint');
    const errorEl = screen.getByRole('alert');
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(hintEl.id);
    expect(describedBy).toContain(errorEl.id);
  });

  it('input does not have aria-invalid when no error', () => {
    render(
      <Field name="email" label="Email">
        <Input />
      </Field>,
    );
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });
});

// ─── Unique IDs ───────────────────────────────────────────────────────────────

describe('Field — ID uniqueness', () => {
  it('two Fields generate different IDs', () => {
    render(
      <>
        <Field name="email" label="Email">
          <Input />
        </Field>
        <Field name="name" label="Name">
          <Input />
        </Field>
      </>,
    );
    const [input1, input2] = screen.getAllByRole('textbox');
    expect(input1?.id).toBeTruthy();
    expect(input2?.id).toBeTruthy();
    expect(input1?.id).not.toBe(input2?.id);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// FORM TESTS
// ─────────────────────────────────────────────────────────────────────────────

describe('Form — render', () => {
  it('renders as native form element', () => {
    const { container } = render(
      <Form>
        <Field name="email" label="Email">
          <Input />
        </Field>
      </Form>,
    );
    // <form> only has role="form" when it has an accessible name.
    // Use querySelector to assert the native element is present.
    expect(container.querySelector('form')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Form>
        <Field name="email" label="Email address">
          <Input aria-label="Email" />
        </Field>
      </Form>,
    );
    expect(screen.getByText('Email address')).toBeInTheDocument();
  });
});

describe('Form — layout', () => {
  it('sets data-layout attribute', () => {
    const { container } = render(
      <Form layout="horizontal">
        <button type="submit">Save</button>
      </Form>,
    );
    const form = container.querySelector('form');
    expect(form).toHaveAttribute('data-layout', 'horizontal');
  });

  it('defaults to vertical layout', () => {
    const { container } = render(
      <Form>
        <button type="submit">Save</button>
      </Form>,
    );
    expect(container.querySelector('form')).toHaveAttribute('data-layout', 'vertical');
  });
});

describe('Form — size', () => {
  it('sets data-size attribute', () => {
    const { container } = render(
      <Form size="lg">
        <button type="submit">Save</button>
      </Form>,
    );
    expect(container.querySelector('form')).toHaveAttribute('data-size', 'lg');
  });
});

describe('Form — onSubmit', () => {
  it('fires onSubmit when form is submitted without form prop', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(
      <Form onSubmit={onSubmit}>
        <button type="submit">Submit</button>
      </Form>,
    );
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(onSubmit).toHaveBeenCalledOnce();
  });

  it('renders without crashing when no form prop is provided', () => {
    render(
      <Form layout="vertical">
        <Field name="email" label="Email">
          <Input aria-label="Email" />
        </Field>
      </Form>,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});

describe('Form — forwardRef', () => {
  it('forwards ref to the HTMLFormElement', () => {
    const ref = React.createRef<HTMLFormElement>();
    render(
      <Form ref={ref}>
        <button type="submit">Save</button>
      </Form>,
    );
    expect(ref.current).toBeInstanceOf(HTMLFormElement);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// INTEGRATION TEST — Form + Field + Input
// ─────────────────────────────────────────────────────────────────────────────

describe('Form + Field + Input — integration', () => {
  it('full aria chain: label→input, input→hint, input→error', () => {
    render(
      <Form>
        <Field name="email" label="Email" hint="Enter your email" error="Required">
          <Input />
        </Field>
      </Form>,
    );
    const label = screen.getByText('Email').closest('label') as HTMLLabelElement;
    const input = screen.getByRole('textbox');
    const hint = screen.getByText('Enter your email');
    const error = screen.getByRole('alert');

    // label → input via htmlFor/id
    expect(label.htmlFor).toBe(input.id);

    // input → hint + error via aria-describedby
    const describedBy = input.getAttribute('aria-describedby') ?? '';
    expect(describedBy).toContain(hint.id);
    expect(describedBy).toContain(error.id);

    // input invalid state
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('data-error', 'true');
  });

  it('Field without error does not inject aria-invalid onto Input', () => {
    render(
      <Form>
        <Field name="email" label="Email">
          <Input />
        </Field>
      </Form>,
    );
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('Field reads error from Form context getFieldState', () => {
    // Simulate Form context providing an error via getFieldState
    // by passing a mock form-like object through the Form component
    const mockForm = {
      getFieldState: (name: string) => ({
        error: name === 'email' ? { message: 'Context error' } : undefined,
        invalid: name === 'email',
        isTouched: false,
        isDirty: false,
      }),
      handleSubmit: (fn: (data: Record<string, unknown>) => void) => (e: Event) => {
        e.preventDefault();
        fn({});
      },
    };

    // Cast: we only provide the subset of UseFormReturn that Form uses
    render(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
      <Form form={mockForm as unknown as Parameters<typeof Form>[0]['form']}>
        <Field name="email" label="Email">
          <Input />
        </Field>
      </Form>,
    );

    expect(screen.getByText('Context error')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ACCESSIBILITY (axe)
// ─────────────────────────────────────────────────────────────────────────────

describe('Form + Field — accessibility (axe)', () => {
  it('Field with label has no axe violations', async () => {
    const { container } = render(
      <Field name="email" label="Email address">
        <Input />
      </Field>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Field with hint has no axe violations', async () => {
    const { container } = render(
      <Field name="email" label="Email" hint="We'll never share it">
        <Input />
      </Field>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Field with error has no axe violations', async () => {
    const { container } = render(
      <Field name="email" label="Email" error="Invalid email">
        <Input aria-label="Email" />
      </Field>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Field with required indicator has no axe violations', async () => {
    const { container } = render(
      <Field name="email" label="Email" required>
        <Input />
      </Field>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('Form with vertical layout has no axe violations', async () => {
    const { container } = render(
      <Form layout="vertical">
        <Field name="name" label="Full name">
          <Input />
        </Field>
        <Field name="email" label="Email" hint="We'll never share it">
          <Input type="email" />
        </Field>
      </Form>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('Form — VhyxSeal contract', () => {
  it('has a valid contract', () => {
    expect(formContract).toBeDefined();
    expect(typeof formContract.fingerprint).toBe('string');
    expect(formContract.fingerprint.length).toBeGreaterThan(0);
    expect(formContract.intent).toBeDefined();
    expect(formContract.safetyLevel).toBeDefined();
  });

  it('contract is frozen', () => {
    expect(Object.isFrozen(formContract)).toBe(true);
  });

  it('contract has valid type', () => {
    expect(['action', 'input', 'navigation', 'display', 'confirmation']).toContain(
      formContract.type,
    );
  });
});
