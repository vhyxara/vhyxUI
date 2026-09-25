/**
 * Single source of truth for the Tailwind ⇄ VhyxUI token mapping.
 * Tailwind name → VhyxUI CSS custom property. Used by preset.cjs (v3) and
 * scripts/build-theme.cjs (v4 theme.css) so both stay identical.
 */
const colors = {
  background: '--vhyx-color-bg',
  'background-subtle': '--vhyx-color-bg-subtle',
  'background-muted': '--vhyx-color-bg-muted',
  'background-inverse': '--vhyx-color-bg-inverse',
  surface: '--vhyx-color-surface',
  'surface-raised': '--vhyx-color-surface-raised',
  'surface-overlay': '--vhyx-color-surface-overlay',
  overlay: '--vhyx-color-overlay',
  border: '--vhyx-color-border',
  'border-strong': '--vhyx-color-border-strong',
  ring: '--vhyx-color-border-focus',
  foreground: '--vhyx-color-text',
  'foreground-subtle': '--vhyx-color-text-subtle',
  'foreground-muted': '--vhyx-color-text-muted',
  'foreground-disabled': '--vhyx-color-text-disabled',
  'foreground-inverse': '--vhyx-color-text-inverse',
  accent: '--vhyx-color-accent',
  'accent-hover': '--vhyx-color-accent-hover',
  'accent-active': '--vhyx-color-accent-active',
  'accent-subtle': '--vhyx-color-accent-subtle',
  'accent-muted': '--vhyx-color-accent-muted',
  'accent-foreground': '--vhyx-color-text-on-accent',
  success: '--vhyx-color-success',
  'success-hover': '--vhyx-color-success-hover',
  'success-subtle': '--vhyx-color-success-subtle',
  'success-foreground': '--vhyx-color-success-text',
  danger: '--vhyx-color-danger',
  'danger-hover': '--vhyx-color-danger-hover',
  'danger-subtle': '--vhyx-color-danger-subtle',
  'danger-foreground': '--vhyx-color-danger-text',
  warning: '--vhyx-color-warning',
  'warning-hover': '--vhyx-color-warning-hover',
  'warning-subtle': '--vhyx-color-warning-subtle',
  'warning-foreground': '--vhyx-color-warning-text',
  info: '--vhyx-color-info',
  'info-hover': '--vhyx-color-info-hover',
  'info-subtle': '--vhyx-color-info-subtle',
  'info-foreground': '--vhyx-color-info-text',
};

const radius = { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl', '2xl': '2xl', '3xl': '3xl', full: 'full' };
const shadow = { xs: 'xs', sm: 'sm', md: 'md', lg: 'lg', xl: 'xl', '2xl': '2xl', inner: 'inner', focus: 'focus' };
const font = { sans: 'sans', mono: 'mono', serif: 'serif' };
const ease = { standard: 'standard', decelerate: 'decelerate', accelerate: 'accelerate', spring: 'spring', bounce: 'bounce', smooth: 'smooth' };
const duration = { instant: 'instant', fast: 'fast', normal: 'normal', slow: 'slow', glacial: 'glacial' };

module.exports = { colors, radius, shadow, font, ease, duration };
