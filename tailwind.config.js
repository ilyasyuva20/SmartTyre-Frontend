/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#060608',
          800: '#0d0d12',
          700: '#15151d',
          600: '#1f1f2a',
          500: '#2a2a38'
        },
        red: {
          accent: '#ff2a4b',
          glow: '#ff0033',
          dark: '#b30024'
        },
        alloy: {
          light: '#e2e8f0',
          silver: '#94a3b8',
          dark: '#475569'
        }
      },
      boxShadow: {
        'glow-red': '0 0 25px -3px rgba(255, 42, 75, 0.45)',
        'glow-red-sm': '0 0 12px 0px rgba(255, 42, 75, 0.3)',
        'glow-silver': '0 0 20px -3px rgba(148, 163, 184, 0.25)',
        'card-dark': '0 10px 30px -5px rgba(0, 0, 0, 0.8)',
        'inset-glow': 'inset 0 0 15px rgba(255, 42, 75, 0.15)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif']
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 42, 75, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 42, 75, 0.7)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
}
