'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import type { ComponentContract } from '@vhyxui/core';
import { tooltipContract } from '@vhyxui/core';
import { withAgentContract } from '@vhyxseal/react';
import { useId } from '../shared/useId';
import styles from './Tooltip.module.css';

/** Props for the Tooltip component. */
export interface TooltipProps {
  /** The tooltip content (typically a short text label). */
  content: React.ReactNode;
  /** Side to show the tooltip relative to the trigger. @default 'top' */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Alignment along the cross-axis. @default 'center' */
  align?: 'start' | 'center' | 'end';
  /**
   * Delay in ms before the tooltip appears on hover.
   * @default 400
   */
  delayDuration?: number;
  /**
   * How long the tooltip remains visible after mouse leaves one trigger
   * before showing on the next trigger without the full delay.
   * @default 300
   */
  skipDelayDuration?: number;
  /**
   * The single interactive child element. The tooltip is triggered by this element.
   * Must be a React element that can receive ref, onMouseEnter, onMouseLeave,
   * onFocus, onBlur, and aria-describedby props.
   */
  children: React.ReactElement;
}

/**
 * Tooltip — shows supplementary information on hover or focus.
 *
 * Wraps the trigger element directly via cloneElement — no Trigger sub-component.
 * role="tooltip" on the tooltip element.
 * Trigger gets aria-describedby pointing to the tooltip.
 * Shows after delayDuration ms. Hides on mouse leave, blur, or Escape.
 *
 * @example
 * <Tooltip content="Delete this item">
 *   <Button iconOnly aria-label="Delete"><TrashIcon /></Button>
 * </Tooltip>
 */
function TooltipBase({
  content,
  side = 'top',
  align = 'center',
  delayDuration = 400,
  skipDelayDuration = 300,
  children,
}: TooltipProps): React.ReactElement {
  const tooltipId = useId('vhyx-tooltip');
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLElement | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const GAP = 6;

    let top = 0;
    let left = 0;

    if (side === 'top') {
      top = rect.top - GAP;
      left = rect.left + rect.width / 2;
    } else if (side === 'bottom') {
      top = rect.bottom + GAP;
      left = rect.left + rect.width / 2;
    } else if (side === 'right') {
      top = rect.top + rect.height / 2;
      left = rect.right + GAP;
    } else {
      top = rect.top + rect.height / 2;
      left = rect.left - GAP;
    }

    setPosition({ top, left });
  }, [side]);

  const show = useCallback(() => {
    clearTimers();
    showTimerRef.current = setTimeout(() => {
      updatePosition();
      setVisible(true);
    }, delayDuration);
  }, [clearTimers, delayDuration, updatePosition]);

  const hide = useCallback(
    (delay = 0) => {
      clearTimers();
      if (delay > 0) {
        hideTimerRef.current = setTimeout(() => setVisible(false), delay);
      } else {
        setVisible(false);
      }
    },
    [clearTimers],
  );

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    function onKey(e: KeyboardEvent): void {
      if (e.key === 'Escape') hide(0);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible, hide]);

  // Merge tooltip trigger props onto the child element
  const clonedChild = React.cloneElement(
    children as React.ReactElement<Record<string, unknown>>,
    {
      ref: useCallback(
        (node: HTMLElement | null) => {
          triggerRef.current = node;
          const existingRef = (children as React.ReactElement & { ref?: React.Ref<unknown> }).ref;
          if (typeof existingRef === 'function') existingRef(node);
          else if (existingRef && typeof existingRef === 'object') {
            (existingRef as React.MutableRefObject<HTMLElement | null>).current = node;
          }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
      ),
      'aria-describedby': visible ? tooltipId : undefined,
      onMouseEnter: (e: React.MouseEvent) => {
        const childOnMouseEnter = (children.props as Record<string, unknown>)['onMouseEnter'];
        if (typeof childOnMouseEnter === 'function') (childOnMouseEnter as (e: React.MouseEvent) => void)(e);
        show();
      },
      onMouseLeave: (e: React.MouseEvent) => {
        const childOnMouseLeave = (children.props as Record<string, unknown>)['onMouseLeave'];
        if (typeof childOnMouseLeave === 'function') (childOnMouseLeave as (e: React.MouseEvent) => void)(e);
        hide(skipDelayDuration);
      },
      onFocus: (e: React.FocusEvent) => {
        const childOnFocus = (children.props as Record<string, unknown>)['onFocus'];
        if (typeof childOnFocus === 'function') (childOnFocus as (e: React.FocusEvent) => void)(e);
        updatePosition();
        setVisible(true);
      },
      onBlur: (e: React.FocusEvent) => {
        const childOnBlur = (children.props as Record<string, unknown>)['onBlur'];
        if (typeof childOnBlur === 'function') (childOnBlur as (e: React.FocusEvent) => void)(e);
        hide(0);
      },
    } as Record<string, unknown>,
  );

  const tooltipPortal = visible
    ? ReactDOM.createPortal(
        <div
          id={tooltipId}
          role="tooltip"
          className={styles['tooltip']}
          data-side={side}
          data-align={align}
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            zIndex: 550, // --vhyx-z-tooltip
            transform: side === 'top' || side === 'bottom' ? 'translateX(-50%)' : 'translateY(-50%)',
          }}
        >
          {content}
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      {clonedChild}
      {tooltipPortal}
    </>
  );
}

TooltipBase.displayName = 'VhyxTooltip';

// Library-level contract for SealContext registration.
const tooltipSealContract = { ...tooltipContract, id: 'vhyxui-tooltip' } as Readonly<ComponentContract>;

export const Tooltip = withAgentContract(TooltipBase, tooltipSealContract);
Tooltip.displayName = 'VhyxTooltip';
