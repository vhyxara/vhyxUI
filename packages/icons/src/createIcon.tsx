import { forwardRef, createElement, type CSSProperties, type ReactElement, type SVGProps } from 'react';
import { DEFAULT_STROKE, isSizeToken, isSmall, sizeValue, type IconAnimation, type IconNode, type IconSize } from './types.js';

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'ref'> {
  /** `xs | sm | md | lg | xl` (design tokens), a number of pixels, or any CSS length. Defaults to `1em`. */
  size?: IconSize;
  /** Stroke width in the 24×24 grid. Defaults to the `--vhyx-icon-stroke` token (2). */
  strokeWidth?: number | string;
  /** Accessible name. Without `title` or `aria-label` the icon is decorative and hidden from assistive technology. */
  title?: string;
  /** Built-in motion: `draw` traces the strokes in, `spin` rotates. Needs `@vhyxui/icons/style.css`. */
  animate?: IconAnimation;
}

export interface CreateIconOptions {
  /** Optical drawing on the 16×16 grid, used automatically at `xs`/`sm` or ≤16px. */
  small?: IconNode;
  /** Filled drawing (solid variant) instead of strokes. */
  solid?: boolean;
}

/**
 * Builds an icon component from SVG node data. Icons inherit `currentColor`, scale with the
 * surrounding text by default, read size and stroke tokens, and forward refs to the `<svg>`.
 */
export function createIcon(displayName: string, node: IconNode, options: CreateIconOptions = {}) {
  const Icon = forwardRef<SVGSVGElement, IconProps>(function Icon(
    { size = '1em', strokeWidth, title, animate, className, style, children, ...rest },
    ref,
  ): ReactElement {
    const labelled = title !== undefined || rest['aria-label'] !== undefined || rest['aria-labelledby'] !== undefined;
    const useSmall = options.small !== undefined && isSmall(size);
    const shapes = useSmall ? options.small! : node;
    const token = isSizeToken(size);
    const css: CSSProperties = {
      ...(token ? { width: sizeValue(size), height: sizeValue(size) } : null),
      ...(!options.solid && strokeWidth === undefined ? { strokeWidth: DEFAULT_STROKE } : null),
      ...style,
    };
    const paint = options.solid
      ? { fill: 'currentColor' }
      : { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, ...(strokeWidth !== undefined ? { strokeWidth } : null) };
    return createElement(
      'svg',
      {
        ref,
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: useSmall ? '0 0 16 16' : '0 0 24 24',
        ...(token ? null : { width: size, height: size }),
        ...paint,
        focusable: 'false',
        className: ['vhyx-icon', animate ? `vhyx-icon--${animate}` : '', className ?? ''].filter(Boolean).join(' '),
        style: css,
        ...(labelled ? { role: 'img' } : { 'aria-hidden': true }),
        ...rest,
      },
      title !== undefined ? createElement('title', null, title) : null,
      ...shapes.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs, ...(animate === 'draw' ? { pathLength: 1 } : null) })),
      children,
    );
  });
  Icon.displayName = displayName;
  return Icon;
}
