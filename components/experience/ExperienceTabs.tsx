'use client';

// Intent: make grouped roles discoverable and align their section after tab clicks.
// Status: shared alignment in use. Next: viewport acceptance. Blockers: none. Confidence: ARIA tab pattern and shared geometry.
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import Image from 'next/image';
import { SiteIcon } from '@/components/ui/SiteIcon';
import { alignSection } from '@/lib/scroll-to-section';
import type { ExperienceOrg } from '@/types';
import { orgDuration, roleDateRange, roleDuration } from './experience-dates';
import { ExperienceHighlight } from './ExperienceHighlight';
import './experience.css';

export function ExperienceTabs({ orgs, today, header }: { orgs: ExperienceOrg[]; today: string; header: ReactNode }) {
  const [selected, setSelected] = useState(0);
  const [vertical, setVertical] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(today);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const panels = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const panel = panels.current[selected];
    if (!panel) return;
    panel.scrollTop = 0;
    const syncEdges = () => {
      panel.dataset.scrollTop = String(panel.scrollTop > 1);
      panel.dataset.scrollBottom = String(panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1);
    };
    syncEdges();
    const observer = new ResizeObserver(syncEdges);
    observer.observe(panel);
    if (panel.firstElementChild) observer.observe(panel.firstElementChild);
    panel.addEventListener('scroll', syncEdges, { passive: true });
    return () => { observer.disconnect(); panel.removeEventListener('scroll', syncEdges); };
  }, [selected]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const sync = () => setVertical(query.matches);
    sync();
    query.addEventListener('change', sync);
    // A statically generated page still counts Present against the visitor's current month.
    const now = new Date();
    setCurrentMonth(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
    return () => query.removeEventListener('change', sync);
  }, []);

  function navigate(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const nextKey = vertical ? 'ArrowDown' : 'ArrowRight';
    const previousKey = vertical ? 'ArrowUp' : 'ArrowLeft';
    let next: number;
    if (event.key === nextKey) next = (index + 1) % orgs.length;
    else if (event.key === previousKey) next = (index - 1 + orgs.length) % orgs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = orgs.length - 1;
    else return;
    event.preventDefault();
    setSelected(next);
    tabs.current[next]?.focus({ preventScroll: true });
    tabs.current[next]?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  }

  return (
    <div className="experience-layout">
      <div className="experience-directory">
      {header}
      <div role="tablist" aria-label="Organizations" aria-orientation={vertical ? 'vertical' : 'horizontal'} className="experience-tabs">
        {orgs.map((org, index) => (
          <button key={org.id} type="button" role="tab" id={`experience-tab-${org.id}`}
            aria-controls={`experience-panel-${org.id}`} aria-selected={selected === index} tabIndex={selected === index ? 0 : -1}
            ref={(element) => { tabs.current[index] = element; }}
            onClick={(event) => {
              setSelected(index);
              const section = event.currentTarget.closest<HTMLElement>('section[id]');
              if (section) alignSection(section);
            }} onKeyDown={(event) => navigate(event, index)} className="experience-tab">
            <span className="experience-monogram" data-logo={org.logo ? "true" : undefined} aria-hidden="true">
              {org.logo ? <Image src={org.logo} alt="" width={40} height={40} className="experience-logo" /> : org.url ? <SiteIcon href={org.url} size={22} /> : org.initials ?? org.org.split(/\s+/).slice(0, 2).map((word) => word[0]).join('')}
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-ink">{org.org}</span>
              <span className="mt-1 block text-sm text-muted">{org.roles[0]?.title} · {orgDuration(org.roles, currentMonth)}</span>
            </span>
          </button>
        ))}
      </div>
      </div>
      <div className="experience-panels">
        {orgs.map((org, index) => {
          const firstPhotoHighlight = [...(org.highlights ?? []), ...org.roles.flatMap((role) => role.highlights ?? [])].find((highlight) => highlight.photos?.length);
          return (
          <section key={org.id} role="tabpanel" id={`experience-panel-${org.id}`} aria-labelledby={`experience-tab-${org.id}`}
            aria-label={`${org.org} experience, scroll for more`} ref={(element) => { panels.current[index] = element; }}
            hidden={selected !== index} tabIndex={0} className="experience-panel">
            <div className="experience-panel-content">
            <h3 className="mb-5 font-display text-xl font-bold text-ink">
              {org.url ? <a href={org.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 text-accent hover:underline">
                {org.org}<SiteIcon href={org.url} size={20} /><span className="sr-only"> (opens in new tab)</span>
              </a> : org.org}
            </h3>
            {org.summary && <p className="experience-summary">{org.summary}</p>}
            {org.highlights?.map((highlight) => <ExperienceHighlight key={highlight.title} highlight={highlight}
              eager={selected === index && highlight === firstPhotoHighlight} />)}
            <ol className="experience-roles">
              {org.roles.map((role) => (
                <li key={`${role.title}-${role.start}`} className="experience-role">
                  <h4 className="font-display text-[1.25rem] font-bold leading-snug text-ink">{role.title}</h4>
                  <p className="mt-1 text-sm text-muted">{[role.type, roleDateRange(role), roleDuration(role, currentMonth)].filter(Boolean).join(' · ')}</p>
                  {role.location && <p className="mt-1 text-sm text-muted">{role.location}</p>}
                  {role.bullets && <ul className="mt-3 list-disc space-y-1 pl-5 text-base text-ink">
                    {role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>}
                  {role.highlights?.map((highlight) => <ExperienceHighlight key={highlight.title} highlight={highlight} role
                    eager={selected === index && highlight === firstPhotoHighlight} />)}
                  {role.skills && <ul aria-label="Skills" className="mt-4 flex flex-wrap gap-2">
                    {role.skills.map((skill) => <li key={skill} className="rounded-[var(--theme-control-radius)] border hairline bg-tint-a px-2 py-1 text-sm text-ink">{skill}</li>)}
                  </ul>}
                </li>
              ))}
            </ol>
            </div>
          </section>
        ); })}
      </div>
    </div>
  );
}
