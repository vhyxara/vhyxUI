import { DEFAULT_STROKE, isSizeToken, sizeValue, type IconAnimation, type IconNode, type IconSize } from './types.js';

export interface ToSvgOptions {
  /** Size token, pixels or CSS length. Defaults to `1em`. */
  size?: IconSize;
  /** Stroke width; defaults to the `--vhyx-icon-stroke` token (2). */
  strokeWidth?: number | string;
  /** Accessible name; without it the SVG is decorative (`aria-hidden`). */
  title?: string;
  /** Built-in motion (needs `@vhyxui/icons/style.css`). */
  animate?: IconAnimation;
  /** Extra CSS classes. */
  className?: string;
  /** Filled drawing instead of strokes. */
  solid?: boolean;
  /** Extra attributes for the `<svg>` element. */
  attributes?: Record<string, string | number>;
}

const esc = (v: string | number): string =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * Renders an icon to an SVG string — no framework required. Works in the browser, on the server
 * and in build tools.
 * @example toSvg(checkNode, { size: 'sm', title: 'Done' })
 */
export function toSvg(node: IconNode, options: ToSvgOptions = {}): string {
  const { size = '1em', strokeWidth, title, animate, className, solid = false, attributes = {} } = options;
  const token = isSizeToken(size);
  const style = [
    token ? `width:${sizeValue(size)};height:${sizeValue(size)}` : '',
    !solid && strokeWidth === undefined ? `stroke-width:${DEFAULT_STROKE}` : '',
  ].filter(Boolean).join(';');
  const attrs: Record<string, string | number> = {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: '0 0 24 24',
    ...(token ? {} : { width: size, height: size }),
    ...(solid ? { fill: 'currentColor' } : { fill: 'none', stroke: 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    ...(strokeWidth !== undefined && !solid ? { 'stroke-width': strokeWidth } : {}),
    focusable: 'false',
    class: ['vhyx-icon', animate ? `vhyx-icon--${animate}` : '', className ?? ''].filter(Boolean).join(' '),
    ...(style ? { style } : {}),
    ...(title !== undefined ? { role: 'img', 'aria-label': title } : { 'aria-hidden': 'true' }),
    ...attributes,
  };
  const open = Object.entries(attrs).map(([k, v]) => `${k}="${esc(v)}"`).join(' ');
  const shapes = node
    .map(([tag, a]) => `<${tag} ${Object.entries(a).map(([k, v]) => `${k}="${esc(v)}"`).join(' ')}${animate === 'draw' ? ' pathLength="1"' : ''}/>`)
    .join('');
  return `<svg ${open}>${title !== undefined ? `<title>${esc(title)}</title>` : ''}${shapes}</svg>`;
}
