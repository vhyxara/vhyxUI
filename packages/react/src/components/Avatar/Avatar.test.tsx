import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'vitest-axe';
import React from 'react';
import { Avatar, AvatarGroup, getInitials } from './Avatar';
import { Skeleton } from '../Skeleton';

describe('getInitials', () => {
  it('derives initials', () => {
    expect(getInitials('Ada Lovelace')).toBe('AL');
    expect(getInitials('  plato ')).toBe('P');
    expect(getInitials('Jean Luc Picard')).toBe('JP');
    expect(getInitials('')).toBe('?');
  });
});

describe('Avatar', () => {
  it('shows initials without an image and is labelled by name', () => {
    render(<Avatar name="Ada Lovelace" />);
    expect(screen.getByRole('img', { name: 'Ada Lovelace' })).toHaveTextContent('AL');
  });

  it('shows the image and falls back to initials on error', () => {
    const { container } = render(<Avatar name="Ada" src="/broken.png" />);
    const img = container.querySelector('img');
    expect(img).toBeInTheDocument();
    fireEvent.error(img as HTMLImageElement);
    expect(container.querySelector('img')).toBeNull();
    expect(screen.getByRole('img', { name: 'Ada' })).toHaveTextContent('A');
  });

  it('includes status in the label', () => {
    render(<Avatar name="Ada" status="online" />);
    expect(screen.getByRole('img', { name: 'Ada (online)' })).toBeInTheDocument();
  });

  it('group shows an overflow chip', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="A B" />
        <Avatar name="C D" />
        <Avatar name="E F" />
        <Avatar name="G H" />
      </AvatarGroup>,
    );
    expect(screen.getByRole('img', { name: '2 more' })).toHaveTextContent('+2');
    expect(screen.getAllByRole('img')).toHaveLength(3);
  });

  it('has no axe violations', async () => {
    const { container } = render(<Avatar name="Ada Lovelace" status="busy" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe('Skeleton', () => {
  it('is hidden from assistive tech', () => {
    const { container } = render(<Skeleton width={40} height={40} variant="circle" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute('aria-hidden', 'true');
    expect(el.style.width).toBe('40px');
    expect(el.dataset['variant']).toBe('circle');
  });

  it('renders multiple text lines with a shorter last line', () => {
    const { container } = render(<Skeleton lines={3} />);
    const lines = container.querySelectorAll('[data-variant="text"]');
    expect(lines).toHaveLength(3);
    expect((lines[2] as HTMLElement).style.width).toBe('60%');
  });
});
