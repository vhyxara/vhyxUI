'use client';

import React, { useState } from 'react';
import { cx } from '../../utils/cx';
import styles from './Avatar.module.css';

/** Avatar sizes. */
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
/** Presence indicator. */
export type AvatarStatus = 'online' | 'busy' | 'away' | 'offline';

/** Props for Avatar. */
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Image URL. Falls back to initials when missing or when it fails to load. */
  src?: string;
  /** Person or entity name — used for alt text and initials. */
  name: string;
  /** @default 'md' */
  size?: AvatarSize;
  /** @default 'circle' */
  shape?: 'circle' | 'square';
  /** Presence dot in the corner. */
  status?: AvatarStatus;
}

/**
 * Derives up to two initials from a name.
 * @example
 * getInitials('Ada Lovelace') // 'AL'
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

/**
 * Avatar — image with automatic initials fallback and optional presence dot.
 * @example
 * <Avatar name="Ada Lovelace" src="/ada.png" status="online" />
 */
export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, name, size = 'md', shape = 'circle', status, className, ...rest }, ref) => {
    const [failedSrc, setFailedSrc] = useState<string | null>(null);
    const showImage = Boolean(src) && failedSrc !== src;
    return (
      <span
        ref={ref}
        role="img"
        aria-label={status ? `${name} (${status})` : name}
        className={cx(styles['avatar'], className)}
        data-size={size}
        data-shape={shape}
        {...rest}
      >
        {showImage ? (
          <img className={styles['image']} src={src} alt="" onError={() => setFailedSrc(src ?? null)} />
        ) : (
          <span aria-hidden="true">{getInitials(name)}</span>
        )}
        {status && <span className={styles['status']} data-status={status} aria-hidden="true" />}
      </span>
    );
  },
);
Avatar.displayName = 'VhyxAvatar';

/** Props for AvatarGroup. */
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show at most this many avatars, then a "+N" chip. */
  max?: number;
  /** Size applied to the overflow chip. @default 'md' */
  size?: AvatarSize;
  children: React.ReactNode;
}

/**
 * AvatarGroup — overlapping stack of avatars with "+N" overflow.
 * @example
 * <AvatarGroup max={3}>{people.map(p => <Avatar key={p.id} name={p.name} />)}</AvatarGroup>
 */
export function AvatarGroup({ max, size = 'md', className, children, ...rest }: AvatarGroupProps): React.ReactElement {
  const items = React.Children.toArray(children);
  const visible = max !== undefined ? items.slice(0, max) : items;
  const hidden = items.length - visible.length;
  return (
    <div role="group" className={cx(styles['group'], className)} {...rest}>
      {hidden > 0 && (
        <span className={styles['avatar']} data-size={size} role="img" aria-label={`${hidden} more`}>
          +{hidden}
        </span>
      )}
      {[...visible].reverse()}
    </div>
  );
}
