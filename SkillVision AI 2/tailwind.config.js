/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/react-app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Saudi Vision 2030 Green Palette
        vision: {
          50: '#f0fdf4',   // Lightest green
          100: '#dcfce7',  // Very light green
          200: '#bbf7d0',  // Light green
          300: '#86efac',  // Medium light green
          400: '#4ade80',  // Medium green
          500: '#22c55e',  // Primary green (Saudi green)
          600: '#16a34a',  // Darker green
          700: '#15803d',  // Dark green
          800: '#166534',  // Very dark green
          900: '#14532d',  // Darkest green
        },
        // Complementary desert/sand colors
        desert: {
          50: '#fefbf3',   // Very light sand
          100: '#fef7e6',  // Light sand
          200: '#fdecc9',  // Medium sand
          300: '#fbd891',  // Warm sand
          400: '#f7b955',  // Golden sand
          500: '#f59e0b',  // Deep gold
          600: '#d97706',  // Amber
          700: '#b45309',  // Dark amber
          800: '#92400e',  // Very dark amber
          900: '#78350f',  // Darkest amber
        },
        // Neutral grays with warm undertones
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
        // Accent colors inspired by Saudi heritage
        heritage: {
          blue: '#0ea5e9',    // Sky blue
          gold: '#eab308',    // Saudi gold
          white: '#ffffff',   // Pure white
          pearl: '#f8fafc',   // Pearl white
        }
      },
      fontFamily: {
        'arabic': ['Noto Sans Arabic', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'system-ui', 'sans-serif'],
        'body': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading': ['2rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      boxShadow: {
        'vision': '0 10px 40px -10px rgba(34, 197, 94, 0.2)',
        'heritage': '0 20px 60px -10px rgba(34, 197, 94, 0.15)',
        'glow': '0 0 30px rgba(34, 197, 94, 0.3)',
      },
      backgroundImage: {
        'vision-gradient': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
        'desert-gradient': 'linear-gradient(135deg, #f7b955 0%, #f59e0b 100%)',
        'hero-gradient': 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(34, 197, 94, 0.6)' },
        },
      },
    },
  },
  plugins: [],
};
