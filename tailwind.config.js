/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ff0040',
          light: '#ff3366',
          dark: '#cc0033'
        },
        secondary: {
          DEFAULT: '#00ffcc',
          light: '#33ffe6',
          dark: '#00cc99'
        },
        accent: '#ffff00',
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Orbitron', 'monospace'],
        racing: ['Orbitron', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'neu-light': '5px 5px 15px #d1d9e6, -5px -5px 15px #ffffff',
        'neu-dark': '5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.05)',
        'neon': '0 0 20px rgba(255, 0, 64, 0.5), 0 0 40px rgba(255, 0, 64, 0.3)',
        'neon-cyan': '0 0 20px rgba(0, 255, 204, 0.5), 0 0 40px rgba(0, 255, 204, 0.3)'
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem'
      },
      animation: {
        'pulse-neon': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'bounce-slow': 'bounce 3s infinite',
        'race-slide': 'raceSlide 2s ease-in-out infinite alternate'
      },
      keyframes: {
        raceSlide: {
          '0%': { transform: 'translateX(-10px)' },
          '100%': { transform: 'translateX(10px)' }
        }
      }
    }
  },
  plugins: [],
  darkMode: 'class',
}