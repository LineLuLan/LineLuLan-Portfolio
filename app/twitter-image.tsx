// Intent: keep Line's Twitter card identical to the Open Graph portrait card.
// Status: shares the edge renderer; assets load from /public at request time (not bundled).
export { default, alt, size, contentType } from './opengraph-image';

// Next.js needs a literal segment config to select the edge runtime during its static analysis.
export const runtime = 'edge';
