'use client';

import type { Project } from '@/types';

type Props = {
  projects: Project[];
  selectedSlug: string;
  onChange: (slug: string) => void;
};

export function ApplyDropdown({ projects, selectedSlug, onChange }: Props) {
  return (
    <label className="block min-w-0">
      <span className="eyebrow mb-3">Apply to a project</span>
      <select
        value={selectedSlug}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 w-full min-w-0 max-w-full bg-paper hairline border rounded-[var(--theme-control-radius)] px-3 font-mono text-sm text-ink focus:border-accent"
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
