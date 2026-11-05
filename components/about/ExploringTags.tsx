// Intent: keep exploration tags beside the narrative within the slide budget.
// Status: implemented. Next: viewport probe. Blockers: browser unavailable. Confidence: wrapping layout.
export function ExploringTags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-4">
      <p className="eyebrow mb-2">Currently exploring</p>
      <ul className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <li
            key={tag}
            className="inline-flex min-h-8 items-center rounded-[var(--theme-control-radius)] border hairline px-2.5 font-sans text-sm text-ink hover:border-accent hover:text-accent"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}
