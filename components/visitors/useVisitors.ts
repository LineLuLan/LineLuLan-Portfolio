'use client';

// Intent: share one visibility-aware heartbeat across every mounted visitor chip.
// Status: implemented. Next: none. Blockers: none. Confidence: bounded singleton lifecycle.
import { useSyncExternalStore } from 'react';
import { validVisitorId, type VisitorResponse } from '@/lib/visitors/core';

let snapshot: VisitorResponse | null = null;
let visitorId: string | undefined;
const listeners = new Set<() => void>();
let interval: ReturnType<typeof setInterval> | undefined;
let request: AbortController | undefined;

function getId(): string {
  if (visitorId) return visitorId;
  try {
    const stored = localStorage.getItem('line.visitor');
    if (validVisitorId(stored)) visitorId = stored;
  } catch { /* Storage can be blocked in private browsing. */ }
  if (!visitorId) {
    visitorId = crypto.randomUUID();
    try { localStorage.setItem('line.visitor', visitorId); } catch { /* Keep the session ID in memory. */ }
  }
  return visitorId;
}

function publish(value: VisitorResponse | null) {
  snapshot = value;
  listeners.forEach((listener) => listener());
}

async function heartbeat() {
  if (document.visibilityState !== 'visible' || request || !listeners.size) return;
  const controller = new AbortController();
  request = controller;
  const timeout = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch('/api/visitors', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: getId() }), cache: 'no-store', signal: controller.signal,
    });
    const data = await response.json();
    if (!response.ok || data.configured !== true) throw new Error('Visitor statistics unavailable');
    if (request === controller) publish(data as VisitorResponse);
  } catch {
    if (request === controller) publish(null);
  } finally {
    clearTimeout(timeout);
    if (request === controller) request = undefined;
  }
}

function visibilityChanged() {
  if (interval) clearInterval(interval);
  interval = undefined;
  if (document.visibilityState === 'visible') {
    void heartbeat();
    interval = setInterval(() => void heartbeat(), 45_000);
  } else {
    request?.abort();
    request = undefined;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    document.addEventListener('visibilitychange', visibilityChanged);
    visibilityChanged();
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size) {
      document.removeEventListener('visibilitychange', visibilityChanged);
      if (interval) clearInterval(interval);
      interval = undefined;
      request?.abort();
      request = undefined;
      snapshot = null;
    }
  };
}

const getSnapshot = () => snapshot;
const getServerSnapshot = () => null;
export function useVisitors() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
