import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { Accordion } from './Accordion';

const items = [
  { value: 'a', title: 'First', content: 'Alpha' },
  { value: 'b', title: 'Second', content: 'Beta' },
  { value: 'c', title: 'Third', content: 'Gamma', disabled: true },
];

function toggle(title: string): void {
  const details = screen.getByText(title).closest('details') as HTMLDetailsElement;
  details.open = !details.open;
  fireEvent(details, new Event('toggle'));
}

describe('Accordion', () => {
  it('renders items from data, closed by default', () => {
    const { container } = render(<Accordion items={items} />);
    expect(container.querySelectorAll('details')).toHaveLength(3);
    expect(container.querySelectorAll('details[open]')).toHaveLength(0);
  });

  it('respects defaultValue', () => {
    const { container } = render(<Accordion items={items} defaultValue={['b']} />);
    expect(container.querySelector('details[open]')).toHaveTextContent('Beta');
  });

  it('single mode keeps one section open and shares a details name', () => {
    const onValueChange = vi.fn();
    const { container } = render(<Accordion items={items} onValueChange={onValueChange} />);
    toggle('First');
    expect(onValueChange).toHaveBeenLastCalledWith(['a']);
    toggle('Second');
    expect(onValueChange).toHaveBeenLastCalledWith(['b']);
    const names = new Set(Array.from(container.querySelectorAll('details')).map((d) => d.getAttribute('name')));
    expect(names.size).toBe(1);
  });

  it('multiple mode keeps several open', () => {
    const onValueChange = vi.fn();
    render(<Accordion type="multiple" items={items} onValueChange={onValueChange} />);
    toggle('First');
    toggle('Second');
    expect(onValueChange).toHaveBeenLastCalledWith(['a', 'b']);
  });

  it('supports controlled value', () => {
    const { container, rerender } = render(<Accordion items={items} value={['a']} />);
    expect(container.querySelector('details[open]')).toHaveTextContent('Alpha');
    rerender(<Accordion items={items} value={[]} />);
    expect(container.querySelector('details[open]')).toBeNull();
  });

  it('works with compound children', () => {
    render(
      <Accordion>
        <Accordion.Item value="x" title="Question">Answer</Accordion.Item>
      </Accordion>,
    );
    expect(screen.getByText('Question')).toBeInTheDocument();
  });

  it('disabled items are not focusable', () => {
    render(<Accordion items={items} />);
    expect(screen.getByText('Third').closest('summary')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Third').closest('summary')).toHaveAttribute('tabindex', '-1');
  });

  it('has no axe violations', async () => {
    const { container } = render(<Accordion items={items} defaultValue={['a']} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
