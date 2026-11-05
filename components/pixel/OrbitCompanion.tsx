'use client';

import { useEffect, useState } from 'react';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import { SECTIONS, SECTION_ORDER, type SectionId } from '@/lib/constants';
import { SECTION_PLANET } from '@/lib/pixel-planets';

export function OrbitCompanion() {
  const [active, setActive] = useState<SectionId>('whoami');

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_ORDER.forEach((id) => {
      const element = document.getElementById(SECTIONS[id].id);
      if (!element) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActive(id);
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
      );
      observer.observe(element);
      observers.push(observer);
    });
    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  const planet = SECTION_PLANET[active];
  return (
    <div aria-hidden className="pointer-events-none fixed bottom-4 right-4 z-40 hidden min-[480px]:block">
      <PixelPlanet key={planet} kind={planet} size={32} className="companion-hop" />
    </div>
  );
}
