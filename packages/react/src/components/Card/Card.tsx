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
        {children}
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
