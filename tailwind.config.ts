import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"DM Serif Display"', 'Georgia', ...fontFamily.serif],
        sans: ['"DM Sans"', 'system-ui', ...fontFamily.sans],
        mono: ['"DM Mono"', 'ui-monospace', ...fontFamily.mono],
      },
      colors: {
        accent: {
          DEFAULT: '#2563EB',
          light: '#60A5FA',
          dark: '#1D4ED8',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            color: 'var(--tw-prose-body)',
            a: {
              color: '#2563EB',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(37,99,235,0.4)',
              textUnderlineOffset: '3px',
              '&:hover': {
                textDecorationColor: '#2563EB',
              },
            },
          },
        },
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-up-delay': 'fadeUp 0.6s 0.15s ease-out both',
        'fade-up-delay-2': 'fadeUp 0.6s 0.3s ease-out both',
        'fade-up-delay-3': 'fadeUp 0.6s 0.45s ease-out both',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
