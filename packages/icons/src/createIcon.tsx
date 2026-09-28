import { forwardRef, createElement, type ReactElement, type SVGProps } from 'react';

/** A single SVG child: element name and its attributes. */
export type IconNode = ReadonlyArray<readonly [string, Readonly<Record<string, string>>]>;

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** Width and height. Numbers are pixels; strings are any CSS length. Defaults to `1em`. */
  size?: number | string;
  /** Stroke width in the 24×24 grid. Defaults to 2. */
  strokeWidth?: number | string;
  /**
   * Accessible name. Without `title` or `aria-label` the icon is decorative
   * and hidden from assistive technology.
   */
  title?: string;
}

/**
 * Builds an icon component from SVG node data. Icons inherit `currentColor`,
 * scale with the surrounding text by default, and forward refs to the `<svg>`.
 */
export function createIcon(displayName: string, node: IconNode) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
    { size = '1em', strokeWidth = 2, title, children, ...rest },
    ref,
  ): ReactElement {
    const labelled = title !== undefined || rest['aria-label'] !== undefined || rest['aria-labelledby'] !== undefined;
    return createElement(
      'svg',
      {
        ref,
        xmlns: 'http://www.w3.org/2000/svg',
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        focusable: 'false',
        ...(labelled ? { role: 'img' } : { 'aria-hidden': true }),
        ...rest,
      },
      title !== undefined ? createElement('title', null, title) : null,
      ...node.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs })),
      children,
    );
  });
  Icon.displayName = displayName;
  return Icon;
}
