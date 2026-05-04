'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
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
    const payload = {
      from: String(formData.get('from') ?? ''),
      subject: String(formData.get('subject') ?? ''),
      message: String(formData.get('message') ?? ''),
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setStatus('sent');
      trackEvent('contact_form_submit', { ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'unknown error';
      setStatus('error');
      setErrorMsg(message);
      trackEvent('contact_form_submit', { ok: false });
    }
  }

  if (status === 'sent') {
    return (
      <GlassCard className="border-success/40 p-5">
        <p className="font-mono text-xs text-success">
          &gt; packet transmitted · expect response in &lt; 24h
        </p>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-accent-pink">$ send_packet</p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3 font-mono text-xs">
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden
        />
        <Field label="from" name="from" type="email" placeholder="your_email" required />
        <Field label="subject" name="subject" placeholder="what's this about" required />
        <Textarea label="message" name="message" placeholder="say hi..." required />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-flex items-center gap-2 rounded-sm border border-accent-pink/70 bg-accent-pink/10 px-3.5 py-2 text-accent-pink transition-colors hover:bg-accent-pink hover:text-void disabled:opacity-60"
        >
          <Send size={12} aria-hidden />
          {status === 'sending' ? 'transmitting...' : '▶ transmit'}
        </button>
        {status === 'error' && (
          <p className="text-[11px] text-accent-magenta">
            &gt; connection failed{errorMsg ? ` — ${errorMsg}` : ''} · try email directly
          </p>
        )}
      </form>
    </GlassCard>
  );
}

const inputClass =
  'mt-1 w-full rounded-sm border border-border-subtle bg-midnight px-3 py-2 text-text-primary placeholder:text-text-tertiary focus:border-accent-pink focus:outline-none';

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
      <span className="block text-text-tertiary">&gt; {label}:</span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className={inputClass}
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
      <span className="block text-text-tertiary">&gt; {label}:</span>
      <textarea
        name={name}
        required={required}
        placeholder={placeholder}
        rows={4}
        className={`${inputClass} resize-y`}
      />
    </label>
  );
}
