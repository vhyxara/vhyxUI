'use client';

import { CheckIcon, ClipboardIcon } from '@vhyxui/icons';
import React, { useState } from 'react';

interface CopyButtonProps {
  code: string;
}

export function CopyButton({ code }: CopyButtonProps): React.ReactElement {
  const [copied, setCopied] = useState<boolean>(false);

  async function copy(): Promise<void> {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className="cb-copy"
      onClick={copy}
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? <CheckIcon size={14} /> : <ClipboardIcon size={14} />}
    </button>
  );
}
