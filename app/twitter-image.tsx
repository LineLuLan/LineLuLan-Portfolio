// Intent: keep Line's Twitter card identical to the Open Graph portrait card.
// Status: shared renderer. Next: production route acceptance. Blockers: sandbox denies build worker spawn. Confidence: static checks only.
export { default, alt, size, contentType } from './opengraph-image';

// Next.js needs a literal segment config to select the edge runtime during its static analysis.
export const runtime = 'edge';
