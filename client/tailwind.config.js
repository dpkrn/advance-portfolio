/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: 'var(--surface)',
          raised: 'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          border: 'var(--surface-border)',
        },
        foreground: 'var(--foreground)',
        accent: {
          DEFAULT: '#6366f1',
          light: 'var(--accent-light)',
          dark: '#4f46e5',
          glow: 'var(--accent-glow)',
          bg: 'var(--accent-bg)',
          border: 'var(--accent-border)',
        },
        muted: {
          DEFAULT: '#71717a',
          foreground: 'var(--muted-foreground)',
        },
        success: {
          DEFAULT: '#22c55e',
          fg: 'var(--success-fg)',
          bg: 'var(--success-bg)',
          border: 'var(--success-border)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          fg: 'var(--warning-fg)',
          bg: 'var(--warning-bg)',
          border: 'var(--warning-border)',
        },
        danger: {
          DEFAULT: '#ef4444',
          fg: 'var(--danger-fg)',
          bg: 'var(--danger-bg)',
          border: 'var(--danger-border)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'var(--grid-pattern)',
        'gradient-radial': 'var(--gradient-radial)',
      },
      backgroundSize: {
        grid: '64px 64px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
        sidebar: 'var(--shadow-sidebar)',
      },
    },
  },
  plugins: [],
};
