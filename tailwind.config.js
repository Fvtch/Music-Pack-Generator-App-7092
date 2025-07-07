/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ninja: {
          dark: '#0a0a0a',
          darker: '#050505',
          accent: '#ff6b35',
          gold: '#ffd700',
          silver: '#c0c0c0',
          zen: '#2d3748',
          calm: '#4a5568',
          energy: '#e53e3e',
          focus: '#38b2ac',
        }
      },
      fontFamily: {
        'zen': ['Inter', 'system-ui', 'sans-serif'],
        'ninja': ['Orbitron', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'zen-breathe': 'zen-breathe 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 107, 53, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 107, 53, 0.8)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'zen-breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}