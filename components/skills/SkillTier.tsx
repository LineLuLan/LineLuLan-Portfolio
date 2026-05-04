import { GlassCard } from '@/components/ui/GlassCard';
import type { SkillTier as SkillTierType } from '@/types';

export function SkillTier({ tier }: { tier: SkillTierType }) {
  return (
    <GlassCard interactive className="h-full p-5 font-mono">
      <header className="mb-4 flex items-baseline justify-between gap-3 border-b border-border-subtle pb-3">
        <p className="text-xs uppercase tracking-widest text-accent-purple">
          {tier.label}
        </p>
        <span className="text-[10px] uppercase tracking-widest text-text-tertiary">
          {tier.caption}
        </span>
      </header>
      <dl className="grid gap-1.5 text-xs">
        {tier.rows.map((row) => (
          <div
            key={row.category + row.items.join(',')}
            className="grid grid-cols-[80px_1fr] gap-3"
          >
            <dt className="text-text-tertiary">{row.category}</dt>
            <dd className="text-text-secondary">
              {row.items.map((item, i) => (
                <span key={item}>
                  <span className="text-text-primary">{item}</span>
                  {i < row.items.length - 1 && (
                    <span className="text-text-tertiary"> · </span>
                  )}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </GlassCard>
  );
}
