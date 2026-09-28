/** SVG child shapes of one icon drawing: element name and its geometry attributes. */
export type IconNode = ReadonlyArray<readonly [string, Readonly<Record<string, string>>]>;

/** Named sizes, mapped to `--vhyx-icon-size-*` tokens with pixel fallbacks. */
export const ICON_SIZES = { xs: 12, sm: 16, md: 20, lg: 24, xl: 32 } as const;
export type IconSizeToken = keyof typeof ICON_SIZES;
/** A size token, a number of pixels, or any CSS length. */
export type IconSize = IconSizeToken | number | (string & {});

/** Built-in motion. Needs `@vhyxui/icons/style.css`; respects reduced motion. */
export type IconAnimation = 'draw' | 'spin';

export const isSizeToken = (size: unknown): size is IconSizeToken =>
  typeof size === 'string' && Object.prototype.hasOwnProperty.call(ICON_SIZES, size);

/** CSS value for a size: tokens become `var(--vhyx-icon-size-sm, 16px)`, numbers stay pixels. */
export const sizeValue = (size: IconSize): string | number =>
  isSizeToken(size) ? `var(--vhyx-icon-size-${size}, ${ICON_SIZES[size]}px)` : size;

/** True when a size is small enough to prefer an optical 16px drawing. */
export const isSmall = (size: IconSize): boolean =>
  size === 'xs' || size === 'sm' || (typeof size === 'number' && size <= 16);

/** Default stroke width, overridable with the `--vhyx-icon-stroke` token. */
export const DEFAULT_STROKE = 'var(--vhyx-icon-stroke, 2)';
