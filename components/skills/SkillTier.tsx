// Intent: pair recognizable logos with accessible tool names, using monograms for missing brands.
// Status: R2. Next: visual review. Blockers: none. Confidence: typed icon keys and shared contrast helper.
import type { CSSProperties } from 'react';
import { stackIcons, stackIconColor } from '@/lib/stack-icons';
import type { SkillTier as SkillTierType } from '@/types';

const MONOGRAMS: Record<string, string> = {
  SQL: 'SQ', XGBoost: 'XG', LightGBM: 'LG', PyMC: 'Py', OpenAI: 'OA', Groq: 'G', Cerebras: 'C',
};

export function SkillTier({ tier, index }: { tier: SkillTierType; index: number }) {
  return (
    <section data-reveal style={{ '--reveal-delay': `${index * 50}ms` } as CSSProperties} aria-labelledby={`stack-${tier.id}`} className="min-w-0 rounded-[var(--theme-radius)] border hairline bg-panel p-5">
      <h3 id={`stack-${tier.id}`} className="font-display text-[18px] font-bold text-ink">{tier.label}</h3>
      <p className="mt-1 text-[14px] text-muted">{tier.caption}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {tier.items.map((item) => {
          const icon = item.icon ? stackIcons[item.icon] : undefined;
          return (
            <li key={item.name} className="stack-tool inline-flex min-h-9 max-w-full items-center gap-2 rounded border hairline bg-paper px-2 font-sans text-[14px] text-ink hover:border-accent">
              {icon ? (
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="shrink-0" fill={stackIconColor(icon.hex)}>
                  <path d={icon.path} />
                </svg>
              ) : (
                <span aria-hidden className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded bg-tint-a font-mono text-[10px] font-bold text-accent">{MONOGRAMS[item.name] ?? item.name.slice(0, 2)}</span>
              )}
              <span>{item.name}</span>
            </li>
          );
        })}
      </ul>
      {tier.practices && (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {tier.practices.map((practice) => <li key={practice} className="rounded bg-tint-c px-2 py-1 font-sans text-[13px] text-ink">{practice}</li>)}
        </ul>
      )}
    </section>
  );
}
