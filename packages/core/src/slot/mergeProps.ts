/**
 * Determines whether a prop key is a React event handler.
 * Event handlers start with "on" followed by an uppercase letter.
 */
function isEventHandler(key: string): boolean {
  return /^on[A-Z]/.test(key);
}

/**
 * Merges slot props onto child props.
 *
 * Rules:
 * - Event handlers: compose — both slot and child handlers are called (slot first).
 * - className: concatenate with a space separator.
 * - style: merge objects — child values override slot values.
 * - All other props: child value overrides slot value.
 *
 * @param slotProps - Props from the Slot component (defaults / additions).
 * @param childProps - Props from the child element being slotted into.
 * @returns Merged props object ready to spread onto the cloned child element.
 */
export function mergeProps(
  slotProps: Record<string, unknown>,
  childProps: Record<string, unknown>,
): Record<string, unknown> {
  const merged: Record<string, unknown> = { ...slotProps };

  for (const key of Object.keys(childProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (isEventHandler(key)) {
      if (typeof slotValue === 'function' && typeof childValue === 'function') {
        // Compose: call slot handler first, then child handler.
        merged[key] = (...args: unknown[]) => {
          (slotValue as (...a: unknown[]) => unknown)(...args);
          (childValue as (...a: unknown[]) => unknown)(...args);
        };
      } else {
        merged[key] = childValue ?? slotValue;
      }
    } else if (key === 'className') {
      const slotClass = typeof slotValue === 'string' ? slotValue : undefined;
      const childClass = typeof childValue === 'string' ? childValue : undefined;
      merged[key] = [slotClass, childClass].filter(Boolean).join(' ') || undefined;
    } else if (key === 'style') {
      merged[key] =
        slotValue !== null &&
        typeof slotValue === 'object' &&
        childValue !== null &&
        typeof childValue === 'object'
          ? { ...slotValue, ...childValue }
          : childValue ?? slotValue;
    } else {
      merged[key] = childValue;
    }
  }

  return merged;
}
