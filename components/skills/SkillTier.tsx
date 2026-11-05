// Intent: pair official or original marks with accessible tool names in both modes.
// Status: implemented. Next: browser acceptance. Blockers: none. Confidence: source marks and precomputed contrast.
import type { CSSProperties } from 'react';
import { getStackIcon } from '@/lib/stack-icons';
import type { SkillTier as SkillTierType } from '@/types';

export function SkillTier({ tier, index }: { tier: SkillTierType; index: number }) {
  return (
    <section data-reveal style={{ '--reveal-delay': `${index * 50}ms` } as CSSProperties} aria-labelledby={`stack-${tier.id}`} className="min-w-0 rounded-[var(--theme-radius)] border hairline bg-panel p-5">
      <h3 id={`stack-${tier.id}`} className="font-display text-[18px] font-bold text-ink">{tier.label}</h3>
      <p className="mt-1 text-[14px] text-muted">{tier.caption}</p>
      <ul className="mt-3 flex flex-wrap gap-1.5">
        {tier.items.map((item) => {
          const icon = getStackIcon(item.name, item.icon);
          return (
            <li key={item.name} className="stack-tool inline-flex min-h-9 max-w-full items-center gap-2 rounded border hairline bg-paper px-2 font-sans text-[14px] text-ink hover:border-accent">
              {icon && (
                <svg width="18" height="18" viewBox={icon.viewBox} aria-hidden="true" className="shrink-0" focusable="false">
                  {icon.paths.map((path, pathIndex) => (
                    <path key={pathIndex} d={path.d} fill={path.fill} fillRule={path.fillRule} className="stack-icon-path" style={{
                      '--icon-light': path.inkOnLight ? 'currentColor' : path.fill,
                      '--icon-dark': path.inkOnDark ? 'currentColor' : path.fill,
                    } as CSSProperties} />
                  ))}
                </svg>
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
