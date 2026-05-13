import type { SkillTier as SkillTierType } from '@/types';

export function SkillTier({ tier }: { tier: SkillTierType }) {
  return (
    <section aria-labelledby={`stack-${tier.id}`}>
      <header className="mb-4 flex items-baseline justify-between gap-3 border-b border-rule-subtle pb-2">
        <h3
          id={`stack-${tier.id}`}
          className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent-pink"
        >
          {tier.label}
        </h3>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-tertiary">
          {tier.caption}
        </span>
      </header>
      <dl className="divide-y divide-rule-subtle">
        {tier.rows.map((row) => (
          <div
            key={row.category + row.items.join(',')}
            className="grid grid-cols-1 gap-3 py-3 md:grid-cols-[160px_1fr] md:items-baseline"
          >
            <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-tertiary">
              {row.category}
            </dt>
            <dd className="flex flex-wrap gap-1.5">
              {row.items.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center rounded-sm border border-border-subtle px-2 py-0.5 font-mono text-[11px] text-text-secondary transition-colors hover:border-accent-pink hover:text-accent-pink"
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
