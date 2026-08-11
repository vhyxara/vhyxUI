'use client';

import React from 'react';
import type { ComponentContract } from '@vhyxui/core';
import { cardContract } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import { useId } from '../shared/useId';
import styles from './Card.module.css';

/** Visual variant of the Card. */
export type CardVariant = 'default' | 'outline' | 'ghost' | 'elevated';

/** Padding size applied to the Card. */
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

/** Root props for the Card compound component. */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Visual variant. @default 'default' */
  variant?: CardVariant;
  /** Padding inside the card. @default 'md' */
  padding?: CardPadding;
  /**
   * When true, adds hover and active states — use for clickable cards.
   * Add onClick and role="button" or wrap with a link separately.
   */
  interactive?: boolean;
  /** VhyxSeal contract override. */
  contract?: Partial<ComponentContract>;
}

/**
 * `padding` is implemented entirely via CSS targeting `.header`/`.body`/
 * `.footer` (see Card.module.css) — the root `.card` element itself has no
 * padding rule. That's correct when a consumer uses the sub-components, but
 * means a `Card` given only bare children (no `Card.Header`/`Body`/`Footer`)
 * previously rendered with zero internal padding regardless of the `padding`
 * prop, silently. Rather than adding padding to the root element (which
 * would double up with `.header`/`.body`/`.footer`'s own padding when those
 * ARE used, and would break `Card.Image`'s intentional edge-to-edge bleed),
 * bare children are implicitly wrapped in the same element `Card.Body`
 * itself renders — reusing the existing, already-correct `.body` padding
 * rule instead of adding a new one. When any sub-component is already
 * present, children pass through completely unwrapped, unchanged from
 * before this fix.
 */
function isCardSubComponent(child: React.ReactNode): boolean {
  return (
    React.isValidElement(child) &&
    (child.type === CardHeader ||
      child.type === CardBody ||
      child.type === CardFooter ||
      child.type === CardImage)
  );
}

/**
 * Card — a content container with optional sub-layout components.
 *
 * Sub-components: Card.Header, Card.Body, Card.Footer, Card.Image.
 *
 * @example
 * <Card variant="elevated" padding="md" interactive onClick={...}>
 *   <Card.Header><h3>Title</h3></Card.Header>
 *   <Card.Body><p>Description</p></Card.Body>
 *   <Card.Footer><Button>Action</Button></Card.Footer>
 * </Card>
 */
const CardRoot = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      interactive = false,
      contract,
      className,
      children,
      ...rest
    },
    ref,
  ) => {
    const cardId = useId('vhyx-card');

    const effectiveContract: Partial<ComponentContract> = {
      ...cardContract,
      id: cardId,
      ...contract,
    };

    const cardClass = [styles['card'], className].filter(Boolean).join(' ');

    const hasSubComponents = React.Children.toArray(children).some(isCardSubComponent);
    const content = hasSubComponents ? children : <CardBody>{children}</CardBody>;

    return (
      <div
        ref={ref}
        className={cardClass}
        data-variant={variant}
        data-padding={padding}
        data-interactive={interactive ? true : undefined}
        data-vhyx-contract={JSON.stringify(effectiveContract)}
        {...rest}
      >
        {content}
      </div>
    );
  },
);

CardRoot.displayName = 'VhyxCard';

// ─── Sub-components ───────────────────────────────────────────────────────────

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function CardHeader({ children, className, ...rest }: CardHeaderProps): React.ReactElement {
  const headerClass = [styles['header'], className].filter(Boolean).join(' ');
  return (
    <div className={headerClass} {...rest}>
      {children}
    </div>
  );
}

CardHeader.displayName = 'VhyxCardHeader';

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function CardBody({ children, className, ...rest }: CardBodyProps): React.ReactElement {
  const bodyClass = [styles['body'], className].filter(Boolean).join(' ');
  return (
    <div className={bodyClass} {...rest}>
      {children}
    </div>
  );
}

CardBody.displayName = 'VhyxCardBody';

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function CardFooter({ children, className, ...rest }: CardFooterProps): React.ReactElement {
  const footerClass = [styles['footer'], className].filter(Boolean).join(' ');
  return (
    <div className={footerClass} {...rest}>
      {children}
    </div>
  );
}

CardFooter.displayName = 'VhyxCardFooter';

export interface CardImageProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function CardImage({ children, className, ...rest }: CardImageProps): React.ReactElement {
  const imageClass = [styles['image'], className].filter(Boolean).join(' ');
  return (
    <div className={imageClass} {...rest}>
      {children}
    </div>
  );
}

CardImage.displayName = 'VhyxCardImage';

// ─── Compound export ──────────────────────────────────────────────────────────

/** Card — content container with optional layout sub-components. */
// Library-level contract for SealContext registration; per-instance ids set via DOM attribute.
const cardSealContract = { ...cardContract, id: 'vhyxui-card' } as Readonly<ComponentContract>;

export const Card = Object.assign(
  withAgentContract(CardRoot, cardSealContract),
  {
    Header: CardHeader,
    Body: CardBody,
    Footer: CardFooter,
    Image: CardImage,
  },
);
Card.displayName = 'VhyxCard';
