import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { Card } from './Card';
import { cardContract } from '@vhyxui/core/contracts';

// ─── 1. Renders ───────────────────────────────────────────────────────────────

describe('Card — render', () => {
  it('renders without crashing', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders as a div', () => {
    const { container } = render(<Card>Content</Card>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });
});

// ─── 2. All variants ─────────────────────────────────────────────────────────

describe('Card — variants', () => {
  const variants = ['default', 'outline', 'ghost', 'elevated'] as const;

  for (const variant of variants) {
    it(`renders ${variant} variant with correct data-variant`, () => {
      const { container } = render(<Card variant={variant}>Card</Card>);
      expect(container.firstChild).toHaveAttribute('data-variant', variant);
    });
  }

  it('defaults to default variant', () => {
    const { container } = render(<Card>Card</Card>);
    expect(container.firstChild).toHaveAttribute('data-variant', 'default');
  });
});

// ─── 3. Padding ───────────────────────────────────────────────────────────────

describe('Card — padding', () => {
  const paddings = ['none', 'sm', 'md', 'lg'] as const;

  for (const padding of paddings) {
    it(`renders ${padding} padding with correct data-padding`, () => {
      const { container } = render(<Card padding={padding}>Card</Card>);
      expect(container.firstChild).toHaveAttribute('data-padding', padding);
    });
  }

  it('defaults to md padding', () => {
    const { container } = render(<Card>Card</Card>);
    expect(container.firstChild).toHaveAttribute('data-padding', 'md');
  });
});

// ─── 4. Interactive state ─────────────────────────────────────────────────────

describe('Card — interactive state', () => {
  it('sets data-interactive when interactive=true', () => {
    const { container } = render(<Card interactive>Card</Card>);
    expect(container.firstChild).toHaveAttribute('data-interactive', 'true');
  });

  it('does not set data-interactive by default', () => {
    const { container } = render(<Card>Card</Card>);
    expect(container.firstChild).not.toHaveAttribute('data-interactive');
  });
});

// ─── 5. Sub-components ────────────────────────────────────────────────────────

describe('Card — sub-components', () => {
  it('Card.Header renders', () => {
    render(
      <Card>
        <Card.Header>Header content</Card.Header>
      </Card>,
    );
    expect(screen.getByText('Header content')).toBeInTheDocument();
  });

  it('Card.Body renders', () => {
    render(
      <Card>
        <Card.Body>Body content</Card.Body>
      </Card>,
    );
    expect(screen.getByText('Body content')).toBeInTheDocument();
  });

  it('Card.Footer renders', () => {
    render(
      <Card>
        <Card.Footer>Footer content</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('Card.Image renders', () => {
    render(
      <Card>
        <Card.Image>Image area</Card.Image>
      </Card>,
    );
    expect(screen.getByText('Image area')).toBeInTheDocument();
  });

  it('all sub-components render together', () => {
    render(
      <Card>
        <Card.Image>Img</Card.Image>
        <Card.Header>Title</Card.Header>
        <Card.Body>Description</Card.Body>
        <Card.Footer>Action</Card.Footer>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });
});

// ─── 5b. Bare-children padding (implicit Card.Body wrapping) ─────────────────

describe('Card — bare children get padding via an implicit Card.Body wrapper', () => {
  it('wraps bare children (no sub-components used) in the same element Card.Body renders', () => {
    const { container: bare } = render(<Card padding="md">Plain content</Card>);
    const { container: explicit } = render(
      <Card padding="md">
        <Card.Body>Plain content</Card.Body>
      </Card>,
    );

    // `getByText` returns the element whose own text content matches — here
    // that's the wrapping `.body`-classed div itself, not a bare text node.
    const bareWrapper = within(bare).getByText('Plain content');
    const explicitBody = within(explicit).getByText('Plain content');

    // Not the card root itself — actually wrapped, not left bare.
    expect(bareWrapper).not.toBe(bare.firstChild);
    // Same class as an explicit Card.Body, i.e. genuinely reusing that padding rule.
    expect(bareWrapper.className).toBe(explicitBody.className);
  });

  it('does not double-wrap when Card.Body is already used explicitly', () => {
    const { container } = render(
      <Card padding="md">
        <Card.Body>Already wrapped</Card.Body>
      </Card>,
    );
    const cardRoot = container.firstChild as HTMLElement;
    // Exactly one child (the Card.Body itself) — no extra wrapper inserted around it.
    expect(cardRoot.children).toHaveLength(1);
  });

  it('does not wrap children when any other sub-component (Header/Footer/Image) is present', () => {
    const { container } = render(
      <Card padding="md">
        <Card.Header>Title</Card.Header>
        <Card.Body>Description</Card.Body>
        <Card.Footer>Action</Card.Footer>
      </Card>,
    );
    const cardRoot = container.firstChild as HTMLElement;
    // Exactly the 3 sub-components, passed through unmodified — same structure as before this fix.
    expect(cardRoot.children).toHaveLength(3);
  });

  it('leaves a bare sibling unwrapped/unpadded when mixed with a real sub-component (known, documented scope limit — not fixed by this change)', () => {
    const { container } = render(
      <Card padding="md">
        Bare trailing text
        <Card.Footer>Action</Card.Footer>
      </Card>,
    );
    const cardRoot = container.firstChild as HTMLElement;
    // The bare string child renders as a raw text node directly under the card
    // root — not promoted into its own wrapper element — once any real
    // sub-component (Card.Footer here) is present elsewhere in the tree.
    const rawTextNode = Array.from(cardRoot.childNodes).find(
      (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim() === 'Bare trailing text',
    );
    expect(rawTextNode).toBeDefined();
  });
});

// ─── 6. forwardRef ────────────────────────────────────────────────────────────

describe('Card — forwardRef', () => {
  it('forwards ref to HTMLDivElement', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Card</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ─── 7. className ─────────────────────────────────────────────────────────────

describe('Card — className', () => {
  it('appends custom className', () => {
    const { container } = render(<Card className="custom-card">Card</Card>);
    expect(container.firstChild).toHaveClass('custom-card');
  });
});

// ─── 8. Accessibility (axe) ──────────────────────────────────────────────────

describe('Card — accessibility (axe)', () => {
  const variants = ['default', 'outline', 'ghost', 'elevated'] as const;

  for (const variant of variants) {
    it(`${variant} variant has no axe violations`, async () => {
      const { container } = render(
        <Card variant={variant}>
          <Card.Header><h3>Card title</h3></Card.Header>
          <Card.Body>Card body text.</Card.Body>
        </Card>,
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  }

  it('interactive card has no axe violations', async () => {
    const { container } = render(
      <Card interactive tabIndex={0} aria-label="View details">
        <Card.Body>Clickable card</Card.Body>
      </Card>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── VhyxSeal contract ────────────────────────────────────────────────────────

describe('Card — VhyxSeal contract', () => {
  it('has a valid contract', () => {
    expect(cardContract).toBeDefined();
    expect(typeof cardContract.fingerprint).toBe('string');
    expect(cardContract.fingerprint.length).toBeGreaterThan(0);
    expect(cardContract.intent).toBeDefined();
    expect(cardContract.safetyLevel).toBeDefined();
  });

  it('contract is frozen', () => {
    expect(Object.isFrozen(cardContract)).toBe(true);
  });

  it('contract has valid type', () => {
    expect(['action', 'input', 'navigation', 'display', 'confirmation']).toContain(
      cardContract.type,
    );
  });
});
