'use client';

import { projectFilters, type ProjectFilter } from '@/content/projects';
import { cn } from '@/lib/cn';

type Props = {
  active: ProjectFilter;
  onChange: (next: ProjectFilter) => void;
};

export function FilterPills({ active, onChange }: Props) {
  return (
    <div role="tablist" aria-label="Filter projects" className="flex flex-wrap gap-1.5 font-mono text-[11px]">
      {projectFilters.map((f) => {
        const isActive = active === f;
        return (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(f)}
            className={cn(
              'rounded-sm border px-2.5 py-1 transition-colors',
              isActive
                ? 'border-accent-magenta bg-accent-magenta/15 text-accent-pink'
                : 'border-border-subtle text-text-secondary hover:border-accent-pink hover:text-accent-pink',
            )}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}
