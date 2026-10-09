/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#060A12',
          900: '#090D16',
          850: '#0D1424',
          800: '#0F172A',
          700: '#1E293B',
          600: '#334155',
        },
        sos: {
          DEFAULT: '#EF4444',
          dark: '#DC2626',
          deep: '#991B1B',
          glow: 'rgba(239, 68, 68, 0.45)',
        },
        alert: {
          green: '#10B981',
          amber: '#F59E0B',
          red: '#EF4444',
        },
        clinic: '#06B6D4',
        hospital: '#3B82F6',
        shelter: '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'ripple': 'ripple 1.5s ease-out infinite',
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.95)', opacity: '1' },
          '100%': { transform: 'scale(1.4)', opacity: '0' },
        },
      },
      screens: {
        'xs': '360px',
      },
    },
  },
  plugins: [],
};
