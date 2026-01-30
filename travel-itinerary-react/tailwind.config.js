/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class', // Habilitar dark mode con clase
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        dark: {
          bg: '#0f172a', // slate-900
          bgSecondary: '#1e293b', // slate-800
          bgTertiary: '#334155', // slate-700
          border: '#475569', // slate-600
          text: '#f1f5f9', // slate-100
          textSecondary: '#cbd5e1', // slate-300
          textMuted: '#94a3b8', // slate-400
        },
        // Purple accent colors (mantener el tema púrpura)
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea', // Primary
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        primary: {
          DEFAULT: '#9333ea',
          dark: '#7e22ce',
          light: '#a855f7',
        },
      },
      backgroundImage: {
        'gradient-purple-dark': 'linear-gradient(135deg, #7e22ce 0%, #581c87 100%)',
        'gradient-purple': 'linear-gradient(135deg, #9333ea 0%, #6b21a8 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      },
      boxShadow: {
        'dark': '0 4px 14px 0 rgba(0, 0, 0, 0.4)',
        'dark-lg': '0 10px 28px 0 rgba(0, 0, 0, 0.5)',
        'card': '0 5px 20px rgba(0,0,0,0.3)',
        'card-hover': '0 8px 25px rgba(0,0,0,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in',
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      minHeight: {
        'touch': '44px', // Touch-friendly para móvil
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
}
