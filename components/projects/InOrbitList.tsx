import type { Project } from '@/types';

// Intent: summarize classified slots as the sixth project card without inventing detail.
// Status: implemented. Next: viewport probe. Blockers: browser unavailable. Confidence: typed source inventory.
export function InOrbitList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <div className="h-full min-w-0 rounded-[var(--theme-radius)] border hairline bg-tint-b p-4">
      <p className="eyebrow">{projects.length} classified slots</p>
      <h3 className="mt-2 font-display text-[22px] font-bold leading-7 text-ink">In orbit</h3>
      <ul className="mt-3 space-y-2 font-mono text-[13px] leading-5 text-muted">
        {projects.map((project) => (
          <li key={project.slug} className="flex flex-wrap justify-between gap-x-2 [overflow-wrap:anywhere]">
            <span>{project.codename} · {project.name}</span>
            <span>ETA {project.eta}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
