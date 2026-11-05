'use client';

import { motion } from 'framer-motion';
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import type { WhatIBringItem } from '@/types';

const CARD_PLANETS = ['earth', 'mars', 'jupiter', 'neptune'] as const;

export function WhatIBring({ items }: { items: WhatIBringItem[] }) {
  return (
    <div className="mt-12">
      <p className="eyebrow mb-4">what i bring</p>
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => (
          <motion.li
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06, ease: 'easeOut' }}
            viewport={{ once: true, margin: '-40px' }}
            className="rounded-[var(--theme-radius)] border hairline bg-panel p-5"
          >
            <PixelPlanet kind={CARD_PLANETS[i % CARD_PLANETS.length] ?? 'earth'} size={24} />
            <h3 className="mt-4 font-sans text-base font-bold text-ink">{item.title}</h3>
            <p className="mt-2 text-base leading-relaxed text-muted">{item.description}</p>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
