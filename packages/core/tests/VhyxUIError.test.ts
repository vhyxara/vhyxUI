import { describe, it, expect } from 'vitest';
import { VhyxUIError, VhyxUIErrorCode } from '../src/errors/VhyxUIError';

describe('VhyxUIErrorCode', () => {
  it('has all five expected error codes', () => {
    expect(VhyxUIErrorCode.VHYXUI_MISSING_CONTEXT).toBe('VHYXUI_MISSING_CONTEXT');
    expect(VhyxUIErrorCode.VHYXUI_MISSING_TITLE).toBe('VHYXUI_MISSING_TITLE');
    expect(VhyxUIErrorCode.VHYXUI_INVALID_PROP).toBe('VHYXUI_INVALID_PROP');
    expect(VhyxUIErrorCode.VHYXUI_PROVIDER_MISSING).toBe('VHYXUI_PROVIDER_MISSING');
    expect(VhyxUIErrorCode.VHYXUI_TOAST_LIMIT_EXCEEDED).toBe('VHYXUI_TOAST_LIMIT_EXCEEDED');
  });

  it('has exactly five members', () => {
    const keys = Object.keys(VhyxUIErrorCode).filter(
      (k) => isNaN(Number(k)),
    );
    expect(keys).toHaveLength(5);
  });
});

describe('VhyxUIError', () => {
  it('constructs with required fields', () => {
    const err = new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_MISSING_CONTEXT,
      message: 'Missing context',
    });

    expect(err.code).toBe(VhyxUIErrorCode.VHYXUI_MISSING_CONTEXT);
    expect(err.message).toBe('Missing context');
  });

  it('sets name to VhyxUIError', () => {
    const err = new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_MISSING_TITLE,
      message: 'test',
    });
    expect(err.name).toBe('VhyxUIError');
  });

  it('extends Error — instanceof checks pass', () => {
    const err = new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_INVALID_PROP,
      message: 'test',
    });
    expect(err).toBeInstanceOf(VhyxUIError);
    expect(err).toBeInstanceOf(Error);
  });

  it('stores optional suggestion when provided', () => {
    const err = new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_PROVIDER_MISSING,
      message: 'provider missing',
      suggestion: 'Wrap with VhyxUIProvider',
    });
    expect(err.suggestion).toBe('Wrap with VhyxUIProvider');
  });

  it('suggestion is undefined when not provided', () => {
    const err = new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_PROVIDER_MISSING,
      message: 'provider missing',
    });
    expect(err.suggestion).toBeUndefined();
  });

  it('stores optional context when provided', () => {
    const context = { componentId: 'my-button', field: 'safetyLevel' };
    const err = new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_TOAST_LIMIT_EXCEEDED,
      message: 'limit exceeded',
      context,
    });
    expect(err.context).toEqual(context);
  });

  it('context is undefined when not provided', () => {
    const err = new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_TOAST_LIMIT_EXCEEDED,
      message: 'limit exceeded',
    });
    expect(err.context).toBeUndefined();
  });

  it('message is accessible via .message (Error property)', () => {
    const err = new VhyxUIError({
      code: VhyxUIErrorCode.VHYXUI_MISSING_CONTEXT,
      message: 'The component must be used within its provider',
    });
    expect(err.message).toBe('The component must be used within its provider');
  });

  it('works with all five error codes', () => {
    const codes = [
      VhyxUIErrorCode.VHYXUI_MISSING_CONTEXT,
      VhyxUIErrorCode.VHYXUI_MISSING_TITLE,
      VhyxUIErrorCode.VHYXUI_INVALID_PROP,
      VhyxUIErrorCode.VHYXUI_PROVIDER_MISSING,
      VhyxUIErrorCode.VHYXUI_TOAST_LIMIT_EXCEEDED,
    ] as const;

    for (const code of codes) {
      const err = new VhyxUIError({ code, message: 'test' });
      expect(err.code).toBe(code);
    }
  });
});
