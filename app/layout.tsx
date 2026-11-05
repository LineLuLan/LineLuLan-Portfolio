import type { Metadata, Viewport } from 'next';
import { Manrope, JetBrains_Mono, DM_Serif_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SITE_URL, SOCIAL } from '@/lib/constants';
import { BootSplashGate } from '@/components/ui/BootSplashGate';
import { MotionProvider } from '@/components/layout/MotionProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { themeInitScript } from '@/lib/themes';
import './globals.css';

const sans = Manrope({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

const serif = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  style: ['italic', 'normal'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Line · linelulan.dev',
    template: '%s · Line',
  },
  description:
    'Trần Nam Anh (Line) — AI / Machine Learning Engineer. Data engineering at Twohearts Technologies, first-author clinical ML research with HTD HCMC, GoiBERT Vietnamese encoders, GDGoC HCMIU Vice Lead.',
  keywords: [
    'data science',
    'machine learning',
    'AI engineer',
    'causal inference',
    'DABM',
    'LLM',
    'Vietnam',
    'Trần Nam Anh',
    'LineLuLan',
  ],
  authors: [{ name: 'Trần Nam Anh', url: SOCIAL.github }],
  creator: 'Trần Nam Anh',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'linelulan.dev',
    title: 'Line — AI / Machine Learning Engineer',
    description: 'DABM: Data · Agent · Behavioral · Modeling',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Line — AI / Machine Learning Engineer',
    description: 'DABM: Data · Agent · Behavioral · Modeling',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#F8F7F4',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Trần Nam Anh',
  alternateName: 'Line',
  jobTitle: 'AI / Machine Learning Engineer',
  url: SITE_URL,
  email: `mailto:${SOCIAL.email}`,
  sameAs: [SOCIAL.github, SOCIAL.linkedin, SOCIAL.kaggle],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'International University, VNU-HCM',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${jetbrains.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: '[style*="opacity:0"]{opacity:1!important;transform:none!important}' }} />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="bg-paper text-ink antialiased">
        <ThemeProvider>
          <MotionProvider>
            <a
              href="#hero"
              className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-1 focus:text-on-accent"
            >
              Skip to content
            </a>
            <BootSplashGate />
            {children}
            <Analytics />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
