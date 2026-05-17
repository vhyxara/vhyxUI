import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { mergeRefs } from '../src/slot/mergeRefs';

describe('mergeRefs — callback refs', () => {
  it('calls a single callback ref with the node', () => {
    const callback = vi.fn();
    const merged = mergeRefs(callback);
    const node = {} as HTMLDivElement;

    merged(node);

    expect(callback).toHaveBeenCalledOnce();
    expect(callback).toHaveBeenCalledWith(node);
  });

  it('calls all callback refs when multiple are provided', () => {
    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const cb3 = vi.fn();
    const merged = mergeRefs(cb1, cb2, cb3);
    const node = {} as HTMLDivElement;

    merged(node);

    expect(cb1).toHaveBeenCalledWith(node);
    expect(cb2).toHaveBeenCalledWith(node);
    expect(cb3).toHaveBeenCalledWith(node);
  });

  it('calls callback refs with null on unmount', () => {
    const callback = vi.fn();
    const merged = mergeRefs(callback);

    merged(null);

    expect(callback).toHaveBeenCalledWith(null);
  });
});

describe('mergeRefs — ref objects', () => {
  it('sets .current on a React.createRef object', () => {
    const ref = React.createRef<HTMLDivElement>();
    const merged = mergeRefs(ref);
    const node = {} as HTMLDivElement;

    merged(node);

    expect(ref.current).toBe(node);
  });

  it('sets .current on multiple ref objects', () => {
    const ref1 = React.createRef<HTMLDivElement>();
    const ref2 = React.createRef<HTMLDivElement>();
    const merged = mergeRefs(ref1, ref2);
    const node = {} as HTMLDivElement;

    merged(node);

    expect(ref1.current).toBe(node);
    expect(ref2.current).toBe(node);
  });

  it('sets .current to null on unmount', () => {
    const ref = React.createRef<HTMLDivElement>();
    const merged = mergeRefs(ref);
    const node = {} as HTMLDivElement;

    merged(node);
    expect(ref.current).toBe(node);

    merged(null);
    expect(ref.current).toBeNull();
  });
});

describe('mergeRefs — mixed ref types', () => {
  it('handles both callback and object refs together', () => {
    const callback = vi.fn();
    const objRef = React.createRef<HTMLDivElement>();
    const merged = mergeRefs(callback, objRef);
    const node = {} as HTMLDivElement;

    merged(node);

    expect(callback).toHaveBeenCalledWith(node);
    expect(objRef.current).toBe(node);
  });
});

describe('mergeRefs — null and undefined handling', () => {
  it('skips null refs without throwing', () => {
    const callback = vi.fn();
    const merged = mergeRefs(null, callback);
    const node = {} as HTMLDivElement;

    expect(() => merged(node)).not.toThrow();
    expect(callback).toHaveBeenCalledWith(node);
  });

  it('skips undefined refs without throwing', () => {
    const callback = vi.fn();
    const merged = mergeRefs(undefined, callback);
    const node = {} as HTMLDivElement;

    expect(() => merged(node)).not.toThrow();
    expect(callback).toHaveBeenCalledWith(node);
  });

  it('returns a function even when all refs are null', () => {
    const merged = mergeRefs(null, null, null);
    const node = {} as HTMLDivElement;

    expect(typeof merged).toBe('function');
    expect(() => merged(node)).not.toThrow();
  });
});
