import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Line — AI / Machine Learning Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: '#F8F7F4',
          display: 'flex',
          flexDirection: 'column',
          padding: '64px',
          color: '#1A1726',
          fontFamily: 'monospace',
        }}
      >
        <div style={{ display: 'flex', color: '#8F2D9A', fontSize: 28, marginBottom: 24 }}>
          $ ~/usr/line/whoami
        </div>
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 600, lineHeight: 1.05 }}>
          Trần Nam Anh — Line
        </div>
        <div style={{ display: 'flex', fontSize: 36, color: '#8F2D9A', marginTop: 16 }}>
          AI / Machine Learning Engineer
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 16,
            marginTop: 64,
            fontSize: 24,
            color: '#8F2D9A',
          }}
        >
          <span>[ DABM ]</span>
          <span style={{ color: '#1A1726' }}>Data · Agent · Behavioral · Modeling</span>
        </div>
        <div
          style={{
            display: 'flex',
            position: 'absolute',
            bottom: 64,
            right: 64,
            fontSize: 24,
            color: '#1A1726',
          }}
        >
          linelulan.dev
        </div>
      </div>
    ),
    { ...size },
  );
}
