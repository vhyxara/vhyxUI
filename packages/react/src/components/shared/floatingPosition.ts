/**
 * Shared viewport-edge clamping for floating elements (Popover.Content,
 * Select.Content) that anchor themselves to a trigger via `position: fixed`
 * and JS-computed coordinates. Neither component previously did any
 * viewport-boundary checking at all — a trigger near an edge (a header's
 * right-aligned avatar/notification bell, a dialog-centered Select with a
 * long option list) could render its floating content partially or entirely
 * off-screen, regardless of `align`/`side`.
 */

/** Minimum breathing room kept between a floating element and the viewport edge. */
export const VIEWPORT_EDGE_MARGIN = 8;

/**
 * Clamps a box's `start` coordinate along one axis so `[start, start + size]`
 * stays within `[margin, viewportSize - margin]`. When the box itself is
 * larger than the available viewport space, it's pinned to the near edge
 * (`margin`) rather than overflowing both sides — a box that can't fit is
 * still fully reachable by scrolling its own content, not clipped by layout.
 */
export function clampToViewport(
  start: number,
  size: number,
  viewportSize: number,
  margin: number = VIEWPORT_EDGE_MARGIN,
): number {
  const max = Math.max(margin, viewportSize - size - margin);
  return Math.min(Math.max(start, margin), max);
}

/**
 * Batches a high-frequency handler (scroll/resize) to run at most once per
 * animation frame instead of once per raw event. Native `scroll` events can
 * fire many times within a single frame (especially trackpad inertial
 * scrolling); recomputing and committing a React state update synchronously
 * on every one of them desyncs the floating element's position from the
 * compositor's own scroll-linked transform, reading as a jittery, lagging
 * box that visibly detaches from its trigger mid-scroll. Coalescing to one
 * recompute per frame keeps the reposition aligned with the browser's own
 * paint cycle.
 */
export function rafBatched(fn: () => void): { run: () => void; cancel: () => void } {
  let frame: number | null = null;
  const run = (): void => {
    if (frame !== null) return;
    frame = requestAnimationFrame(() => {
      frame = null;
      fn();
    });
  };
  const cancel = (): void => {
    if (frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
  };
  return { run, cancel };
}
