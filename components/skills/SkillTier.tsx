import type { SkillTier as SkillTierType } from '@/types';

export function SkillTier({ tier }: { tier: SkillTierType }) {
  return (
    <section aria-labelledby={`stack-${tier.id}`}>
      <h3 id={`stack-${tier.id}`} className="eyebrow mb-4 flex-wrap">
        {tier.label}
        <span className="text-muted">· {tier.caption}</span>
      </h3>
      <dl>
        {tier.rows.map((row) => (
          <div
            key={row.category + row.items.join(',')}
            className="grid gap-3 border-t hairline py-3 md:grid-cols-[160px_1fr] md:items-baseline"
          >
            <dt className="font-mono text-sm text-muted">{row.category}</dt>
            <dd className="flex flex-wrap gap-2">
              {row.items.map((item) => (
                <span
                  key={item}
                  className="inline-flex min-h-9 items-center rounded-[var(--theme-control-radius)] border hairline px-3 font-mono text-sm text-ink hover:border-accent hover:text-accent"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
