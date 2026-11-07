import { ImageResponse } from 'next/og';

// Intent: share Line's real portrait and research in the Orbit visual language.
// Status: implemented. Next: production image acceptance. Blockers: sandbox denies build worker spawn. Confidence: static checks only.
export const runtime = 'edge';
export const alt = 'Trần Nam Anh (Line) · Data Engineer & AI Researcher';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OG() {
  const [regular, bold, portrait] = await Promise.all([
    fetch(new URL('./og-fonts/BeVietnamPro-Regular.ttf', import.meta.url)).then((response) => response.arrayBuffer()),
    fetch(new URL('./og-fonts/BeVietnamPro-Bold.ttf', import.meta.url)).then((response) => response.arrayBuffer()),
    fetch(new URL('../public/about/line-square.jpg', import.meta.url)).then((response) => response.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#14111f', color: '#ffffff', fontFamily: 'Be Vietnam Pro', overflow: 'hidden' }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: 'absolute', inset: 0 }}>
          <g stroke="rgba(192,132,252,0.07)" strokeWidth="1">
            {Array.from({ length: 30 }, (_, i) => <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="630" />)}
            {Array.from({ length: 16 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 40} x2="1200" y2={i * 40} />)}
          </g>
          <g transform="translate(936 305) rotate(-22)">
            <ellipse rx="188" ry="165" fill="none" stroke="rgba(192,132,252,0.4)" strokeWidth="1.5" />
            <ellipse rx="226" ry="204" fill="none" stroke="rgba(192,132,252,0.28)" strokeWidth="1.5" />
            <ellipse rx="268" ry="242" fill="none" stroke="rgba(192,132,252,0.18)" strokeWidth="1.5" />
            <circle cx="0" cy="-165" r="9" fill="#c084fc" />
            <circle cx="-226" cy="0" r="11" fill="#8fa8ff" />
            <circle cx="0" cy="204" r="8" fill="#6fd3a8" />
            <circle cx="189.5" cy="171.1" r="10" fill="#ff9a6b" />
            <circle cx="-189.5" cy="-171.1" r="7" fill="#f28bb4" />
          </g>
        </svg>

        <div style={{ display: 'flex', position: 'absolute', left: 782, top: 151, width: 308, height: 308, borderRadius: '50%', border: '4px solid #c084fc', overflow: 'hidden' }}>
          {/* ImageResponse accepts binary image data; this is not a browser image element. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={portrait as unknown as string} alt="" width={300} height={300} style={{ objectFit: 'cover', borderRadius: '50%' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', position: 'absolute', left: 56, top: 58, width: 620 }}>
          <div style={{ display: 'flex', color: '#c7bddb', fontSize: 18, fontFamily: 'monospace' }}>
            {/* Fixed character cells keep the site label monospaced with the bundled Vietnamese font. */}
            {Array.from('linelulan.vercel.app', (letter, i) => <span key={i} style={{ display: 'flex', width: 12, justifyContent: 'center' }}>{letter}</span>)}
          </div>
          <div style={{ display: 'flex', marginTop: 57, fontSize: 72, fontWeight: 700, letterSpacing: '-3px', lineHeight: 1.15 }}>Trần Nam Anh</div>
          <div style={{ display: 'flex', marginTop: 4, color: '#c084fc', fontSize: 64, fontWeight: 700, lineHeight: 1.15 }}>Line</div>
          <div style={{ display: 'flex', marginTop: 28, fontSize: 25, lineHeight: 1.4 }}>Data Engineer · Lead AI Researcher</div>
          <div style={{ display: 'flex', marginTop: 18, color: '#c7bddb', fontSize: 23, lineHeight: 1.4 }}>Chill in coding, feel in styling.</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 50 }}>
            {['GoiBERT co-first author', 'KFC F&B Track winner', 'Clinical ML'].map((chip) => (
              <div key={chip} style={{ display: 'flex', alignItems: 'center', padding: '10px 13px', border: '1px solid #58436e', borderRadius: 6, background: '#211a2e', color: '#e8dcf7', fontSize: 16, whiteSpace: 'nowrap' }}>{chip}</div>
            ))}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Be Vietnam Pro', data: regular, weight: 400, style: 'normal' },
        { name: 'Be Vietnam Pro', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );
}
