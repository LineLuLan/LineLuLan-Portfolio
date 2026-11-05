import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    // Full map so min-width breakpoints stay ascending (extend would append `nav` after 2xl).
    screens: { sm: '640px', md: '768px', nav: '900px', lg: '1024px', xl: '1280px', '2xl': '1536px' },
    extend: {
      colors: {
        paper: 'var(--color-paper)',
        surface: 'var(--color-surface)',
        panel: 'var(--color-panel)',
        ink: 'var(--color-ink)',
        muted: 'var(--color-muted)',
        accent: 'var(--color-accent)',
        'accent-hover': 'var(--color-accent-hover)',
        'on-accent': 'var(--color-on-accent)',
        line: 'var(--color-line)',
        'tint-a': 'var(--color-tint-a)',
        'tint-b': 'var(--color-tint-b)',
        'tint-c': 'var(--color-tint-c)',
        selection: 'var(--color-selection)',
        success: 'var(--color-success)',

        // P1 compatibility aliases - remove in P4
        void: 'var(--color-paper)',
        midnight: 'var(--color-surface)',
        card: 'var(--color-panel)',
        'accent-purple': 'var(--color-accent)',
        'accent-magenta': 'var(--color-accent)',
        'accent-pink': 'var(--color-accent)',
        'text-primary': 'var(--color-ink)',
        'text-secondary': 'var(--color-muted)',
        'text-tertiary': 'var(--color-muted)',
        'border-subtle': 'var(--color-line)',
        'border-glow': 'var(--color-accent)',
        'rule-strong': 'var(--color-line)',
        'rule-subtle': 'var(--color-line)',
        'num-display': 'var(--color-accent)',
        warning: '#B7791F',
        info: '#2F5BB7',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        serif: ['var(--font-serif)', 'DM Serif Display', 'Georgia', 'serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.5' }],
        sm: ['14px', { lineHeight: '1.55' }],
        base: ['16px', { lineHeight: '1.65' }],
        lg: ['18px', { lineHeight: '1.6' }],
        xl: ['22px', { lineHeight: '1.4' }],
        '2xl': ['28px', { lineHeight: '1.25' }],
        '3xl': ['36px', { lineHeight: '1.15' }],
        '4xl': ['48px', { lineHeight: '1.08' }],
        display: ['clamp(2.8rem, 6.4vw, 6rem)', { lineHeight: '1.05', letterSpacing: '-0.06em' }],
      },
    },
  },
  plugins: [],
};

export default config;
