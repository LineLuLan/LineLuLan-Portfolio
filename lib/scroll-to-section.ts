// Intent: give section links and interactions one header-aware positioning rule.
// Status: interaction alignment added. Next: browser viewport checks. Blockers: none. Confidence: shared geometry.
export function sectionScrollTop(id: string, top: number, headerHeight: number) {
  if (id === 'hero') return 0;
  return Math.max(0, top - headerHeight);
}

export function alignSection(section: HTMLElement) {
  const headerHeight = document.querySelector('[data-site-header]')?.getBoundingClientRect().height ?? 0;
  const top = sectionScrollTop(section.id, section.getBoundingClientRect().top + window.scrollY, headerHeight);
  if (Math.abs(top - window.scrollY) < 2) return;
  window.scrollTo({ top, behavior: document.documentElement.dataset.motion === 'on' ? 'smooth' : 'instant' });
}

export function scrollToSection(section: HTMLElement) {
  const headerHeight = document.querySelector('[data-site-header]')?.getBoundingClientRect().height ?? 0;
  const bounds = section.getBoundingClientRect();
  window.scrollTo({
    top: sectionScrollTop(section.id, bounds.top + window.scrollY, headerHeight),
    behavior: document.documentElement.dataset.motion === 'on' ? 'smooth' : 'instant',
  });
  section.focus({ preventScroll: true });
}
