/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light mode - Clean & Professional
        light: {
          bg: '#f8fafc',         // slate-50 - fondo principal
          bgSecondary: '#ffffff', // white - cards
          bgTertiary: '#f1f5f9',  // slate-100 - elementos secundarios
          border: '#e2e8f0',      // slate-200 - bordes sutiles
          borderDark: '#cbd5e1',  // slate-300 - bordes más visibles
          text: '#1e293b',        // slate-800 - texto principal
          textSecondary: '#475569', // slate-600 - texto secundario
          textMuted: '#64748b',   // slate-500 - texto atenuado
        },
        // Blue accent - Travel theme
        blue: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
        // Warm accent for highlights
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1d4ed8',
          light: '#3b82f6',
        },
      },
      backgroundImage: {
        'gradient-blue': 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        'gradient-blue-light': 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
        'gradient-hero': 'linear-gradient(135deg, #1e40af 0%, #7c3aed 100%)',
        'gradient-warm': 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'card': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'elevated': '0 12px 32px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(16px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
