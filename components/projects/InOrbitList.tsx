import type { Project } from '@/types';

export function InOrbitList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  return (
    <div className="mt-8">
      <p className="eyebrow mb-3">in orbit</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-muted">
        {projects.map((project) => (
          <li key={project.slug}>{project.codename} · {project.name}</li>
        ))}
      </ul>
    </div>
  );
}
