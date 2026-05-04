import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Line — Data Scientist & AI Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#000000',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px',
          color: '#ffffff',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', color: '#e07b97', fontSize: 28, marginBottom: 24 }}>
          $ ~/usr/line/whoami
        </div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 600, lineHeight: 1.05 }}>
          Trần Nam Anh — Line
        </div>
        <div style={{ display: 'flex', fontSize: 36, color: '#a3a3a3', marginTop: 16 }}>
          Data Scientist &amp; AI Engineer
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginTop: 64,
            fontSize: 24,
            color: '#e07b97',
          }}
        >
          <span>[ DABM ]</span>
          <span style={{ color: '#a3a3a3' }}>Data · Agent · Behavioral · Modeling</span>
        </div>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 64,
            right: 64,
            fontSize: 24,
            color: '#6b6b6b',
          }}
        >
          linelulan.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
