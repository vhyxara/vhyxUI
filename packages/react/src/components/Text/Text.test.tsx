import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { Text } from './Text';
import { Heading } from '../Heading';
import { Kbd } from '../Kbd';
import { VisuallyHidden } from '../VisuallyHidden';

describe('Text', () => {
  it('renders a paragraph with defaults', () => {
    render(<Text>Hello</Text>);
    const el = screen.getByText('Hello');
    expect(el.tagName).toBe('P');
    expect(el.dataset['size']).toBe('md');
    expect(el.dataset['tone']).toBeUndefined();
  });

  it('applies tone, weight, mono, truncate and line clamp', () => {
    render(<Text as="span" tone="subtle" weight="bold" mono truncate lines={2}>x</Text>);
    const el = screen.getByText('x');
    expect(el.tagName).toBe('SPAN');
    expect(el.dataset['tone']).toBe('subtle');
    expect(el.dataset['weight']).toBe('bold');
    expect(el.dataset['mono']).toBe('true');
    expect(el.dataset['truncate']).toBe('true');
    expect(el.dataset['clamp']).toBe('2');
  });
});

describe('Heading', () => {
  it('maps level to tag and default size', () => {
    render(<Heading level={1}>Title</Heading>);
    const el = screen.getByRole('heading', { level: 1 });
    expect(el.dataset['size']).toBe('2xl');
  });

  it('keeps semantics separate from size', () => {
    render(<Heading level={3} size="xl">Big h3</Heading>);
    expect(screen.getByRole('heading', { level: 3 }).dataset['size']).toBe('xl');
  });

  it('has no axe violations', async () => {
    const { container } = render(<main><Heading level={1}>Page</Heading><Text>Body</Text></main>);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Kbd and VisuallyHidden', () => {
  it('Kbd renders each key', () => {
    const { container } = render(<Kbd keys={['⌘', 'K']} />);
    expect(container.querySelectorAll('kbd kbd')).toHaveLength(2);
  });

  it('Kbd renders children when no keys are given', () => {
    render(<Kbd>Esc</Kbd>);
    expect(screen.getByText('Esc').tagName).toBe('KBD');
  });

  it('VisuallyHidden stays in the accessibility tree', () => {
    render(<button><VisuallyHidden>Close</VisuallyHidden></button>);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });
});
