'use client';

// Intent: share photo previews and an accessible modal between Experience and Record.
// Status: modal opener exempt from page alignment. Next: browser regression gate. Blockers: none. Confidence: native modal isolation.
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import type { ExperiencePhoto } from '@/types';
import './experience-photos.css';

export function Lightbox({ photos, title, initialIndex, onClose }: {
  photos: ExperiencePhoto[]; title: string; initialIndex: number; onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const { reducedMotion } = useTheme();
  const photo = photos[index];

  useEffect(() => {
    const element = dialog.current;
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const overflow = document.body.style.overflow;
    element?.showModal();
    closeButton.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      element?.close();
      document.body.style.overflow = overflow;
      trigger.current?.focus({ preventScroll: true });
    };
  }, []);

  function dismiss() {
    // Restore focus before unmounting, so Record never observes focus leaving its card.
    dialog.current?.close();
    trigger.current?.focus({ preventScroll: true });
    onClose();
  }

  function navigate(event: KeyboardEvent<HTMLDialogElement>) {
    // Keep Record's underlying Escape handler from dismissing the thumbnail's card.
    event.stopPropagation();
    if (event.key === 'Escape') { event.preventDefault(); dismiss(); }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      setIndex((current) => (current + (event.key === 'ArrowRight' ? 1 : -1) + photos.length) % photos.length);
    }
    if (event.key === 'Tab') {
      const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button'));
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
  }

  if (!photo) return null;
  return (
    <dialog ref={dialog} role="dialog" aria-modal="true" aria-label={`Photos: ${title}`}
      className="experience-lightbox" data-reduced-motion={reducedMotion}
      onKeyDownCapture={navigate} onCancel={(event) => { event.preventDefault(); dismiss(); }}
      onClick={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
      <div className="experience-lightbox-content">
        <div className="experience-lightbox-controls">
          <p className="text-sm text-muted" aria-live="polite">{index + 1} / {photos.length}</p>
          <button ref={closeButton} type="button" onClick={dismiss} aria-label="Close photos">×</button>
        </div>
        <figure aria-live="polite">
          <Image key={photo.src} src={photo.src} alt={photo.alt} width={photo.width} height={photo.height}
            sizes="90vw" loading="eager" className="experience-lightbox-image" />
          <figcaption className="experience-photo-caption">{photo.caption ?? photo.alt}</figcaption>
        </figure>
        {photos.length > 1 && <div className="experience-lightbox-controls">
          <button type="button" onClick={() => setIndex((index + photos.length - 1) % photos.length)} aria-label="Previous photo">← Previous</button>
          <button type="button" onClick={() => setIndex((index + 1) % photos.length)} aria-label="Next photo">Next →</button>
        </div>}
      </div>
    </dialog>
  );
}

// Intent: crop project screenshots without changing existing photo previews. Status: opt-in. Next: none. Blockers: none. Confidence: full-image modal retained.
export default function PhotoGallery({ photos, title, eager = false, thumbnail = false, cropThumbnails = false }: {
  photos: ExperiencePhoto[]; title: string; eager?: boolean; thumbnail?: boolean; cropThumbnails?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <div className={thumbnail ? 'experience-photo-thumbnail' : `experience-photo-grid${cropThumbnails ? ' sm:grid-cols-2' : ''}`} data-count={photos.length}>
        {photos.map((photo, index) => (
          <figure key={photo.src} data-portrait={photo.height > photo.width} style={{ '--photo-ratio': photo.width / photo.height } as CSSProperties}>
            <button type="button" data-no-align className="experience-photo-button" aria-label={`View photo: ${photo.caption ?? photo.alt}`}
              onClick={() => setOpen(index)} aria-haspopup="dialog" style={cropThumbnails ? { width: '100%' } : undefined}>
              <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height}
                sizes={thumbnail ? '(min-width: 1024px) 306px, calc(100vw - 80px)' : photos.length === 1
                  ? '(min-width: 1024px) 640px, calc(100vw - 96px)'
                  : '(min-width: 1024px) 300px, calc(100vw - 96px)'}
                loading={eager && index === 0 ? 'eager' : 'lazy'}
                style={cropThumbnails ? { aspectRatio: '16 / 10', height: 'auto', maxHeight: 'none', objectFit: photo.fit ?? 'cover', objectPosition: photo.fit ? 'center' : 'top', background: photo.fit ? '#ffffff' : undefined } : undefined} />
            </button>
            {!thumbnail && photo.caption && <figcaption className="experience-photo-caption">{photo.caption}</figcaption>}
          </figure>
        ))}
      </div>
      {open !== null && <Lightbox photos={photos} title={title} initialIndex={open} onClose={() => setOpen(null)} />}
    </>
  );
}
