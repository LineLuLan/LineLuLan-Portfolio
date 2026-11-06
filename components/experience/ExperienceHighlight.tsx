// Intent: keep Line's photo story copy semantic and present in server HTML.
// Status: implemented. Next: content/viewport acceptance. Blockers: none. Confidence: typed content.
import type { ExperienceHighlight as Highlight } from '@/types';
import Link from 'next/link';
import { roleDateRange } from './experience-dates';
import PhotoGallery from './Lightbox';

export function ExperienceHighlight({ highlight, eager = false, role = false }: {
  highlight: Highlight; eager?: boolean; role?: boolean;
}) {
  const Heading = role ? 'h5' : 'h4';
  const award = /Winner|Place/.test(highlight.title);
  return (
    <article className="experience-highlight">
      <p className="experience-highlight-eyebrow">
        {award && <span className="experience-award-dot" aria-hidden="true" />}
        {award ? 'Award' : 'Highlight'}
      </p>
      <Heading className="experience-highlight-title">{highlight.title}</Heading>
      {highlight.date && <time className="experience-highlight-date" dateTime={highlight.date}>
        {roleDateRange({ title: highlight.title, start: highlight.date, end: highlight.date })}
      </time>}
      {highlight.body && <p className="experience-highlight-body">{highlight.body}</p>}
      {highlight.link && <Link href={highlight.link.href} className="experience-highlight-link">
        {highlight.link.label}<span aria-hidden="true">&rarr;</span>
      </Link>}
      {highlight.photos && <PhotoGallery photos={highlight.photos} title={highlight.title} eager={eager} />}
    </article>
  );
}
