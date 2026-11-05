export function ExploringTags({ tags }: { tags: string[] }) {
  return (
    <div className="mt-10">
      <p className="eyebrow mb-3">currently exploring</p>
      <ul className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li
            key={tag}
            className="inline-flex min-h-9 items-center rounded-[var(--theme-control-radius)] border hairline px-3 font-mono text-sm text-ink hover:border-accent hover:text-accent"
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
}
