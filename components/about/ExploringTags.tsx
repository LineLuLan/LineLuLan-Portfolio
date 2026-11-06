// Intent: keep exploration tags beside the narrative within the slide budget.
// Status: implemented. Next: viewport probe. Blockers: browser unavailable. Confidence: wrapping layout.
import type { CSSProperties } from 'react';

export function ExploringTags({ tags }: { tags: string[] }) {
  return (
    <div data-reveal className="mt-6 [--reveal-delay:100ms]">
      <p className="eyebrow mb-2">Currently exploring</p>
      <ul className="flex flex-wrap gap-1.5">
        {tags.map((tag, index) => (
          <li
            key={tag}
            data-reveal-child
            style={{ '--reveal-order': index } as CSSProperties}
            className="inline-flex min-h-8 items-center rounded-[var(--theme-control-radius)] border hairline px-2.5 font-sans text-sm text-ink hover:border-accent hover:text-accent"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}
