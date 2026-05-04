'use client';

import type { Project } from '@/types';

type Props = {
  projects: Project[];
  selectedSlug: string;
  onChange: (slug: string) => void;
};

export function ApplyDropdown({ projects, selectedSlug, onChange }: Props) {
  return (
    <label className="inline-flex items-center gap-3 font-mono text-sm">
      <span className="text-text-tertiary">Applied to:</span>
      <select
        value={selectedSlug}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-border-subtle bg-card px-3 py-1 text-text-primary focus:border-accent-pink focus:outline-none"
      >
        {projects.map((p) => (
          <option key={p.slug} value={p.slug}>
            {p.name}
          </option>
        ))}
      </select>
    </label>
  );
}
