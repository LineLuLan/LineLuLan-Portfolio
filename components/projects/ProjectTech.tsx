// Intent: share theme-aware stack marks between Line's cards and project stories.
// Status: implemented. Next: extend only for named tools. Blockers: none. Confidence: shared icon lookup.
import type { CSSProperties } from 'react';
import { getStackIcon, stackIcons, type StackIconKey } from '@/lib/stack-icons';

const aliases: Record<string, StackIconKey> = {
  nextjs: 'nextdotjs', drizzleorm: 'drizzle', gemini: 'googlegemini',
};

export function ProjectTech({ tech }: { tech: string[] }) {
  return (
    <ul aria-label="Technology stack" className="flex flex-wrap gap-1.5">
      {tech.map((name) => {
        const normalized = name.toLowerCase().replace(/\s+v?\d.*$/, '').replace(/[^a-z]/g, '');
        const key = aliases[normalized] ?? (Object.hasOwn(stackIcons, normalized) ? normalized as StackIconKey : undefined);
        const icon = getStackIcon(name, key);
        return (
          <li key={name} className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-[var(--theme-control-radius)] border hairline bg-paper px-2 text-sm text-ink">
            {icon && (
              <svg width="18" height="18" viewBox={icon.viewBox} aria-hidden="true" focusable="false" className="shrink-0">
                {icon.paths.map((path, index) => (
                  <path key={index} d={path.d} fill={path.fill} fillRule={path.fillRule} className="stack-icon-path" style={{
                    '--icon-light': path.inkOnLight ? 'currentColor' : path.fill,
                    '--icon-dark': path.inkOnDark ? 'currentColor' : path.fill,
                  } as CSSProperties} />
                ))}
              </svg>
            )}
            <span className="break-words">{name}</span>
          </li>
        );
      })}
    </ul>
  );
}
