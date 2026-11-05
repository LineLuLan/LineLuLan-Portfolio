// Intent: give every same-page section link one header-aware positioning rule.
// Status: R2. Next: browser viewport checks. Blockers: none. Confidence: numeric regression cases.
export function sectionScrollTop(id: string, top: number, height: number, headerHeight: number, viewportHeight: number) {
  if (id === 'hero') return 0;
  const available = Math.max(0, viewportHeight - headerHeight);
  return Math.max(0, top - headerHeight - (height <= available ? (available - height) / 2 : 0));
}

export function scrollToSection(section: HTMLElement) {
  const headerHeight = document.querySelector('[data-site-header]')?.getBoundingClientRect().height ?? 0;
  const bounds = section.getBoundingClientRect();
  window.scrollTo({
    top: sectionScrollTop(section.id, bounds.top + window.scrollY, bounds.height, headerHeight, window.innerHeight),
    behavior: document.documentElement.dataset.motion === 'on' ? 'smooth' : 'instant',
  });
  section.focus({ preventScroll: true });
}
