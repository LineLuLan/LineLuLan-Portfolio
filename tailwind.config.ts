import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: 'var(--bg-void)',
        midnight: 'var(--bg-midnight)',
        card: 'var(--bg-card)',
        'accent-purple': 'var(--accent-purple)',
        'accent-magenta': 'var(--accent-magenta)',
        'accent-pink': 'var(--accent-pink)',
        'text-primary': 'var(--text-primary)',
        'text-secondary': 'var(--text-secondary)',
        'text-tertiary': 'var(--text-tertiary)',
        'border-subtle': 'var(--border-subtle)',
        'border-glow': 'var(--border-glow)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        info: 'var(--info)',
      },
      fontFamily: {
        mono: ['var(--font-mono)', 'JetBrains Mono', 'monospace'],
        sans: ['var(--font-sans)', 'Geist', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '1.5' }],
        sm: ['13px', { lineHeight: '1.55' }],
        base: ['14px', { lineHeight: '1.6' }],
        lg: ['16px', { lineHeight: '1.5' }],
        xl: ['20px', { lineHeight: '1.3' }],
        '2xl': ['26px', { lineHeight: '1.2' }],
        '3xl': ['38px', { lineHeight: '1.1' }],
        '4xl': ['52px', { lineHeight: '1.05' }],
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'cursor-blink': 'blink 1s steps(2) infinite',
        glitch: 'glitch 0.3s infinite',
        'dot-travel': 'dotTravel 4s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 1px)' },
          '40%': { transform: 'translate(2px, -1px)' },
          '60%': { transform: 'translate(-1px, 2px)' },
          '80%': { transform: 'translate(1px, -2px)' },
        },
        dotTravel: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
