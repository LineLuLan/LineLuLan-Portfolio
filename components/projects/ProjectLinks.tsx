// Intent: keep the same verified external actions on cards and story pages.
// Status: implemented. Next: periodic link checks. Blockers: none. Confidence: supplied link audit.
import { ArrowUpRight } from 'lucide-react';
import { SiteIcon } from '@/components/ui/SiteIcon';
import type { Project } from '@/types';

const actions = [['paper', 'Paper'], ['model', 'Hugging Face'], ['demo', 'Live demo'], ['github', 'GitHub'], ['video', 'Watch video']] as const;

export function ProjectLinks({ links }: { links: Project['links'] }) {
  if (!links) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map(([key, label]) => links[key] && (
        <a key={key} href={links[key]} target="_blank" rel="noopener noreferrer" draggable={false}
          className="inline-flex min-h-11 items-center gap-1 rounded-[var(--theme-control-radius)] border hairline bg-paper px-3 font-mono text-sm text-ink hover:border-accent hover:text-accent">
          <SiteIcon href={links[key]} /> {label} <ArrowUpRight size={16} aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
    </div>
  );
}
