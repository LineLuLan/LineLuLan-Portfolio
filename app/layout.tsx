import type { Metadata, Viewport } from 'next';
import { Manrope, JetBrains_Mono, Space_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SITE_URL, SOCIAL } from '@/lib/constants';
import { BootSplashGate } from '@/components/ui/BootSplashGate';
import { AnchorScroll } from '@/components/layout/AnchorScroll';
import { MotionProvider } from '@/components/layout/MotionProvider';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { themeInitScript } from '@/lib/themes';
// Intent: mount one tour controller across routes for header-triggered home navigation.
// Status: implemented. Next: browser acceptance. Blockers: none. Confidence: shared layout lifetime.
import { GuidedTour } from '@/components/tour/GuidedTour';
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

const display = Space_Grotesk({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  weight: ['500', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Trần Nam Anh (Line) · Data Engineer & AI Researcher',
    template: '%s · Line',
  },
  description:
    'Trần Nam Anh (Line), Data Engineer at Twohearts Technologies and Lead AI Researcher in clinical ML. Co-first author of GoiBERT, compact Vietnamese encoders. Building LLM systems, evaluation harnesses and data pipelines in Ho Chi Minh City.',
  keywords: [
    'data science',
    'machine learning',
    'AI engineer',
    'data engineer',
    'LLM evaluation',
    'knowledge distillation',
    'GoiBERT',
    'clinical machine learning',
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
    siteName: 'Line · linelulan.vercel.app',
    title: 'Trần Nam Anh (Line) · Data Engineer & AI Researcher',
    description: 'Data Engineer · Lead AI Researcher · GoiBERT co-first author. Chill in coding, feel in styling.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trần Nam Anh (Line) · Data Engineer & AI Researcher',
    description: 'Data Engineer · Lead AI Researcher · GoiBERT co-first author. Chill in coding, feel in styling.',
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
  jobTitle: 'Data Engineer and AI Researcher',
  image: `${SITE_URL}/about/line-square.jpg`,
  worksFor: { '@type': 'Organization', name: 'Twohearts Technologies', url: 'https://twohearts.vn' },
  knowsAbout: ['Machine learning', 'Large language models', 'Data engineering', 'Knowledge distillation', 'Clinical machine learning'],
  url: SITE_URL,
  email: `mailto:${SOCIAL.email}`,
  sameAs: [SOCIAL.github, SOCIAL.linkedin, SOCIAL.kaggle, SOCIAL.openreview],
  alumniOf: {
    '@type': 'CollegeOrUniversity',
    name: 'International University, VNU-HCM',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${jetbrains.variable} ${display.variable}`} suppressHydrationWarning>
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
            <AnchorScroll />
            <GuidedTour />
            <BootSplashGate />
            {children}
            <Analytics />
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
