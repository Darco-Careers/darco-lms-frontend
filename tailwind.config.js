/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#fdf8f0',
          100: '#faefd9',
          200: '#f4daa8',
          300: '#ecc06e',
          400: '#e4a33e',
          500: '#d4891f',   // DARCO gold — primary
          600: '#b86e14',
          700: '#8f5110',
          800: '#6d3d10',
          900: '#5a3210',
          950: '#321a07',
        },
        navy: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#c2d1ff',
          300: '#9db2ff',
          400: '#7589fc',
          500: '#5361f5',
          600: '#3d43ea',
          700: '#3234cf',
          800: '#2a2ba7',
          900: '#1a1a5e',   // DARCO navy — secondary
          950: '#0f0f3a',
        },
        surface: {
          50:  '#fafafa',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
          950: '#0c0a09',
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f0f3a 0%, #1a1a5e 40%, #2a1810 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #d4891f 0%, #e4a33e 50%, #ecc06e 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.12), 0 16px 40px rgba(0,0,0,0.10)',
        'gold': '0 0 20px rgba(212,137,31,0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
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
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
