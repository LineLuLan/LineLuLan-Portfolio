import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import { SITE_URL, SOCIAL } from '@/lib/constants';
import { BootSplashGate } from '@/components/ui/BootSplashGate';
import './globals.css';

const sans = Inter({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Line · linelulan.dev',
    template: '%s · Line',
  },
  description:
    'Trần Nam Anh (Line) — Data Scientist & AI Engineer. Working at the intersection of ML, LLMs, and algorithmic reasoning. Co-founder at 100B Studio, dengue research, GDGoC Vice Lead.',
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
    title: 'Line — Data Scientist & AI Engineer',
    description: 'DABM: Data · Agent · Behavioral · Modeling',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Line — Data Scientist & AI Engineer',
    description: 'DABM: Data · Agent · Behavioral · Modeling',
    images: ['/og.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#000000',
};

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Trần Nam Anh',
  alternateName: 'Line',
  jobTitle: 'Data Scientist & AI Engineer',
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
    <html lang="en" className={`${sans.variable} ${jetbrains.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </head>
      <body className="bg-void text-text-primary antialiased">
        <a
          href="#hero"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-accent-pink focus:px-3 focus:py-1 focus:text-void"
        >
          Skip to content
        </a>
        <BootSplashGate />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
