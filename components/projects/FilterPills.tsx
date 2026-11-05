'use client';

import { projectFilters, type ProjectFilter } from '@/content/projects';
import { cn } from '@/lib/cn';

type Props = {
  active: ProjectFilter;
  onChange: (next: ProjectFilter) => void;
};

export function FilterPills({ active, onChange }: Props) {
  return (
    <div aria-label="Filter projects" className="flex flex-wrap gap-2">
      {projectFilters.map((f) => {
        const isActive = active === f;
        return (
          <button
            key={f}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(f)}
            className={cn(
              'inline-flex min-h-11 items-center rounded-[var(--theme-control-radius)] border px-3 font-mono text-sm transition-colors',
              isActive
                ? 'border-accent bg-accent text-on-accent'
                : 'hairline text-ink hover:border-accent hover:text-accent',
            )}
          >
            {f}
          </button>
        );
      })}
    </div>
  );
}
