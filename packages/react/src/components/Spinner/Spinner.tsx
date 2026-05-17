'use client';

import React from 'react';
import styles from './Spinner.module.css';

/** Size tokens available on the Spinner component. */
export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Color variant of the spinner stroke. */
export type SpinnerVariant = 'default' | 'accent' | 'white';

/** Props for the Spinner component. */
export interface SpinnerProps extends React.SVGAttributes<SVGElement> {
  /** Size of the spinner. @default 'md' */
  size?: SpinnerSize;
  /** Color variant of the spinner stroke. @default 'default' */
  variant?: SpinnerVariant;
  /**
   * Screen reader label — always rendered as visually-hidden text.
   * @default 'Loading'
   */
  label?: string;
}

/**
 * Spinner — indicates an in-progress asynchronous operation.
 *
 * Implemented as an SVG element (not the CSS border trick) for superior
 * control and visual quality. The sr-only label is always present.
 * role="status" is set so screen readers announce it as a live region.
 *
 * Animation: vhyx-spin infinite linear 0.7s — from motion.css keyframes.
 *
 * @example
 * <Spinner size="md" label="Saving changes" />
 */
export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  (
    {
      size = 'md',
      variant = 'default',
      label = 'Loading',
      className,
      ...rest
    },
    ref,
  ) => {
    const svgClass = [styles['spinner'], className].filter(Boolean).join(' ');

    return (
      <svg
        ref={ref}
        role="status"
        aria-label={label}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={svgClass}
        data-size={size}
        data-variant={variant}
        {...rest}
      >
        {/* sr-only text — rendered for screen readers that don't read aria-label on SVG */}
        <title>{label}</title>

        {/* Track circle — low opacity background ring */}
        <circle
          cx={12}
          cy={12}
          r={9}
          strokeWidth={2.5}
          stroke="currentColor"
          opacity={0.2}
        />
        {/* Spinning arc */}
        <path
          d="M12 3a9 9 0 0 1 9 9"
          strokeWidth={2.5}
          stroke="currentColor"
          strokeLinecap="round"
        />
      </svg>
    );
  },
);

Spinner.displayName = 'VhyxSpinner';
