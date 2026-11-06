// Intent: give Contact a quiet planetary scene above the copy, preserving contrast.
// Status: implemented. Next: motion/viewport checks. Blockers: none. Confidence: isolated decorative region.
import { PixelPlanet } from '@/components/pixel/PixelPlanet';
import { PixelStars } from '@/components/pixel/PixelStars';

export function ContactScene() {
  return (
    <div aria-hidden="true" className="contact-scene pointer-events-none relative mb-4 h-40 overflow-hidden md:h-[196px]">
      <PixelStars />
      <div className="contact-orbit absolute left-1/2 top-1/2 h-[100px] w-[260px] rounded-[50%] border hairline">
        <PixelPlanet kind="moon" size={28} className="absolute -left-2 top-8" />
        <PixelPlanet kind="moon" size={20} className="absolute -right-1 top-9" />
      </div>
      <div className="contact-saturn absolute left-1/2 top-2 -ml-[72px] md:-ml-[90px]">
        <PixelPlanet kind="saturn" size={180} className="size-36 md:size-[180px]" />
      </div>
      <div className="contact-comet absolute right-[8%] top-4 flex items-center gap-2">
        <span className="h-1 w-1 bg-accent opacity-20" />
        <span className="h-1 w-2 bg-accent opacity-40" />
        <span className="h-1.5 w-3 bg-accent opacity-60" />
        <PixelPlanet kind="comet" size={36} />
      </div>
      <style>{`
        .contact-orbit { transform: translate(-50%, -50%) rotate(-18deg); animation: contact-orbit 18s ease-in-out infinite alternate; }
        .contact-saturn { animation: contact-float 7s ease-in-out infinite; }
        .contact-comet { animation: contact-cross 12s ease-in-out infinite alternate; }
        @keyframes contact-orbit { to { transform: translate(-50%, -50%) rotate(12deg); } }
        @keyframes contact-float { 50% { transform: translateY(8px); } }
        @keyframes contact-cross { to { transform: translate(-50px, 24px); } }
      `}</style>
    </div>
  );
}
