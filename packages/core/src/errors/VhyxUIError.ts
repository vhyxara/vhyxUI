/**
 * All error codes thrown by VhyxUI.
 *
 * SCREAMING_SNAKE_CASE. Every code prefixed with VHYXUI_.
 * Never remove or rename codes — components and tooling may depend on them.
 */
export enum VhyxUIErrorCode {
  VHYXUI_MISSING_CONTEXT      = 'VHYXUI_MISSING_CONTEXT',
  VHYXUI_MISSING_TITLE        = 'VHYXUI_MISSING_TITLE',
  VHYXUI_INVALID_PROP         = 'VHYXUI_INVALID_PROP',
  VHYXUI_PROVIDER_MISSING     = 'VHYXUI_PROVIDER_MISSING',
  VHYXUI_TOAST_LIMIT_EXCEEDED = 'VHYXUI_TOAST_LIMIT_EXCEEDED',
}

/** Configuration object passed to the VhyxUIError constructor. */
export interface VhyxUIErrorOptions {
  /** Machine readable error code from VhyxUIErrorCode. */
  code: VhyxUIErrorCode;
  /** Human readable description of what went wrong. */
  message: string;
  /** Concrete action the developer should take to fix this error. */
  suggestion?: string;
  /** Structured context relevant to this specific error instance. */
  context?: Record<string, unknown>;
}

/**
 * Base error class for all errors thrown by VhyxUI.
 *
 * In development: thrown with a helpful message and suggestion.
 * In production: caught by component boundaries, logged to console.error.
 * The visual layer never breaks because of VhyxUI internal errors.
 */
export class VhyxUIError extends Error {
  /** Machine readable error code — use this for programmatic error handling. */
  readonly code: VhyxUIErrorCode;
  /** Concrete action the developer should take to fix this error. */
  readonly suggestion: string | undefined;
  /** Structured context relevant to this specific error instance. */
  readonly context: Record<string, unknown> | undefined;

  constructor(options: VhyxUIErrorOptions) {
    super(options.message);
    this.name = 'VhyxUIError';
    this.code = options.code;
    this.suggestion = options.suggestion;
    this.context = options.context;
  }
}
