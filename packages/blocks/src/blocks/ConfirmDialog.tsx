import React, { useState } from 'react';
import { Button, Dialog } from '@vhyxui/react';

/** Props for ConfirmDialog. */
export interface ConfirmDialogProps {
  /** Element that opens the dialog (usually a Button). */
  trigger?: React.ReactElement;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** @default 'Confirm' */
  confirmLabel?: React.ReactNode;
  /** @default 'Cancel' */
  cancelLabel?: React.ReactNode;
  /** Red confirm button and destructive VhyxSeal contract. */
  destructive?: boolean;
  /** May return a promise — the confirm button shows a spinner until it settles. */
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  /** Controlled open state. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * ConfirmDialog — the "are you sure?" pattern in one component.
 * Agents see `requiresConfirmation: true` on the confirm button via VhyxSeal.
 *
 * @example
 * <ConfirmDialog destructive title="Delete project?" description="This cannot be undone."
 *   trigger={<Button variant="destructive">Delete</Button>} onConfirm={deleteProject} />
 */
export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
  open,
  onOpenChange,
}: ConfirmDialogProps): React.ReactElement {
  const [internalOpen, setInternalOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const isOpen = open ?? internalOpen;
  const setOpen = (next: boolean): void => {
    if (open === undefined) setInternalOpen(next);
    onOpenChange?.(next);
  };

  const confirm = async (): Promise<void> => {
    setBusy(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen} size="sm">
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>{title}</Dialog.Title>
          {description && <Dialog.Description>{description}</Dialog.Description>}
        </Dialog.Header>
        <Dialog.Footer>
          <Button
            variant="ghost"
            onClick={() => {
              onCancel?.();
              setOpen(false);
            }}
            disabled={busy}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? 'destructive' : 'primary'}
            loading={busy}
            onClick={() => void confirm()}
            contract={{ intent: destructive ? 'delete-item' : 'confirm-action', requiresConfirmation: true }}
          >
            {confirmLabel}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
