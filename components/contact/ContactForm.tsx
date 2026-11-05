'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    if (formData.get('company')) {
      setStatus('sent');
      return;
    }

    const from = String(formData.get('from') ?? '').trim();
    const subject = String(formData.get('subject') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    if (!from || !subject || !message) {
      setStatus('error');
      setErrorMsg('Missing fields.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from)) {
      setStatus('error');
      setErrorMsg('Invalid email.');
      return;
    }
    if (message.length > 5000) {
      setStatus('error');
      setErrorMsg('Message too long.');
      return;
    }

    const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setStatus('error');
      setErrorMsg('Form not configured.');
      return;
    }

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(15000) : undefined,
        body: JSON.stringify({
          access_key: accessKey,
          subject: `[linelulan.dev] ${subject}`,
          email: from,
          from_name: 'linelulan.dev',
          replyto: from,
          message,
          botcheck: '',
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
      };
      if (!res.ok || !data.success) {
        throw new Error(data.message ?? `Request failed (${res.status})`);
      }
      setStatus('sent');
      trackEvent('contact_form_submit', { ok: true });
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setStatus('error');
      setErrorMsg(errMsg);
      trackEvent('contact_form_submit', { ok: false });
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="self-start bg-panel hairline border rounded-[var(--theme-radius)] p-5 text-base text-ink">
        Sent. Expect a reply within 24 hours.
      </div>
    );
  }

  return (
    <div className="min-w-0 self-start bg-panel hairline border rounded-[var(--theme-radius)] p-6">
      <form
        onSubmit={onSubmit}
        className="space-y-5"
        suppressHydrationWarning
      >
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
          suppressHydrationWarning
        />
        <Field label="From" name="from" type="email" placeholder="you@example.com" required />
        <Field label="Subject" name="subject" placeholder="What is this about?" required />
        <Textarea label="Message" name="message" placeholder="Say hi…" required />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex min-h-11 items-center gap-2 rounded-[var(--theme-control-radius)] bg-accent px-4 font-mono text-sm text-on-accent hover:bg-accent-hover disabled:opacity-60"
        >
          <Send size={16} aria-hidden />
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {status === 'error' && (
          <p role="alert" className="text-base text-accent">
            &gt; Connection failed{errorMsg ? ` — ${errorMsg}` : ''} · Try email directly
          </p>
        )}
      </form>
    </div>
  );
}

const inputClass =
  'mt-2 min-h-11 w-full bg-paper hairline border rounded-[var(--theme-control-radius)] px-3 py-2 text-base text-ink placeholder:text-muted focus:border-accent';

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className={inputClass}
        suppressHydrationWarning
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={5}
        className={`${inputClass} resize-y`}
        suppressHydrationWarning
      />
    </label>
  );
}
