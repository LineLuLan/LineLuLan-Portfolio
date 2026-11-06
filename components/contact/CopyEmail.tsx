'use client';

// Intent: copy Line's address with honest feedback and a selectable fallback.
// Status: implemented. Next: browser clipboard checks. Blockers: none. Confidence: explicit failure handling.
import { useEffect, useRef, useState } from 'react';

export function CopyEmail({ email }: { email: string }) {
  const address = useRef<HTMLAnchorElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const [status, setStatus] = useState('');
  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    clearTimeout(timer.current);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(email);
      setStatus('Copied');
      timer.current = setTimeout(() => setStatus(''), 2000);
    } catch {
      const selection = window.getSelection();
      if (address.current && selection) {
        address.current.focus();
        const range = document.createRange();
        range.selectNodeContents(address.current);
        selection.removeAllRanges();
        selection.addRange(range);
        setStatus('Email selected. Copy with your device’s copy command.');
      } else {
        setStatus('Select the email address to copy it.');
      }
    }
  }

  return (
    <div className="mt-5 rounded-[var(--theme-radius)] border hairline bg-panel p-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <a ref={address} href={`mailto:${email}`} className="min-w-0 flex-1 break-all font-display text-[24px] leading-8 text-ink hover:text-accent">{email}</a>
        <button type="button" onClick={copy} className="motion-control inline-flex min-h-11 min-w-[72px] items-center justify-center rounded-[var(--theme-control-radius)] border hairline px-3 font-mono text-xs text-ink hover:border-accent hover:text-accent">{status === 'Copied' ? 'Copied' : 'Copy'}</button>
      </div>
      <p role="status" aria-live="polite" className={status && status !== 'Copied' ? 'mt-2 text-xs text-muted' : 'sr-only'}>{status}</p>
    </div>
  );
}
