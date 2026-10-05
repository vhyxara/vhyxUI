import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** What a component needs to animate an element out before it unmounts. */
export interface Presence {
  /** True while the element should be in the DOM: open, or closed but still playing its exit animation. */
  present: boolean;
  /** Value for the element's `data-state`; CSS picks the enter or exit animation from it. */
  state: 'open' | 'closed';
  /** Attach to the element that plays the exit animation. */
  ref: (node: HTMLElement | null) => void;
}

/**
 * Keeps an element mounted after `open` turns false until its exit animation finishes.
 *
 * On close, `state` flips to `'closed'` so the stylesheet can start an exit animation, and `present` stays true
 * until that animation ends. When no animation applies (reduced motion collapses durations to 0ms, or the
 * environment computes no styles, as in jsdom), the element unmounts right away.
 *
 * @param open - Whether the element is logically open.
 * @param onExitComplete - Called once the element has unmounted after closing.
 */
export function usePresence(open: boolean, onExitComplete?: () => void): Presence {
  const [present, setPresent] = useState(open);
  const nodeRef = useRef<HTMLElement | null>(null);
  const exitRef = useRef(onExitComplete);
  exitRef.current = onExitComplete;

  // Mount in the same render that opens, so the enter animation starts on the first paint.
  if (open && !present) setPresent(true);

  useIsomorphicLayoutEffect(() => {
    if (open || !present) return undefined;
    const node = nodeRef.current;
    const finish = (): void => {
      setPresent(false);
      exitRef.current?.();
    };
    if (!node || typeof window.getComputedStyle !== 'function') {
      finish();
      return undefined;
    }
    const style = window.getComputedStyle(node);
    const seconds = Math.max(...(style.animationDuration || '0s').split(',').map((d) => parseFloat(d) || 0));
    if (!style.animationName || style.animationName === 'none' || seconds === 0) {
      finish();
      return undefined;
    }
    const onEnd = (event: AnimationEvent): void => {
      if (event.target === node) finish();
    };
    node.addEventListener('animationend', onEnd);
    // Fallback in case animationend never fires (element hidden, tab in the background).
    const timer = window.setTimeout(finish, seconds * 1000 + 100);
    return () => {
      node.removeEventListener('animationend', onEnd);
      window.clearTimeout(timer);
    };
  }, [open, present]);

  const ref = useCallback((node: HTMLElement | null) => {
    nodeRef.current = node;
  }, []);

  return { present, state: open ? 'open' : 'closed', ref };
}
